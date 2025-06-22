import React, { useState } from 'react';
import { otpService } from '../../services/otpService';
import { emailService } from '../../services/emailService';
import OTPVerificationModal from '../Auth/OTPVerificationModal';

interface OTPEnabledFormProps {
  children: React.ReactNode;
  onSubmit: (formData: any) => Promise<void>;
  formData: any;
  emailField: string; // field name for email in formData
  formType: 'enquiry' | 'contact' | 'newsletter' | 'signup';
  requireOTP?: boolean;
  className?: string;
}

const OTPEnabledForm: React.FC<OTPEnabledFormProps> = ({
  children,
  onSubmit,
  formData,
  emailField,
  formType,
  requireOTP = true,
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!requireOTP) {
      // Submit directly without OTP
      await handleDirectSubmit();
      return;
    }

    // Check if email is provided
    const email = formData[emailField];
    if (!email) {
      setError('Email is required for verification');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send OTP for verification
      const otpResult = await otpService.sendEmailOTP(email, getOTPPurpose());
      
      if (otpResult.success) {
        // Store form data for after OTP verification
        setPendingFormData(formData);
        setShowOTPModal(true);
      } else {
        throw new Error(otpResult.message || 'Failed to send verification email');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send verification email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      
      // Send confirmation email based on form type
      await sendConfirmationEmail(formData);
    } catch (error: any) {
      setError(error.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!pendingFormData) return;

    setIsSubmitting(true);
    try {
      // Submit the form after OTP verification
      await onSubmit(pendingFormData);
      
      // Send confirmation email
      await sendConfirmationEmail(pendingFormData);
      
      // Close OTP modal
      setShowOTPModal(false);
      setPendingFormData(null);
    } catch (error: any) {
      setError(error.message || 'Submission failed');
      setShowOTPModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendConfirmationEmail = async (data: any) => {
    try {
      const email = data[emailField];
      const name = data.name || data.firstName || email.split('@')[0];

      switch (formType) {
        case 'enquiry':
          await emailService.sendEnquiryConfirmation({
            to: email,
            name,
            courseInterest: data.courseInterest || data.course,
            message: data.message || 'Thank you for your enquiry!'
          });
          break;

        case 'contact':
          await emailService.sendContactConfirmation({
            to: email,
            name,
            subject: data.subject,
            message: data.message
          });
          break;

        case 'newsletter':
          await emailService.sendNewsletterConfirmation({
            to: email,
            name
          });
          break;

        case 'signup':
          await emailService.sendSignupWelcome({
            to: email,
            name,
            provider: 'Email'
          });
          break;
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't throw error here as the main submission was successful
    }
  };

  const getOTPPurpose = (): 'signup' | 'login' | 'password_reset' => {
    switch (formType) {
      case 'signup':
        return 'signup';
      case 'enquiry':
      case 'contact':
      case 'newsletter':
      default:
        return 'signup'; // Use signup purpose for form submissions
    }
  };

  const getOTPTitle = (): string => {
    switch (formType) {
      case 'enquiry':
        return 'Verify Your Enquiry';
      case 'contact':
        return 'Verify Your Message';
      case 'newsletter':
        return 'Verify Newsletter Subscription';
      case 'signup':
        return 'Verify Your Email';
      default:
        return 'Verify Your Email';
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className={className}>
        {children}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={() => {
            setShowOTPModal(false);
            setPendingFormData(null);
          }}
          onVerified={handleOTPVerified}
          identifier={pendingFormData?.[emailField] || ''}
          type="email"
          purpose={getOTPPurpose()}
          title={getOTPTitle()}
        />
      )}
    </>
  );
};

export default OTPEnabledForm;
