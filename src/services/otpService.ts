// OTP Service for Learnnect - Production Implementation
// Uses MSG91 for SMS and Gmail API for email OTP verification

import { collection, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface OTPData {
  code: string;
  email?: string;
  phone?: string;
  type: 'email' | 'sms';
  purpose: 'signup' | 'login' | 'password_reset' | 'phone_verification';
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  createdAt: any;
}

interface OTPVerificationResult {
  success: boolean;
  message: string;
  remainingAttempts?: number;
}

interface MSG91Config {
  authKey: string;
  templateId: string;
  senderId: string;
  baseUrl: string;
}

interface GmailConfig {
  serviceAccountEmail: string;
  privateKey: string;
  clientEmail: string;
  projectId: string;
}

interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  baseUrl: string;
}

class OTPService {
  private readonly otpCollection = 'otpVerifications';
  private readonly otpLength = 6;
  private readonly otpExpiryMinutes = 10;
  private readonly maxAttempts = 3;

  // MSG91 Configuration
  private readonly msg91Config: MSG91Config = {
    authKey: import.meta.env.VITE_MSG91_AUTH_KEY || '',
    templateId: import.meta.env.VITE_MSG91_TEMPLATE_ID || '',
    senderId: import.meta.env.VITE_MSG91_SENDER_ID || 'LRNECT',
    baseUrl: 'https://api.msg91.com/api/v5'
  };

  // Gmail Configuration (Legacy)
  private readonly gmailConfig: GmailConfig = {
    serviceAccountEmail: import.meta.env.VITE_GMAIL_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: import.meta.env.VITE_GMAIL_PRIVATE_KEY || '',
    clientEmail: 'support@learnnect.com',
    projectId: import.meta.env.VITE_GMAIL_PROJECT_ID || 'learnnect-gdrive'
  };

  // Resend Configuration (Recommended for Email)
  private readonly resendConfig: ResendConfig = {
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'support@learnnect.com',
    baseUrl: 'https://api.resend.com'
  };

  // Generate a random OTP code
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate OTP ID for storage
  private generateOTPId(identifier: string, type: string): string {
    return `${type}_${identifier.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  // Send Email OTP (Free using EmailJS or similar)
  async sendEmailOTP(email: string, purpose: 'signup' | 'login' | 'password_reset' = 'signup'): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOTP();
      const otpId = this.generateOTPId(email, 'email');
      
      // Store OTP in Firestore
      const otpData: OTPData = {
        code: otp,
        email,
        type: 'email',
        purpose,
        expiresAt: Date.now() + (this.otpExpiryMinutes * 60 * 1000),
        attempts: 0,
        maxAttempts: this.maxAttempts,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, this.otpCollection, otpId), otpData);

      // Send email using our email service
      const emailSent = await this.sendOTPEmail(email, otp, purpose);
      
      if (emailSent) {
        return {
          success: true,
          message: `OTP sent to ${email}. Please check your inbox.`
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('❌ Error sending email OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  // Send SMS OTP (Free using Twilio trial or similar)
  async sendSMSOTP(phone: string, purpose: 'signup' | 'phone_verification' = 'phone_verification'): Promise<{ success: boolean; message: string }> {
    try {
      // Validate Indian phone number
      if (!/^[6-9]\d{9}$/.test(phone)) {
        return {
          success: false,
          message: 'Please enter a valid Indian phone number starting with 6, 7, 8, or 9'
        };
      }

      const otp = this.generateOTP();
      const otpId = this.generateOTPId(phone, 'sms');
      
      // Store OTP in Firestore
      const otpData: OTPData = {
        code: otp,
        phone,
        type: 'sms',
        purpose,
        expiresAt: Date.now() + (this.otpExpiryMinutes * 60 * 1000),
        attempts: 0,
        maxAttempts: this.maxAttempts,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, this.otpCollection, otpId), otpData);

      // Send SMS using free provider
      const smsSent = await this.sendOTPSMS(phone, otp, purpose);
      
      if (smsSent) {
        return {
          success: true,
          message: `OTP sent to +91${phone}. Please check your messages.`
        };
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('❌ Error sending SMS OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  // Verify OTP
  async verifyOTP(identifier: string, code: string, type: 'email' | 'sms'): Promise<OTPVerificationResult> {
    try {
      const otpId = this.generateOTPId(identifier, type);
      const otpDoc = await getDoc(doc(db, this.otpCollection, otpId));

      if (!otpDoc.exists()) {
        return {
          success: false,
          message: 'OTP not found or expired. Please request a new one.'
        };
      }

      const otpData = otpDoc.data() as OTPData;

      // Check if OTP is expired
      if (Date.now() > otpData.expiresAt) {
        await deleteDoc(doc(db, this.otpCollection, otpId));
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check if max attempts exceeded
      if (otpData.attempts >= otpData.maxAttempts) {
        await deleteDoc(doc(db, this.otpCollection, otpId));
        return {
          success: false,
          message: 'Maximum verification attempts exceeded. Please request a new OTP.'
        };
      }

      // Verify OTP code
      if (otpData.code === code) {
        // OTP is correct - delete it and return success
        await deleteDoc(doc(db, this.otpCollection, otpId));
        return {
          success: true,
          message: 'OTP verified successfully!'
        };
      } else {
        // Incorrect OTP - increment attempts
        const newAttempts = otpData.attempts + 1;
        await setDoc(doc(db, this.otpCollection, otpId), {
          ...otpData,
          attempts: newAttempts
        });

        const remainingAttempts = otpData.maxAttempts - newAttempts;
        
        if (remainingAttempts > 0) {
          return {
            success: false,
            message: `Incorrect OTP. ${remainingAttempts} attempts remaining.`,
            remainingAttempts
          };
        } else {
          await deleteDoc(doc(db, this.otpCollection, otpId));
          return {
            success: false,
            message: 'Maximum verification attempts exceeded. Please request a new OTP.'
          };
        }
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      };
    }
  }

  // Resend OTP
  async resendOTP(identifier: string, type: 'email' | 'sms', purpose: string): Promise<{ success: boolean; message: string }> {
    try {
      // Delete existing OTP
      const otpId = this.generateOTPId(identifier, type);
      await deleteDoc(doc(db, this.otpCollection, otpId));

      // Send new OTP
      if (type === 'email') {
        return await this.sendEmailOTP(identifier, purpose as any);
      } else {
        return await this.sendSMSOTP(identifier, purpose as any);
      }
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      };
    }
  }

  // Send OTP via Email using Resend (Recommended)
  private async sendOTPEmail(email: string, otp: string, purpose: string): Promise<boolean> {
    try {
      if (!this.resendConfig.apiKey) {
        console.log('📧 Resend API not configured, logging OTP:', otp);
        return true; // Return true for development
      }

      const emailContent = this.generateOTPEmailHTML(email, otp, purpose);
      const success = await this.sendResendEmail(email, emailContent, otp, purpose);

      if (success) {
        console.log('✅ OTP email sent successfully via Resend');
        return true;
      } else {
        console.error('❌ Failed to send OTP email via Resend');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return false;
    }
  }

  // Generate professional OTP email HTML
  private generateOTPEmailHTML(_email: string, otp: string, purpose: string): string {
    const purposeTitle = {
      'signup': 'Welcome to Learnnect! 🎉',
      'login': 'Secure Login Verification 🔐',
      'password_reset': 'Password Reset Request 🔑',
      'phone_verification': 'Phone Verification 📱'
    }[purpose] || 'Account Verification';

    const purposeMessage = {
      'signup': 'Thank you for joining Learnnect! We\'re excited to have you start your learning journey with us.',
      'login': 'We detected a login attempt to your account. Please verify it\'s you.',
      'password_reset': 'You requested to reset your password. Use the code below to proceed.',
      'phone_verification': 'Please verify your phone number to complete your account setup.'
    }[purpose] || 'Please verify your account to continue.';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${purposeTitle} - Learnnect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 20px 20px 0 0; padding: 40px 30px; text-align: center; border-bottom: 3px solid #00f5ff;">
          <h1 style="color: #00f5ff; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 0 20px rgba(0,245,255,0.5);">
            Learnnect
          </h1>
          <p style="color: #ff0080; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">
            Transform Your Career with Technology
          </p>
        </div>

        <!-- Content -->
        <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a1a; margin-bottom: 20px; font-size: 24px; font-weight: bold;">
            ${purposeTitle}
          </h2>

          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            ${purposeMessage}
          </p>

          <!-- OTP Display -->
          <div style="text-align: center; margin: 35px 0;">
            <div style="background: linear-gradient(135deg, #00f5ff 0%, #ff0080 100%); color: white; font-size: 36px; font-weight: bold; padding: 25px 30px; border-radius: 15px; letter-spacing: 12px; display: inline-block; box-shadow: 0 8px 25px rgba(0,245,255,0.3); text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${otp}
            </div>
            <p style="color: #718096; font-size: 14px; margin-top: 15px; font-weight: 500;">
              Your ${this.otpExpiryMinutes}-minute verification code
            </p>
          </div>

          <!-- Security Warning -->
          <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border: 2px solid #fc8181; border-radius: 12px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 20px; margin-right: 10px;">🔒</span>
              <strong style="color: #c53030; font-size: 16px;">Security Notice</strong>
            </div>
            <p style="color: #742a2a; margin: 0; font-size: 14px; line-height: 1.5;">
              This code expires in <strong>${this.otpExpiryMinutes} minutes</strong>. Never share this code with anyone.
              Learnnect will never ask for your verification code via phone or email.
            </p>
          </div>

          <!-- Next Steps -->
          ${purpose === 'signup' ? `
          <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border: 2px solid #68d391; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 20px; margin-right: 10px;">🚀</span>
              <strong style="color: #276749; font-size: 16px;">What's Next?</strong>
            </div>
            <ul style="color: #2f855a; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
              <li>Complete your email verification</li>
              <li>Explore our comprehensive course catalog</li>
              <li>Join our community of learners</li>
              <li>Start your transformation journey</li>
            </ul>
          </div>
          ` : ''}

          <!-- Support -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              Need help? We're here for you!<br>
              <a href="mailto:support@learnnect.com" style="color: #00f5ff; text-decoration: none; font-weight: 600;">
                support@learnnect.com
              </a> |
              <a href="https://learnnect.com" style="color: #ff0080; text-decoration: none; font-weight: 600;">
                learnnect.com
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.8);">
          <p style="margin: 0; font-size: 12px;">
            © 2024 Learnnect. All rights reserved.<br>
            This email was sent to verify your account. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>`;
  }

  // Send email using Resend API
  private async sendResendEmail(to: string, htmlContent: string, otp: string, purpose: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.resendConfig.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Learnnect <${this.resendConfig.fromEmail}>`,
          to: [to],
          subject: `Your Learnnect OTP: ${otp}`,
          html: htmlContent,
          tags: [
            { name: 'category', value: 'otp' },
            { name: 'purpose', value: purpose }
          ]
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Resend email sent successfully:', result.id);
        return true;
      } else {
        console.error('❌ Resend API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Resend API Error:', error);
      return false;
    }
  }

  // Send OTP via SMS using MSG91
  private async sendOTPSMS(phone: string, otp: string, purpose: string): Promise<boolean> {
    try {
      if (!this.msg91Config.authKey || !this.msg91Config.templateId) {
        console.log('📱 MSG91 not configured, logging OTP:', otp);
        return true; // Return true for development
      }

      const success = await this.sendMSG91OTP(phone, otp, purpose);

      if (success) {
        console.log('✅ OTP SMS sent successfully via MSG91');
        return true;
      } else {
        console.error('❌ Failed to send OTP SMS via MSG91');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending OTP SMS:', error);
      return false;
    }
  }

  // Format phone number for MSG91 (add country code)
  private formatPhoneForMSG91(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    return `91${cleanPhone}`; // Add India country code
  }

  // Send OTP using MSG91 API
  private async sendMSG91OTP(phone: string, otp: string, _purpose: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneForMSG91(phone);

      // MSG91 Send OTP API
      const url = `${this.msg91Config.baseUrl}/otp`;
      const payload = {
        template_id: this.msg91Config.templateId,
        mobile: formattedPhone,
        authkey: this.msg91Config.authKey,
        otp: otp,
        otp_expiry: this.otpExpiryMinutes,
        sender: this.msg91Config.senderId
      };

      console.log('📱 Sending MSG91 OTP:', {
        phone: formattedPhone,
        templateId: this.msg91Config.templateId,
        otp: otp
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': this.msg91Config.authKey
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.type === 'success') {
        console.log('✅ MSG91 OTP sent successfully:', result);
        return true;
      } else {
        console.error('❌ MSG91 API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ MSG91 API Error:', error);
      return false;
    }
  }

  // Clean up expired OTPs (call this periodically)
  async cleanupExpiredOTPs(): Promise<void> {
    try {
      // This would be implemented as a Cloud Function or scheduled task
      console.log('🧹 Cleaning up expired OTPs...');
    } catch (error) {
      console.error('❌ Error cleaning up expired OTPs:', error);
    }
  }
}

export const otpService = new OTPService();
export default otpService;
