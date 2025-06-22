// OTP Service for Learnnect - Free Implementation
// Uses multiple free providers for email and SMS OTP verification

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

class OTPService {
  private readonly otpCollection = 'otpVerifications';
  private readonly otpLength = 6;
  private readonly otpExpiryMinutes = 10;
  private readonly maxAttempts = 3;

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

  // Send OTP via Email (Free implementation)
  private async sendOTPEmail(email: string, otp: string, purpose: string): Promise<boolean> {
    try {
      // Method 1: Use EmailJS (Free tier: 200 emails/month)
      // You can sign up at https://www.emailjs.com/
      
      // Method 2: Use your own email service
      // Since you have support@learnnect.com, you can use Gmail API
      
      // Method 3: Use Resend (Free tier: 3,000 emails/month)
      // Sign up at https://resend.com/
      
      // For now, we'll use console logging and return true
      // In production, implement one of the above methods
      
      console.log('📧 Sending OTP Email:', {
        to: email,
        otp,
        purpose,
        subject: `Your Learnnect OTP: ${otp}`,
        body: `Your OTP for ${purpose} is: ${otp}. Valid for ${this.otpExpiryMinutes} minutes.`
      });

      // TODO: Implement actual email sending
      // Example with EmailJS:
      /*
      const templateParams = {
        to_email: email,
        otp_code: otp,
        purpose: purpose,
        expiry_minutes: this.otpExpiryMinutes
      };
      
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      );
      */

      return true;
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return false;
    }
  }

  // Send OTP via SMS (Free implementation)
  private async sendOTPSMS(phone: string, otp: string, purpose: string): Promise<boolean> {
    try {
      // Method 1: Twilio Trial (Free credits for testing)
      // Sign up at https://www.twilio.com/try-twilio
      
      // Method 2: TextLocal (Free credits for testing)
      // Sign up at https://www.textlocal.in/
      
      // Method 3: MSG91 (Free credits for testing)
      // Sign up at https://msg91.com/
      
      // Method 4: Fast2SMS (Free credits for testing)
      // Sign up at https://www.fast2sms.com/
      
      // For now, we'll use console logging and return true
      // In production, implement one of the above methods
      
      console.log('📱 Sending OTP SMS:', {
        to: `+91${phone}`,
        otp,
        purpose,
        message: `Your Learnnect OTP is: ${otp}. Valid for ${this.otpExpiryMinutes} minutes. Do not share this code.`
      });

      // TODO: Implement actual SMS sending
      // Example with Twilio:
      /*
      const client = twilio(accountSid, authToken);
      
      await client.messages.create({
        body: `Your Learnnect OTP is: ${otp}. Valid for ${this.otpExpiryMinutes} minutes. Do not share this code.`,
        from: '+1234567890', // Your Twilio number
        to: `+91${phone}`
      });
      */

      return true;
    } catch (error) {
      console.error('❌ Error sending OTP SMS:', error);
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
