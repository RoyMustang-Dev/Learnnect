// Updated Google Apps Script with Neon Theme Email Template
// This file contains the updated sendEnquiryMarketingEmail function with website-matching theme

function sendEnquiryMarketingEmail(e) {
  const userEmail = e.parameter.email;
  const userName = e.parameter.name || 'Future Success Story';
  const courseInterest = e.parameter.courseInterest || e.parameter.courseName || 'our premium courses';
  const phone = e.parameter.phone || e.parameter.phoneNumber || '';

  if (!userEmail) return;

  // Compelling subject line for sales conversion
  const subject = "🚀 Your Learning Journey Awaits - Exclusive Course Access Inside!";

  // Sales-focused plain text version
  const plainTextBody = `
Dear ${userName},

🎯 CONGRATULATIONS! You've just taken the FIRST STEP toward a ₹10+ LPA career!

Your enquiry about "${courseInterest}" shows you're serious about success. We're THRILLED to help you transform your career!

🔥 EXCLUSIVE OFFER - JUST FOR YOU! 🔥

✅ 50% OFF your first course enrollment
✅ FREE 1-on-1 career counseling (Worth ₹2,500)
✅ LIFETIME access to exclusive community
✅ 100% Job placement assistance

⏰ This offer expires in 48 HOURS!

Why Choose Learnnect?
• 95% of our students get promoted within 6 months
• Average salary increase: 150%
• 500+ hiring partners including Google, Microsoft, Amazon
• Learn from industry experts with 10+ years experience

🎯 READY TO TRANSFORM YOUR CAREER?

Call us NOW: +91-9876543210
Or visit: https://learnnect-app.onrender.com/courses

Don't let this opportunity slip away!

Best regards,
The Learnnect Success Team
"Where Dreams Meet Reality"

P.S. - Our next batch starts in 3 days. Secure your spot before it's too late!
  `;

  const body = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .neon-glow {
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
        }
        
        .gradient-border {
          background: linear-gradient(135deg, #00ffff, #ff00ff);
          padding: 2px;
          border-radius: 12px;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #00ffff, #ff00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      </style>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #0a0a0a;">
      <div style="max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.1);">

        <!-- Header with Neon Theme -->
        <div style="background: linear-gradient(135deg, #00ffff, #ff00ff); padding: 3px; border-radius: 20px 20px 0 0;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 30px; text-align: center; border-radius: 18px 18px 0 0;">
            <h1 style="color: #00ffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 0 20px rgba(0,255,255,0.5);">
              🚀 Your Success Journey Starts NOW!
            </h1>
            <div style="background: linear-gradient(45deg, #00ffff, #ff00ff); padding: 2px; border-radius: 25px; margin: 20px auto; max-width: 320px;">
              <div style="background: #0a0a0a; border-radius: 23px; padding: 12px 25px;">
                <span style="color: #00ffff; font-size: 16px; font-weight: 600; text-shadow: 0 0 10px rgba(0,255,255,0.5);">📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 40px 30px; background: linear-gradient(135deg, #1a1a2e, #16213e);">
          <p style="font-size: 20px; color: #ffffff; margin-bottom: 25px; font-weight: 500;">Dear <span style="color: #00ffff;">${userName}</span>,</p>

          <!-- Attention-Grabbing Opening -->
          <div style="background: linear-gradient(135deg, #ff00ff, #ff0080); padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; box-shadow: 0 10px 30px rgba(255,0,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1);">
            <h2 style="margin: 0 0 15px 0; font-size: 28px; color: #ffffff; font-weight: 700; text-shadow: 0 0 15px rgba(255,255,255,0.5);">🎯 CONGRATULATIONS!</h2>
            <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 500;">You've just taken the FIRST STEP toward a ₹10+ LPA career!</p>
          </div>

          <p style="color: #e0e0e0; font-size: 16px; margin: 20px 0;">Your enquiry about <strong style="color: #00ffff;">"${courseInterest}"</strong> shows you're serious about success. We're THRILLED to help you transform your career!</p>

          <!-- Limited Time Offer Box -->
          <div style="background: linear-gradient(135deg, #00ffff, #ff00ff); padding: 3px; border-radius: 20px; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 30px; border-radius: 17px; position: relative;">
              <div style="position: absolute; top: -15px; right: -15px; background: linear-gradient(45deg, #ff00ff, #ff0080); color: white; padding: 8px 20px; border-radius: 25px; font-weight: 700; font-size: 14px; transform: rotate(15deg); box-shadow: 0 5px 15px rgba(255,0,255,0.4);">
                LIMITED TIME!
              </div>
              <h3 style="color: #00ffff; margin: 0 0 20px 0; font-size: 26px; text-align: center; font-weight: 700; text-shadow: 0 0 15px rgba(0,255,255,0.5);">
                🔥 EXCLUSIVE OFFER - JUST FOR YOU! 🔥
              </h3>
              <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 25px; border-radius: 15px; margin: 20px 0; border: 1px solid rgba(0,255,255,0.3);">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(0,255,255,0.2); font-size: 18px; color: #ffffff;">
                    <span style="color: #00ffff; font-weight: 700;">✅ 50% OFF</span> your first course enrollment
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(0,255,255,0.2); font-size: 18px; color: #ffffff;">
                    <span style="color: #00ffff; font-weight: 700;">✅ FREE</span> 1-on-1 career counseling (Worth ₹2,500)
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(0,255,255,0.2); font-size: 18px; color: #ffffff;">
                    <span style="color: #00ffff; font-weight: 700;">✅ LIFETIME</span> access to exclusive community
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid rgba(0,255,255,0.2); font-size: 18px; color: #ffffff;">
                    <span style="color: #00ffff; font-weight: 700;">✅ 100%</span> Job placement assistance
                  </li>
                  <li style="padding: 12px 0; font-size: 18px; color: #ffffff;">
                    <span style="color: #00ffff; font-weight: 700;">✅ INDUSTRY</span> recognized certification
                  </li>
                </ul>
              </div>
              <div style="text-align: center; margin: 25px 0;">
                <div style="background: linear-gradient(45deg, #ff00ff, #ff0080); color: white; padding: 15px 30px; border-radius: 30px; display: inline-block; font-weight: 700; font-size: 18px; box-shadow: 0 10px 25px rgba(255,0,255,0.4); text-shadow: 0 0 10px rgba(255,255,255,0.5);">
                  ⏰ Offer Expires in 48 HOURS!
                </div>
              </div>
            </div>
          </div>

          <!-- Success Statistics -->
          <div style="background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); padding: 30px; border-radius: 20px; margin: 30px 0; border: 1px solid rgba(0,255,255,0.3); backdrop-filter: blur(10px);">
            <h3 style="color: #00ffff; text-align: center; margin: 0 0 25px 0; font-size: 24px; font-weight: 700; text-shadow: 0 0 15px rgba(0,255,255,0.5);">🏆 Why 50,000+ Students Choose Learnnect</h3>
            <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 150px; margin: 15px;">
                <div style="font-size: 40px; font-weight: 700; color: #00ffff; text-shadow: 0 0 20px rgba(0,255,255,0.5);">95%</div>
                <div style="font-size: 16px; color: #e0e0e0; font-weight: 500;">Get promoted within 6 months</div>
              </div>
              <div style="flex: 1; min-width: 150px; margin: 15px;">
                <div style="font-size: 40px; font-weight: 700; color: #ff00ff; text-shadow: 0 0 20px rgba(255,0,255,0.5);">150%</div>
                <div style="font-size: 16px; color: #e0e0e0; font-weight: 500;">Average salary increase</div>
              </div>
              <div style="flex: 1; min-width: 150px; margin: 15px;">
                <div style="font-size: 40px; font-weight: 700; color: #00ffff; text-shadow: 0 0 20px rgba(0,255,255,0.5);">500+</div>
                <div style="font-size: 16px; color: #e0e0e0; font-weight: 500;">Hiring partners</div>
              </div>
            </div>
          </div>

          <!-- Success Stories -->
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #00ffff; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <h4 style="color: #00ffff; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,255,0.5);">💼 Recent Success Stories:</h4>
            <div style="margin: 15px 0; padding: 20px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); border-radius: 12px; border: 1px solid rgba(0,255,255,0.2);">
              <strong style="color: #00ffff; font-size: 18px;">Priya Sharma</strong> <span style="color: #ff00ff;">- Data Scientist at Google</span><br>
              <em style="color: #e0e0e0; font-size: 16px;">"Salary jumped from ₹4 LPA to ₹18 LPA in 8 months!"</em>
            </div>
            <div style="margin: 15px 0; padding: 20px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); border-radius: 12px; border: 1px solid rgba(255,0,255,0.2);">
              <strong style="color: #ff00ff; font-size: 18px;">Rahul Kumar</strong> <span style="color: #00ffff;">- ML Engineer at Microsoft</span><br>
              <em style="color: #e0e0e0; font-size: 16px;">"Learnnect's placement support got me my dream job!"</em>
            </div>
          </div>

          <!-- Urgency Section -->
          <div style="background: linear-gradient(135deg, #ff00ff, #ff0080); padding: 25px; border-radius: 20px; text-align: center; margin: 30px 0; box-shadow: 0 15px 35px rgba(255,0,255,0.4), inset 0 1px 0 rgba(255,255,255,0.1);">
            <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 24px; font-weight: 700; text-shadow: 0 0 15px rgba(255,255,255,0.5);">⚡ URGENT: Next Batch Starts in 3 Days!</h3>
            <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 500;">Only 5 seats remaining. Don't miss out on this life-changing opportunity!</p>
          </div>

          <!-- Call to Action Buttons -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="tel:+919876543210"
               style="background: linear-gradient(45deg, #00ffff, #0080ff);
                      color: #ffffff;
                      padding: 18px 35px;
                      text-decoration: none;
                      border-radius: 30px;
                      font-weight: 700;
                      display: inline-block;
                      margin: 15px;
                      box-shadow: 0 10px 25px rgba(0,255,255,0.4);
                      font-size: 18px;
                      text-shadow: 0 0 10px rgba(255,255,255,0.5);
                      transition: all 0.3s ease;">
              📞 Call NOW: +91-9876543210
            </a>
            <br>
            <a href="https://learnnect-app.onrender.com/courses"
               style="background: linear-gradient(45deg, #ff00ff, #ff0080);
                      color: #ffffff;
                      padding: 18px 35px;
                      text-decoration: none;
                      border-radius: 30px;
                      font-weight: 700;
                      display: inline-block;
                      margin: 15px;
                      box-shadow: 0 10px 25px rgba(255,0,255,0.4);
                      font-size: 18px;
                      text-shadow: 0 0 10px rgba(255,255,255,0.5);
                      transition: all 0.3s ease;">
              🚀 Enroll Now & Save 50%
            </a>
          </div>

          <!-- Contact Information -->
          <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); color: white; padding: 30px; border-radius: 20px; margin: 25px 0; border: 1px solid rgba(0,255,255,0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <h4 style="color: #00ffff; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; text-shadow: 0 0 15px rgba(0,255,255,0.5);">📞 Ready to Transform Your Career?</h4>
            <p style="margin: 8px 0; font-size: 16px; color: #e0e0e0;"><strong style="color: #ff00ff;">Phone:</strong> +91-9876543210</p>
            <p style="margin: 8px 0; font-size: 16px; color: #e0e0e0;"><strong style="color: #ff00ff;">WhatsApp:</strong> +91-9876543210</p>
            <p style="margin: 8px 0; font-size: 16px; color: #e0e0e0;"><strong style="color: #ff00ff;">Email:</strong> success@learnnect.com</p>
            <p style="margin: 20px 0 8px 0; color: #00ffff; font-size: 16px; font-weight: 600;"><strong>Best Time to Call:</strong> 9 AM - 9 PM (Mon-Sun)</p>
          </div>

          <!-- Footer with Slogan -->
          <div style="text-align: center; margin: 40px 0;">
            <div style="background: linear-gradient(45deg, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 24px; font-weight: 700; margin: 20px 0;">
              📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!
            </div>
            <p style="color: #e0e0e0; font-style: italic; font-size: 18px; font-weight: 500;">"Where Dreams Meet Reality"</p>
          </div>

          <div style="background: linear-gradient(135deg, rgba(255,255,0,0.1), rgba(255,165,0,0.1)); border: 2px solid rgba(255,255,0,0.3); padding: 20px; border-radius: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #ffff00; font-weight: 700; font-size: 16px; text-shadow: 0 0 10px rgba(255,255,0,0.5);">
              ⚠️ P.S. - This exclusive offer is only valid for the next 48 hours.
              Our courses have a 100% success rate, and seats fill up FAST!
            </p>
          </div>

          <p style="color: #e0e0e0; font-size: 16px; text-align: center; margin: 30px 0; font-weight: 500;">
            Don't let this opportunity slip away. Your future self will thank you!
          </p>

        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); color: white; padding: 30px; text-align: center; border-top: 1px solid rgba(0,255,255,0.3);">
          <p style="margin: 0; font-weight: 700; font-size: 18px; color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.5);">The Learnnect Success Team</p>
          <p style="margin: 10px 0 0 0; font-style: italic; color: #e0e0e0; font-size: 16px;">Transforming Lives, One Course at a Time</p>
          <p style="margin: 20px 0 0 0; font-size: 14px; color: #888888;">© 2024 Learnnect. All rights reserved.</p>
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
      name: 'Learnnect Success Team'
    });
    console.log('Marketing email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending marketing email:', error);
  }
}
