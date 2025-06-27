// Additional Email Functions for Google Apps Script
// These functions send professional emails via Gmail business account

// Send enquiry confirmation email via Gmail business account
function sendEnquiryConfirmationEmail(e) {
  const userEmail = e.parameter.recipientEmail || e.parameter.email;
  const userName = e.parameter.recipientName || e.parameter.name || 'Future Learner';
  const courseInterest = e.parameter.courseInterest || 'General Enquiry';

  if (!userEmail) return false;

  const emailSubject = "🎯 Excellent Choice! Your Course Enquiry Received";

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Course Enquiry Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 50px; width: auto; margin-bottom: 20px;">
          <h1 style="color: #00ffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);">
            Excellent Choice, ${userName}! 🎉
          </h1>
          <p style="color: #ffffff; font-size: 16px; margin: 15px 0 0 0; opacity: 0.9;">
            Thanks for your interest in <strong style="color: #ff0080;">${courseInterest}</strong>! You're about to embark on a career-transforming journey.
          </p>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
          <!-- What Happens Next -->
          <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
            <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">🚀 What Happens Next?</h3>
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">📞 <strong>Expert Consultation:</strong> Our course advisor will call you within 2-4 hours</p>
              <p style="margin: 0 0 10px 0;">💡 <strong>Personalized Roadmap:</strong> We'll discuss your career goals and create a custom learning path</p>
              <p style="margin: 0 0 10px 0;">🎯 <strong>Live Demo:</strong> See our platform in action and meet your potential mentors</p>
              <p style="margin: 0;">💰 <strong>Special Offers:</strong> Learn about current discounts and flexible payment options</p>
            </div>
          </div>

          <!-- Marketing Stats -->
          <div style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 128, 0.05) 100%); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #00ffff; margin: 0 0 20px 0; font-size: 18px; text-align: center; font-weight: 600;">🚀 Why 10,000+ Students Choose Learnnect</h3>
            
            <div style="display: table; width: 100%; margin-bottom: 20px;">
              <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
                <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">95%</div>
                <div style="color: #ffffff; font-size: 12px;">Placement Rate</div>
              </div>
              <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
                <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">₹8.5L</div>
                <div style="color: #ffffff; font-size: 12px;">Avg. Package</div>
              </div>
              <div style="display: table-cell; text-align: center; padding: 0 15px;">
                <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">500+</div>
                <div style="color: #ffffff; font-size: 12px;">Hiring Partners</div>
              </div>
            </div>
            
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">✨ <strong>Project-Based Learning:</strong> Build 15+ real-world projects for your portfolio</p>
              <p style="margin: 0 0 10px 0;">🎯 <strong>3-Phase Curriculum:</strong> Foundations → Core+Advanced → Interview Prep</p>
              <p style="margin: 0 0 10px 0;">💼 <strong>Career Support:</strong> Resume building, mock interviews, job referrals</p>
              <p style="margin: 0;">🎓 <strong>Dual Certifications:</strong> Learnnect + AICTE certified programs</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px;">
              Can't wait? Call us directly and start your journey today!
            </p>
            <a href="tel:+917007788926" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
              📞 Call Now: +91 7007788926
            </a>
          </div>

          <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #00ffff;">The Learnnect Team</strong><br>
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
    console.log('✅ Enquiry confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending enquiry confirmation email:', error);
    return false;
  }
}

// Send newsletter confirmation email via Gmail business account
function sendNewsletterConfirmationEmail(e) {
  const userEmail = e.parameter.recipientEmail || e.parameter.email;
  const userName = e.parameter.recipientName || e.parameter.name || 'Learning Enthusiast';

  if (!userEmail) return false;

  const emailSubject = "📰 Welcome to the Inner Circle! Newsletter Subscription Confirmed";

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Newsletter Subscription Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 50px; width: auto; margin-bottom: 20px;">
          <h1 style="color: #00ffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);">
            Welcome to the Inner Circle, ${userName}! 🎉
          </h1>
          <p style="color: #ffffff; font-size: 16px; margin: 15px 0 0 0; opacity: 0.9;">
            You just joined our exclusive newsletter community of <strong style="color: #ff0080;">10,000+ learning enthusiasts</strong>. Get ready for some seriously good content! 🔥
          </p>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
          <!-- What's Coming -->
          <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
            <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">📬 What's Coming Your Way?</h3>
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 12px 0;">🚀 <strong>Latest Course Updates:</strong> Be the first to know about new courses and features</p>
              <p style="margin: 0 0 12px 0;">💡 <strong>Industry Insights:</strong> Trends, tips, and career advice from tech leaders</p>
              <p style="margin: 0 0 12px 0;">🎁 <strong>Exclusive Offers:</strong> Special discounts and early-bird pricing (subscribers only!)</p>
              <p style="margin: 0 0 12px 0;">📚 <strong>Free Resources:</strong> Guides, cheat sheets, and project templates</p>
              <p style="margin: 0;">🎯 <strong>Success Stories:</strong> Real stories from learners who landed their dream jobs</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://learnnect.com/courses" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px;">
              🎓 Explore Our Courses
            </a>
          </div>

          <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px; text-align: center;">💌 Newsletter Schedule</h3>
            <p style="color: #ffffff; margin: 0; font-size: 14px; text-align: center; line-height: 1.6;">
              We send out newsletters <strong>twice a week</strong> - just enough to keep you informed without overwhelming your inbox. Quality over quantity, always! ✨
            </p>
          </div>

          <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #00ffff;">The Learnnect Newsletter Team</strong><br>
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
      name: 'Learnnect Newsletter'
    });
    console.log('✅ Newsletter confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending newsletter confirmation email:', error);
    return false;
  }
}

// Send welcome email via Gmail business account
function sendWelcomeEmail(e) {
  const userEmail = e.parameter.recipientEmail || e.parameter.email;
  const userName = e.parameter.recipientName || e.parameter.name || 'Future Learner';

  if (!userEmail) return false;

  const emailSubject = "🎓 Welcome to the Future of Learning! Your Journey Starts Now";

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Learnnect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 50px; width: auto; margin-bottom: 20px;">
          <h1 style="color: #00ffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);">
            Welcome to Your Future, ${userName}! 🚀
          </h1>
          <p style="color: #ffffff; font-size: 18px; margin: 15px 0 0 0; opacity: 0.9;">
            You just joined <strong style="color: #ff0080;">10,000+ ambitious learners</strong> who are transforming their careers with cutting-edge skills!
          </p>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
          <!-- Success Stories -->
          <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 30px; margin: 30px 0;">
            <h2 style="color: #ff0080; margin: 0 0 20px 0; font-size: 20px; text-align: center; font-weight: 600;">🌟 Real Success Stories</h2>
            
            <div style="display: table; width: 100%; margin-bottom: 20px;">
              <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
                <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Priya S.</div>
                <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">Data Scientist at Google</div>
                <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹28L Package</div>
              </div>
              <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
                <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Rahul M.</div>
                <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">SDE at Microsoft</div>
                <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹32L Package</div>
              </div>
              <div style="display: table-cell; text-align: center; padding: 0 15px;">
                <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Anita K.</div>
                <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">ML Engineer at Amazon</div>
                <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹25L Package</div>
              </div>
            </div>
          </div>

          <!-- CTA Section -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://learnnect.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
              🚀 Start Your Journey Now
            </a>
            <p style="color: #a0a0a0; font-size: 14px; margin-top: 15px;">
              Join live sessions, access premium content, and start building your portfolio today!
            </p>
          </div>

          <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #00ffff;">The Learnnect Team</strong><br>
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
    console.log('✅ Welcome email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
}
