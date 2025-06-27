// Updated Google Apps Script for Learnnect - Professional Email System
// This script handles data recording AND email sending via Gmail business account
// Deploy this as a Web App in Google Apps Script

const scriptProp = PropertiesService.getScriptProperties();

// Sheet names for different data types
const SHEETS = {
  USER_SIGNUPS: 'UserSignUps',
  EXISTING_USERS: 'ExistingUsers',
  CONTACT_FORMS: 'ContactForms',
  ENQUIRY_FORMS: 'EnquiryForm',
  COURSE_ENROLLMENTS: 'CourseEnrollments',
  USER_ACTIVITY: 'UserActivity',
  EMAIL_LOGS: 'EmailLogs'
};

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
  
  // Create sheets if they don't exist
  createSheetsIfNotExist();
  
  console.log('Setup complete. Spreadsheet ID:', activeSpreadsheet.getId());
}

function createSheetsIfNotExist() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  
  Object.values(SHEETS).forEach(sheetName => {
    if (!doc.getSheetByName(sheetName)) {
      const sheet = doc.insertSheet(sheetName);
      
      // Add headers based on sheet type
      switch(sheetName) {
        case SHEETS.EMAIL_LOGS:
          sheet.getRange(1, 1, 1, 6).setValues([['Date', 'Type', 'Recipient', 'Subject', 'Status', 'Details']]);
          break;
        case SHEETS.CONTACT_FORMS:
          sheet.getRange(1, 1, 1, 6).setValues([['Date', 'Name', 'Email', 'Subject', 'Message', 'Status']]);
          break;
        case SHEETS.ENQUIRY_FORMS:
          sheet.getRange(1, 1, 1, 7).setValues([['Date', 'Name', 'Email', 'Phone', 'Course Interest', 'Message', 'Status']]);
          break;
      }
    }
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const actionType = e.parameter.actionType || 'signup';
    
    let result;
    
    switch(actionType) {
      case 'send_email':
        result = handleEmailSending(e);
        break;
      case 'contact':
        result = handleContactForm(doc, e);
        break;
      case 'enquiry':
        result = handleEnquiryForm(doc, e);
        break;
      case 'enrollment':
        result = handleCourseEnrollment(doc, e);
        break;
      default:
        throw new Error('Invalid action type: ' + actionType);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': e.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock();
  }
}

// Handle email sending via Gmail business account
function handleEmailSending(e) {
  try {
    const emailType = e.parameter.emailType;
    const recipientEmail = e.parameter.recipientEmail;
    const recipientName = e.parameter.recipientName || 'Valued User';
    
    console.log(`📧 Sending ${emailType} email to ${recipientEmail}`);
    
    let emailSent = false;
    
    switch(emailType) {
      case 'contact':
        emailSent = sendContactConfirmationEmail(e);
        break;
      case 'enquiry':
        emailSent = sendEnquiryConfirmationEmail(e);
        break;
      case 'newsletter':
        emailSent = sendNewsletterConfirmationEmail(e);
        break;
      case 'welcome':
      case 'signup':
        emailSent = sendWelcomeEmail(e);
        break;
      default:
        throw new Error('Unknown email type: ' + emailType);
    }
    
    // Log email sending
    logEmailSent(emailType, recipientEmail, emailSent);
    
    return {
      'result': 'success',
      'action': 'email_sent',
      'emailType': emailType,
      'recipient': recipientEmail,
      'sent': emailSent
    };
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      'result': 'error',
      'error': error.toString()
    };
  }
}

// Handle contact form (data recording only - no email)
function handleContactForm(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.CONTACT_FORMS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'Name':
        return e.parameter.name;
      case 'Email':
        return e.parameter.email;
      case 'Subject':
        return e.parameter.subject || 'General Inquiry';
      case 'Message':
        return e.parameter.message;
      case 'Status':
        return 'New';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

  return {
    'result': 'success',
    'action': 'contact',
    'row': nextRow,
    'message': 'Contact form submitted successfully'
  };
}

// Handle enquiry form (data recording only - no email)
function handleEnquiryForm(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.ENQUIRY_FORMS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'Name':
        return e.parameter.name;
      case 'Email':
        return e.parameter.email;
      case 'Phone':
        return e.parameter.phone || '';
      case 'Course Interest':
        return e.parameter.courseInterest || 'General Inquiry';
      case 'Message':
        return e.parameter.message || '';
      case 'Status':
        return 'New';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

  return {
    'result': 'success',
    'action': 'enquiry',
    'row': nextRow,
    'message': 'Enquiry form submitted successfully'
  };
}

// Handle course enrollment (data recording only)
function handleCourseEnrollment(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.COURSE_ENROLLMENTS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'UserEmail':
        return e.parameter.userEmail || e.parameter.email;
      case 'CourseID':
        return e.parameter.courseID || e.parameter.courseId;
      case 'CourseName':
        return e.parameter.courseName || e.parameter.courseTitle;
      case 'Price':
        return e.parameter.price || '0';
      case 'PaymentStatus':
        return e.parameter.paymentStatus || 'Pending';
      case 'EnrollmentStatus':
        return e.parameter.enrollmentStatus || 'Active';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

  return {
    'result': 'success',
    'action': 'enrollment',
    'row': nextRow,
    'message': 'Course enrollment recorded successfully'
  };
}

// Log email sending activity
function logEmailSent(emailType, recipient, success) {
  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(SHEETS.EMAIL_LOGS);
    const nextRow = sheet.getLastRow() + 1;
    
    sheet.getRange(nextRow, 1, 1, 6).setValues([[
      new Date(),
      emailType,
      recipient,
      `${emailType} confirmation`,
      success ? 'Sent' : 'Failed',
      success ? 'Email sent successfully via Gmail business account' : 'Failed to send email'
    ]]);
  } catch (error) {
    console.error('Error logging email:', error);
  }
}

// Get professional email footer with all social media icons
function getEmailFooter() {
  return `
    <div style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); padding: 40px 20px; margin-top: 40px; border-top: 2px solid rgba(0, 255, 255, 0.3);">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 40px; width: auto;">
      </div>
      
      <!-- Social Links with ALL platforms -->
      <div style="text-align: center; margin-bottom: 25px;">
        <a href="https://learnnect.com" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="Website">🌐</a>
        <a href="https://facebook.com/learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="Facebook">📘</a>
        <a href="https://x.com/learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="X (Twitter)">🐦</a>
        <a href="https://instagram.com/learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="Instagram">📷</a>
        <a href="https://pinterest.com/learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="Pinterest">📌</a>
        <a href="https://threads.net/@learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="Threads">🧵</a>
        <a href="https://youtube.com/@learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="YouTube">📺</a>
        <a href="https://linkedin.com/company/learnnect" style="display: inline-block; margin: 0 8px; padding: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none;" title="LinkedIn">💼</a>
      </div>
      
      <!-- Contact Information -->
      <div style="text-align: center; color: #ffffff; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0;">📧 <strong>Email:</strong> <a href="mailto:support@learnnect.com" style="color: #00ffff; text-decoration: none;">support@learnnect.com</a></p>
        <p style="margin: 0 0 10px 0;">📞 <strong>Phone:</strong> +91 7007788926 | +91 9319369737 | +91 8709229353</p>
        <p style="margin: 0 0 10px 0;">🕒 <strong>Available:</strong> 7 days a week, 9AM-6PM IST</p>
        <p style="margin: 0;">📍 <strong>Address:</strong> Wave City Sector 2, Ghaziabad, Pin 201002</p>
      </div>
      
      <!-- Footer Links -->
      <div style="text-align: center; margin-bottom: 20px;">
        <a href="https://learnnect.com/courses" style="color: #00ffff; text-decoration: none; margin: 0 15px; font-size: 14px;">Courses</a>
        <a href="https://learnnect.com/about" style="color: #00ffff; text-decoration: none; margin: 0 15px; font-size: 14px;">About</a>
        <a href="https://learnnect.com/contact" style="color: #00ffff; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact</a>
        <a href="https://learnnect.com/privacy" style="color: #00ffff; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy</a>
      </div>
      
      <!-- Copyright -->
      <div style="text-align: center; color: #a0a0a0; font-size: 12px; border-top: 1px solid rgba(0, 255, 255, 0.2); padding-top: 20px;">
        <p style="margin: 0;">© 2024 Learnnect. All rights reserved.</p>
        <p style="margin: 5px 0 0 0; font-style: italic;">"Learn, Connect, Succeed!"</p>
      </div>
    </div>
  `;
}

// Send contact confirmation email via Gmail business account
function sendContactConfirmationEmail(e) {
  const userEmail = e.parameter.recipientEmail || e.parameter.email;
  const userName = e.parameter.recipientName || e.parameter.name || 'Valued User';
  const subject = e.parameter.subject || 'General Inquiry';
  const message = e.parameter.message || '';

  if (!userEmail) return false;

  const emailSubject = "✅ We've Received Your Message - Learnnect Support";

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 50px; width: auto; margin-bottom: 20px;">
          <h1 style="color: #00ffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);">
            Thank You for Contacting Us! 💬
          </h1>
          <p style="color: #ffffff; font-size: 16px; margin: 15px 0 0 0; opacity: 0.9;">
            We've received your message and will get back to you within 2-4 hours!
          </p>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Hi <strong style="color: #00ffff;">${userName}</strong>! 👋
          </p>

          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for reaching out to us. We've received your message and our expert team will respond within <strong style="color: #ff0080;">2-4 hours</strong> (probably sooner - we're pretty quick! ⚡).
          </p>

          ${message ? `
          <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 10px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px;">📝 Your Message:</h3>
            <p style="color: #ffffff; margin: 0; font-style: italic; line-height: 1.6;">"${message}"</p>
          </div>
          ` : ''}

          <!-- While You Wait -->
          <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
            <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">⏰ While You Wait...</h3>
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">🎯 <strong>Explore our courses</strong> - Check out our industry-aligned programs</p>
              <p style="margin: 0 0 10px 0;">📚 <strong>Read success stories</strong> - See how our students landed dream jobs</p>
              <p style="margin: 0 0 10px 0;">💡 <strong>Join our community</strong> - Connect with 10,000+ learners</p>
              <p style="margin: 0;">📞 <strong>Need immediate help?</strong> Call us at +91 7007788926</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://learnnect.com/courses" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; margin: 0 10px;">
              🎓 Explore Courses
            </a>
            <a href="https://learnnect.com/success-stories" style="display: inline-block; background: rgba(0, 255, 255, 0.1); border: 2px solid #00ffff; color: #00ffff; padding: 13px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; margin: 0 10px;">
              🌟 Success Stories
            </a>
          </div>

          <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #00ffff;">The Learnnect Support Team</strong><br>
            <em style="color: #ff0080;">"Learn, Connect, Succeed!"</em>
          </p>
        </div>

        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: userEmail,
      subject: emailSubject,
      htmlBody: body,
      name: 'Learnnect - Support Team'
    });
    console.log('✅ Contact confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact confirmation email:', error);
    return false;
  }
}
