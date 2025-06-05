// Learnnect EdTech Platform - Google Apps Script (CORRECT VERSION)
// This script handles user signups, contact forms, and course enrollments
// Deploy this as a Web App in Google Apps Script

const scriptProp = PropertiesService.getScriptProperties();

// Sheet names for different data types
const SHEETS = {
  USER_SIGNUPS: 'UserSignUps',
  EXISTING_USERS: 'ExistingUsers', 
  CONTACT_FORMS: 'ContactForms',
  COURSE_ENROLLMENTS: 'CourseEnrollments',
  USER_ACTIVITY: 'UserActivity'
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
  
  // Create UserSignUps sheet
  if (!doc.getSheetByName(SHEETS.USER_SIGNUPS)) {
    const sheet = doc.insertSheet(SHEETS.USER_SIGNUPS);
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Date', 'Platform', 'UserName', 'UserEmail', 'Mobile', 'UserID', 'Provider', 'Status'
    ]]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }
  
  // Create ExistingUsers sheet
  if (!doc.getSheetByName(SHEETS.EXISTING_USERS)) {
    const sheet = doc.insertSheet(SHEETS.EXISTING_USERS);
    sheet.getRange(1, 1, 1, 4).setValues([[
      'Email', 'IsActive', 'LastLogin', 'LoginCount'
    ]]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  // Create ContactForms sheet
  if (!doc.getSheetByName(SHEETS.CONTACT_FORMS)) {
    const sheet = doc.insertSheet(SHEETS.CONTACT_FORMS);
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Date', 'Name', 'Email', 'Subject', 'Message', 'Status'
    ]]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  
  // Create CourseEnrollments sheet
  if (!doc.getSheetByName(SHEETS.COURSE_ENROLLMENTS)) {
    const sheet = doc.insertSheet(SHEETS.COURSE_ENROLLMENTS);
    sheet.getRange(1, 1, 1, 7).setValues([[
      'Date', 'UserEmail', 'CourseID', 'CourseName', 'Price', 'PaymentStatus', 'EnrollmentStatus'
    ]]);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  
  // Create UserActivity sheet
  if (!doc.getSheetByName(SHEETS.USER_ACTIVITY)) {
    const sheet = doc.insertSheet(SHEETS.USER_ACTIVITY);
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Date', 'UserEmail', 'Action', 'Details', 'Platform', 'SessionID'
    ]]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const actionType = e.parameter.actionType || 'signup';
    
    let result;
    
    switch(actionType) {
      case 'signup':
        result = handleUserSignup(doc, e);
        break;
      case 'login':
        result = handleUserLogin(doc, e);
        break;
      case 'contact':
        result = handleContactForm(doc, e);
        break;
      case 'enrollment':
        result = handleCourseEnrollment(doc, e);
        break;
      case 'activity':
        result = handleUserActivity(doc, e);
        break;
      default:
        throw new Error('Invalid action type: ' + actionType);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock();
  }
}

function handleUserSignup(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.USER_SIGNUPS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  // Map form data to sheet columns
  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'Platform':
        return e.parameter.platform || 'Web';
      case 'UserName':
        return e.parameter.userName || e.parameter.name;
      case 'UserEmail':
        return e.parameter.userEmail || e.parameter.email;
      case 'Mobile':
        return e.parameter.mobile || e.parameter.phone || '';
      case 'UserID':
        return e.parameter.userID || e.parameter.uid;
      case 'Provider':
        return e.parameter.provider || 'form';
      case 'Status':
        return 'Active';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
  
  // Send welcome email
  if (e.parameter.userEmail || e.parameter.email) {
    sendWelcomeEmail(e);
  }
  
  return {
    'result': 'success',
    'action': 'signup',
    'row': nextRow,
    'message': 'User signup recorded successfully'
  };
}

function handleUserLogin(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.EXISTING_USERS);
  const userEmail = e.parameter.userEmail || e.parameter.email;
  
  if (!userEmail) {
    throw new Error('Email is required for login tracking');
  }
  
  // Check if user exists
  const data = sheet.getDataRange().getValues();
  let userRowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userEmail) {
      userRowIndex = i + 1;
      break;
    }
  }
  
  if (userRowIndex === -1) {
    // New user, add to existing users
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, 4).setValues([[
      userEmail,
      'true',
      new Date(),
      1
    ]]);
    userRowIndex = nextRow;
  } else {
    // Update existing user
    const currentLoginCount = data[userRowIndex - 1][3] || 0;
    sheet.getRange(userRowIndex, 2, 1, 3).setValues([[
      'true',
      new Date(),
      parseInt(currentLoginCount) + 1
    ]]);
  }
  
  return {
    'result': 'success',
    'action': 'login',
    'row': userRowIndex,
    'message': 'User login tracked successfully'
  };
}

function handleContactForm(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.CONTACT_FORMS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'Name':
        return e.parameter.name || e.parameter.customerName;
      case 'Email':
        return e.parameter.email || e.parameter.customerEmail;
      case 'Subject':
        return e.parameter.subject || 'General Inquiry';
      case 'Message':
        return e.parameter.message || e.parameter.inquiry;
      case 'Status':
        return 'New';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
  
  // Send contact form confirmation email
  if (e.parameter.email || e.parameter.customerEmail) {
    sendContactConfirmationEmail(e);
  }
  
  return {
    'result': 'success',
    'action': 'contact',
    'row': nextRow,
    'message': 'Contact form submitted successfully'
  };
}

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

function handleUserActivity(doc, e) {
  const sheet = doc.getSheetByName(SHEETS.USER_ACTIVITY);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nextRow = sheet.getLastRow() + 1;

  const newRow = headers.map(function(header) {
    switch(header) {
      case 'Date':
        return new Date();
      case 'UserEmail':
        return e.parameter.userEmail || e.parameter.email;
      case 'Action':
        return e.parameter.action || 'page_view';
      case 'Details':
        return e.parameter.details || '';
      case 'Platform':
        return e.parameter.platform || 'Web';
      case 'SessionID':
        return e.parameter.sessionID || '';
      default:
        return e.parameter[header] || '';
    }
  });

  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
  
  return {
    'result': 'success',
    'action': 'activity',
    'row': nextRow,
    'message': 'User activity recorded successfully'
  };
}

// Email Functions
function sendWelcomeEmail(e) {
  const userEmail = e.parameter.userEmail || e.parameter.email;
  const userName = e.parameter.userName || e.parameter.name || 'Learner';
  const provider = e.parameter.provider || 'form';

  if (!userEmail) return;

  // Less spammy subject line
  const subject = "Welcome to Learnnect - Account Created Successfully";

  // Plain text version for better deliverability
  const plainTextBody = `
Dear ${userName},

Welcome to Learnnect! Your account has been successfully created.

=== LEARN • CONNECT • SUCCEED!! ===
Your journey to success starts here!

Account Details:
- Email: ${userEmail}
- Sign-up Method: ${provider === 'form' ? 'Email/Password' : provider.charAt(0).toUpperCase() + provider.slice(1)}
- Platform: Learnnect EdTech

Your Learning Journey:
📚 LEARN - Master new skills with expert-led courses
🤝 CONNECT - Join a vibrant community of learners
🏆 SUCCEED!! - Achieve your career goals and dreams

Next Steps:
1. Complete your profile
2. Browse our course catalog
3. Enroll in your first course
4. Join community discussions
5. Track your progress

Visit your dashboard: https://learnnect-app.onrender.com/dashboard

Ready to transform your future?
📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!

Need help? Reply to this email or visit our help center.

Best regards,
The Learnnect Team
Empowering learners, transforming careers

✨ Learn, Connect, Succeed!! ✨
The Learnnect Way

© 2024 Learnnect. All rights reserved.
  `;

  const body = `
    <html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.5); margin-bottom: 10px;">
            Welcome to Learnnect! 🚀
          </h1>

          <!-- Creative Slogan Section -->
          <div style="background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff); padding: 3px; border-radius: 25px; margin: 20px auto; max-width: 300px;">
            <div style="background: #1a1a1a; border-radius: 22px; padding: 15px 25px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 14px;">
                <span style="color: #00ffff; text-shadow: 0 0 8px rgba(0,255,255,0.8);">📚 Learn</span>
                <span style="color: #ff00ff; text-shadow: 0 0 8px rgba(255,0,255,0.8); margin: 0 10px;">🤝 Connect</span>
                <span style="color: #00ff00; text-shadow: 0 0 8px rgba(0,255,0,0.8);">🏆 Succeed!!</span>
              </div>
            </div>
          </div>

          <!-- Animated Slogan Banner -->
          <div style="background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); border: 2px solid transparent; background-clip: padding-box; border-radius: 15px; padding: 12px; margin: 15px 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shimmer 2s infinite;"></div>
            <p style="margin: 0; font-size: 16px; font-weight: bold; background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              ✨ Learn, Connect, Succeed!! ✨
            </p>
          </div>
        </div>

        <p>Dear ${userName},</p>

        <p>🎉 <strong>Congratulations!</strong> You've just joined the most innovative EdTech platform designed to transform your learning experience. Welcome to the Learnnect family!</p>

        <!-- Journey Steps with Slogan Integration -->
        <div style="background: linear-gradient(135deg, rgba(0,255,255,0.05), rgba(255,0,255,0.05)); padding: 20px; border-radius: 15px; margin: 25px 0; border-left: 4px solid #00ffff;">
          <h3 style="color: #00ffff; margin-top: 0; margin-bottom: 15px; text-align: center;">🌟 Your Learning Journey Starts Here</h3>
          <div style="display: flex; justify-content: space-around; text-align: center; margin: 20px 0;">
            <div style="flex: 1; padding: 0 10px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #00ffff, #0099cc); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📚</div>
              <h4 style="color: #00ffff; margin: 10px 0 5px; font-size: 16px;">LEARN</h4>
              <p style="color: #666; font-size: 12px; margin: 0;">Master new skills with expert-led courses</p>
            </div>
            <div style="flex: 1; padding: 0 10px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #ff00ff, #cc0099); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🤝</div>
              <h4 style="color: #ff00ff; margin: 10px 0 5px; font-size: 16px;">CONNECT</h4>
              <p style="color: #666; font-size: 12px; margin: 0;">Join a vibrant community of learners</p>
            </div>
            <div style="flex: 1; padding: 0 10px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #00ff00, #00cc00); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🏆</div>
              <h4 style="color: #00ff00; margin: 10px 0 5px; font-size: 16px;">SUCCEED!!</h4>
              <p style="color: #666; font-size: 12px; margin: 0;">Achieve your career goals and dreams</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #ff00ff; margin-top: 0;">🌟 What awaits you at Learnnect:</h3>
          <ul style="padding-left: 20px;">
            <li>🎯 <strong>Personalized Learning Paths</strong> - AI-powered course recommendations</li>
            <li>🏆 <strong>Industry-Recognized Certificates</strong> - Boost your career prospects</li>
            <li>👥 <strong>Vibrant Learning Community</strong> - Connect with fellow learners</li>
            <li>📱 <strong>Learn Anywhere, Anytime</strong> - Mobile-optimized platform</li>
            <li>🤖 <strong>AI Learning Assistant</strong> - Get instant help and guidance</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://learnnect-app.onrender.com/dashboard"
             style="background: linear-gradient(45deg, #00ffff, #ff00ff);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: bold;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(0,255,255,0.3);">
            🎓 Start Learning Now
          </a>
        </div>

        <p><strong>Your Account Details:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${userEmail}</li>
          <li><strong>Sign-up Method:</strong> ${provider === 'form' ? 'Email/Password' : provider.charAt(0).toUpperCase() + provider.slice(1)}</li>
          <li><strong>Platform:</strong> Learnnect EdTech</li>
        </ul>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #007bff; margin-top: 0;">🚀 Quick Start Guide:</h4>
          <ol>
            <li>Complete your profile to get personalized recommendations</li>
            <li>Browse our extensive course catalog</li>
            <li>Enroll in your first course (many are free!)</li>
            <li>Join our community discussions</li>
            <li>Track your progress and earn certificates</li>
          </ol>
        </div>

        <p>Need help getting started? Our support team is here for you 24/7. Simply reply to this email or visit our help center.</p>

        <p>Thank you for choosing Learnnect as your learning partner. Together, we'll unlock your potential and accelerate your career growth!</p>

        <p>Happy Learning! 📚✨</p>

        <p><strong>The Learnnect Team</strong><br>
        <em>Empowering learners, transforming careers</em></p>

        <!-- Creative Slogan Footer -->
        <div style="background: linear-gradient(45deg, #1a1a1a, #2a2a2a); padding: 20px; border-radius: 15px; margin: 25px 0; text-align: center; border: 1px solid rgba(0,255,255,0.2);">
          <div style="margin-bottom: 15px;">
            <span style="font-size: 18px; font-weight: bold;">🎯 Ready to transform your future? 🎯</span>
          </div>
          <div style="background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 20px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
            📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!
          </div>
          <div style="font-size: 12px; color: #888; margin-top: 10px;">
            <em>Your journey to success starts with a single step</em>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>Follow us for learning tips and updates:</p>
          <p>
            <a href="#" style="color: #00ffff; text-decoration: none;">🌐 Website</a> |
            <a href="#" style="color: #00ffff; text-decoration: none;">📘 LinkedIn</a> |
            <a href="#" style="color: #00ffff; text-decoration: none;">🐦 Twitter</a> |
            <a href="#" style="color: #00ffff; text-decoration: none;">📧 Support</a>
          </p>

          <!-- Final Slogan Integration -->
          <div style="margin: 15px 0; padding: 10px; background: rgba(0,255,255,0.05); border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #00ffff;">
              ✨ Learn, Connect, Succeed!! ✨
            </p>
            <p style="margin: 5px 0 0; font-size: 10px; color: #999;">
              The Learnnect Way
            </p>
          </div>

          <p>© 2024 Learnnect. All rights reserved.</p>
        </div>
      </div>
    </body></html>
  `;

  try {
    // Send both plain text and HTML for better deliverability
    MailApp.sendEmail({
      to: userEmail,
      subject: subject,
      body: plainTextBody,  // Plain text version
      htmlBody: body,       // HTML version
      name: 'Learnnect Support Team'  // Professional sender name
    });
    console.log('Welcome email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

function sendContactConfirmationEmail(e) {
  const userEmail = e.parameter.email || e.parameter.customerEmail;
  const userName = e.parameter.name || e.parameter.customerName || 'Valued User';

  if (!userEmail) return;

  const subject = "✅ We've Received Your Message - Learnnect Support";

  const body = `
    <html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.5);">
            Thank You for Contacting Us! 💬
          </h1>

          <!-- Slogan for Contact Email -->
          <div style="background: linear-gradient(45deg, #00ffff, #ff00ff); padding: 2px; border-radius: 20px; margin: 15px auto; max-width: 250px;">
            <div style="background: #1a1a1a; border-radius: 18px; padding: 8px 15px;">
              <span style="color: #00ffff; font-size: 12px; font-weight: bold;">📚 Learn • 🤝 Connect • 🏆 Succeed!!</span>
            </div>
          </div>
        </div>

        <p>Dear ${userName},</p>

        <p>Thank you for reaching out to Learnnect! We've successfully received your message and our team is already working on providing you with the best possible assistance.</p>

        <div style="background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #ff00ff; margin-top: 0;">📋 What happens next:</h3>
          <ul style="padding-left: 20px;">
            <li>🔍 Our support team will review your inquiry</li>
            <li>📞 We'll respond within 24 hours (usually much faster!)</li>
            <li>💡 You'll receive detailed assistance tailored to your needs</li>
            <li>🤝 We'll ensure your issue is completely resolved</li>
          </ul>
        </div>

        <p><strong>Your Message Details:</strong></p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Subject:</strong> ${e.parameter.subject || 'General Inquiry'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>In the meantime, feel free to explore our platform and discover the amazing learning opportunities waiting for you!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://learnnect-app.onrender.com/courses"
             style="background: linear-gradient(45deg, #00ffff, #ff00ff);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: bold;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(0,255,255,0.3);">
            🎓 Explore Courses
          </a>
        </div>

        <p>Thank you for choosing Learnnect. We're excited to help you on your learning journey!</p>

        <p>Best regards,<br>
        <strong>The Learnnect Support Team</strong></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>Need immediate assistance? Visit our <a href="#" style="color: #00ffff;">Help Center</a></p>
          <p>© 2024 Learnnect. All rights reserved.</p>
        </div>
      </div>
    </body></html>
  `;

  try {
    MailApp.sendEmail({
      to: userEmail,
      subject: subject,
      htmlBody: body
    });
    console.log('Contact confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
  }
}
