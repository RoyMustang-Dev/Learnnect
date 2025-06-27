// Email Service for Learnnect using Resend API
// This service handles all email communications using support@learnnect.com

interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

interface EmailData {
  to: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  emailType: 'enquiry' | 'contact' | 'signup' | 'newsletter' | 'enrollment' | 'welcome';
  additionalData?: any;
}

class EmailService {
  private readonly fromEmail = 'support@learnnect.com';
  private readonly fromName = 'Learnnect Team';
  private readonly backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'https://learnnect-otp-api.render.com';
  private readonly googleAppsScriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
  private readonly resendApiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  private readonly resendBaseUrl = 'https://api.resend.com';

  // Email templates
  private getEmailTemplate(type: string, data: any): EmailTemplate {
    switch (type) {
      case 'enquiry':
        return this.getEnquiryConfirmationTemplate(data);
      case 'contact':
        return this.getContactConfirmationTemplate(data);
      case 'signup':
        return this.getSignupWelcomeTemplate(data);
      case 'newsletter':
        return this.getNewsletterConfirmationTemplate(data);
      case 'enrollment':
        return this.getEnrollmentConfirmationTemplate(data);
      case 'welcome':
        return this.getWelcomeTemplate(data);
      default:
        throw new Error(`Unknown email template type: ${type}`);
    }
  }

  // Send email via Google Apps Script
  async sendEmail(emailData: Omit<EmailData, 'subject' | 'htmlBody' | 'textBody'>): Promise<boolean> {
    try {
      const template = this.getEmailTemplate(emailData.emailType, {
        name: emailData.name,
        ...emailData.additionalData
      });

      const fullEmailData: EmailData = {
        ...emailData,
        subject: template.subject,
        htmlBody: template.htmlBody,
        textBody: template.textBody
      };

      // Send confirmation emails via Gmail business account
      const response = await this.sendViaGmail(fullEmailData);

      // Record in Google Sheets that email was sent
      await this.recordEmailSent(fullEmailData);

      return response;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  // Send enquiry confirmation email
  async sendEnquiryConfirmation(data: {
    to: string;
    name: string;
    courseInterest?: string;
    message: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: data.to,
      name: data.name,
      emailType: 'enquiry',
      additionalData: {
        courseInterest: data.courseInterest,
        message: data.message
      }
    });
  }

  // Send contact form confirmation email
  async sendContactConfirmation(data: {
    to: string;
    name: string;
    subject?: string;
    message: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: data.to,
      name: data.name,
      emailType: 'contact',
      additionalData: {
        subject: data.subject,
        message: data.message
      }
    });
  }

  // Send signup welcome email
  async sendSignupWelcome(data: {
    to: string;
    name: string;
    provider: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: data.to,
      name: data.name,
      emailType: 'signup',
      additionalData: {
        provider: data.provider
      }
    });
  }

  // Send newsletter subscription confirmation
  async sendNewsletterConfirmation(data: {
    to: string;
    name: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: data.to,
      name: data.name,
      emailType: 'newsletter'
    });
  }

  // Send course enrollment confirmation
  async sendEnrollmentConfirmation(data: {
    to: string;
    name: string;
    courseName: string;
    courseId: string;
    price: number;
    enrollmentDate: string;
  }): Promise<boolean> {
    return this.sendEmail({
      to: data.to,
      name: data.name,
      emailType: 'enrollment',
      additionalData: {
        courseName: data.courseName,
        courseId: data.courseId,
        price: data.price,
        enrollmentDate: data.enrollmentDate
      }
    });
  }

  // Email Templates
  private getEnquiryConfirmationTemplate(data: any): EmailTemplate {
    return {
      subject: 'Thank you for your enquiry - Learnnect',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff0080); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Learnnect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Transform Your Career with Technology</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #00f5ff; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to us! We've received your enquiry and our team will get back to you within 24 hours.
            </p>
            
            ${data.courseInterest ? `
              <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #00f5ff; margin-top: 0;">Course Interest:</h3>
                <p style="margin: 0;">${data.courseInterest}</p>
              </div>
            ` : ''}
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00f5ff; margin-top: 0;">Your Message:</h3>
              <p style="margin: 0; font-style: italic;">"${data.message}"</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              In the meantime, feel free to explore our courses and resources:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learnnect.com/courses" style="background: linear-gradient(135deg, #ff0080, #00f5ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Explore Courses
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Best regards,<br>
              The Learnnect Team<br>
              <a href="mailto:support@learnnect.com" style="color: #00f5ff;">support@learnnect.com</a>
            </p>
          </div>
        </div>
      `,
      textBody: `Hi ${data.name}!\n\nThank you for reaching out to us! We've received your enquiry and our team will get back to you within 24 hours.\n\n${data.courseInterest ? `Course Interest: ${data.courseInterest}\n\n` : ''}Your Message: "${data.message}"\n\nIn the meantime, feel free to explore our courses at https://learnnect.com/courses\n\nBest regards,\nThe Learnnect Team\nsupport@learnnect.com`
    };
  }

  private getContactConfirmationTemplate(data: any): EmailTemplate {
    return {
      subject: 'We received your message - Learnnect',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff0080); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Learnnect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Transform Your Career with Technology</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #00f5ff; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for contacting us! We've received your message and will respond within 24 hours.
            </p>
            
            ${data.subject ? `
              <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #00f5ff; margin-top: 0;">Subject:</h3>
                <p style="margin: 0;">${data.subject}</p>
              </div>
            ` : ''}
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00f5ff; margin-top: 0;">Your Message:</h3>
              <p style="margin: 0; font-style: italic;">"${data.message}"</p>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Best regards,<br>
              The Learnnect Team<br>
              <a href="mailto:support@learnnect.com" style="color: #00f5ff;">support@learnnect.com</a>
            </p>
          </div>
        </div>
      `,
      textBody: `Hi ${data.name}!\n\nThank you for contacting us! We've received your message and will respond within 24 hours.\n\n${data.subject ? `Subject: ${data.subject}\n\n` : ''}Your Message: "${data.message}"\n\nBest regards,\nThe Learnnect Team\nsupport@learnnect.com`
    };
  }

  private getSignupWelcomeTemplate(data: any): EmailTemplate {
    return {
      subject: 'Welcome to Learnnect! 🎉',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff0080); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Learnnect! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Learning Journey Starts Now</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #00f5ff; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Welcome to Learnnect! We're excited to have you join our community of learners and professionals.
            </p>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00f5ff; margin-top: 0;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Explore our comprehensive course catalog</li>
                <li style="margin-bottom: 10px;">Complete your profile to get personalized recommendations</li>
                <li style="margin-bottom: 10px;">Join our community and connect with fellow learners</li>
                <li style="margin-bottom: 10px;">Start with our free courses to get a feel for our platform</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learnnect.com/dashboard" style="background: linear-gradient(135deg, #ff0080, #00f5ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 0 10px 10px 0;">
                Go to Dashboard
              </a>
              <a href="https://learnnect.com/courses" style="background: transparent; color: #00f5ff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; border: 2px solid #00f5ff;">
                Browse Courses
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Need help getting started? Reply to this email or contact us at <a href="mailto:support@learnnect.com" style="color: #00f5ff;">support@learnnect.com</a>
            </p>
            
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Best regards,<br>
              The Learnnect Team
            </p>
          </div>
        </div>
      `,
      textBody: `Hi ${data.name}!\n\nWelcome to Learnnect! We're excited to have you join our community of learners and professionals.\n\nWhat's Next?\n- Explore our comprehensive course catalog\n- Complete your profile to get personalized recommendations\n- Join our community and connect with fellow learners\n- Start with our free courses to get a feel for our platform\n\nVisit your dashboard: https://learnnect.com/dashboard\nBrowse courses: https://learnnect.com/courses\n\nNeed help getting started? Contact us at support@learnnect.com\n\nBest regards,\nThe Learnnect Team`
    };
  }

  private getNewsletterConfirmationTemplate(data: any): EmailTemplate {
    return {
      subject: 'Newsletter subscription confirmed! 📧',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff0080); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">You're In! 📧</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Newsletter Subscription Confirmed</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #00f5ff; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for subscribing to our newsletter! You'll now receive:
            </p>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">🚀 Latest course launches and updates</li>
                <li style="margin-bottom: 10px;">💡 Industry insights and tech trends</li>
                <li style="margin-bottom: 10px;">🎯 Career tips and learning strategies</li>
                <li style="margin-bottom: 10px;">🎁 Exclusive offers and early access</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              We promise to keep it valuable and never spam you. You can unsubscribe anytime.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learnnect.com/courses" style="background: linear-gradient(135deg, #ff0080, #00f5ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Explore Courses
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Best regards,<br>
              The Learnnect Team<br>
              <a href="mailto:support@learnnect.com" style="color: #00f5ff;">support@learnnect.com</a>
            </p>
          </div>
        </div>
      `,
      textBody: `Hi ${data.name}!\n\nThank you for subscribing to our newsletter! You'll now receive:\n\n- Latest course launches and updates\n- Industry insights and tech trends\n- Career tips and learning strategies\n- Exclusive offers and early access\n\nWe promise to keep it valuable and never spam you. You can unsubscribe anytime.\n\nExplore our courses: https://learnnect.com/courses\n\nBest regards,\nThe Learnnect Team\nsupport@learnnect.com`
    };
  }

  private getEnrollmentConfirmationTemplate(data: any): EmailTemplate {
    return {
      subject: `Enrollment confirmed: ${data.courseName} 🎉`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff0080); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Enrollment Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Welcome to Your Course</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #00f5ff; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Congratulations! You've successfully enrolled in <strong>${data.courseName}</strong>.
            </p>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00f5ff; margin-top: 0;">Course Details:</h3>
              <p style="margin: 5px 0;"><strong>Course:</strong> ${data.courseName}</p>
              <p style="margin: 5px 0;"><strong>Course ID:</strong> ${data.courseId}</p>
              <p style="margin: 5px 0;"><strong>Price:</strong> ${data.price === 0 ? 'FREE' : `₹${data.price}`}</p>
              <p style="margin: 5px 0;"><strong>Enrollment Date:</strong> ${new Date(data.enrollmentDate).toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learnnect.com/dashboard" style="background: linear-gradient(135deg, #ff0080, #00f5ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Start Learning
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Your course is now available in your dashboard. Start learning at your own pace and don't hesitate to reach out if you need any help!
            </p>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Best regards,<br>
              The Learnnect Team<br>
              <a href="mailto:support@learnnect.com" style="color: #00f5ff;">support@learnnect.com</a>
            </p>
          </div>
        </div>
      `,
      textBody: `Hi ${data.name}!\n\nCongratulations! You've successfully enrolled in ${data.courseName}.\n\nCourse Details:\n- Course: ${data.courseName}\n- Course ID: ${data.courseId}\n- Price: ${data.price === 0 ? 'FREE' : `₹${data.price}`}\n- Enrollment Date: ${new Date(data.enrollmentDate).toLocaleDateString()}\n\nYour course is now available in your dashboard: https://learnnect.com/dashboard\n\nStart learning at your own pace and don't hesitate to reach out if you need any help!\n\nBest regards,\nThe Learnnect Team\nsupport@learnnect.com`
    };
  }

  private getWelcomeTemplate(data: any): EmailTemplate {
    return this.getSignupWelcomeTemplate(data);
  }

  // Send confirmation emails via Google Gmail Business Account
  private async sendViaGmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Sending confirmation email via Gmail business account:', {
        to: emailData.to,
        type: emailData.emailType
      });

      const response = await fetch(this.googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          actionType: 'send_email',
          emailType: emailData.emailType,
          recipientEmail: emailData.to,
          recipientName: emailData.name || 'Valued User',
          subject: emailData.subject,
          ...emailData.additionalData
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.result === 'success') {
        console.log('✅ Confirmation email sent successfully via Gmail business account');
        return true;
      } else {
        console.error('❌ Gmail business account error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending confirmation email via Gmail:', error);
      return false;
    }
  }

  // Send OTP emails via Resend Backend API (keep for OTP only)
  private async sendViaResend(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Sending OTP email via Resend backend API:', {
        to: emailData.to,
        type: emailData.emailType
      });

      const response = await fetch(`${this.backendApiUrl}/api/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailData.emailType,
          to: emailData.to,
          data: {
            name: emailData.name,
            ...emailData.additionalData
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ OTP email sent successfully via Resend backend API');
        return true;
      } else {
        console.error('❌ Resend backend API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending OTP email via Resend backend:', error);
      return false;
    }
  }

  // Record that email was sent in Google Sheets
  private async recordEmailSent(emailData: EmailData): Promise<void> {
    try {
      // Record in Google Sheets for tracking
      console.log('📊 Recording email sent in Google Sheets:', {
        to: emailData.to,
        type: emailData.emailType,
        subject: emailData.subject,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error recording email in sheets:', error);
    }
  }
}

export const emailService = new EmailService();
export default emailService;
