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

✅ 35% OFF your first course enrollment
✅ FREE 1-on-1 career counseling (Worth ₹2,500)
✅ LIFETIME access to exclusive community
✅ 100% Job placement assistance

⏰ This offer expires in 48 HOURS!

Why Choose Learnnect?
• Unlock invaluable knowledge from industry experts
• 100% hands-on, project-based learning approach
• Build a portfolio of real-world projects
• Master the most in-demand skills in tech
• Get lifetime access to all course materials
• 24/7 expert support and mentorship

🎯 READY TO TRANSFORM YOUR CAREER?

Call us NOW: +91-7007788926
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }

        .glow {
          box-shadow: 0 0 20px rgba(0,255,255,0.5);
        }

        /* Mobile-First Responsive Styles */
        @media only screen and (max-width: 600px) {
          .main-container {
            margin: 0 !important;
            border-radius: 0 !important;
            width: 100% !important;
          }

          .header-content {
            padding: 30px 15px !important;
          }

          .main-title {
            font-size: 24px !important;
            line-height: 1.2 !important;
          }

          .neon-badge {
            max-width: 280px !important;
            padding: 12px 15px !important;
          }

          .neon-badge-text {
            font-size: 14px !important;
          }

          .main-content {
            padding: 30px 15px !important;
          }

          .greeting-text {
            font-size: 18px !important;
          }

          .congratulations-section {
            padding: 25px 15px !important;
          }

          .congratulations-title {
            font-size: 24px !important;
          }

          .congratulations-subtitle {
            font-size: 16px !important;
          }

          .offer-section {
            padding: 3px !important;
          }

          .offer-content {
            padding: 25px 15px !important;
          }

          .offer-title {
            font-size: 22px !important;
          }

          .benefits-list {
            padding: 25px 10px !important;
          }

          .benefit-item {
            font-size: 16px !important;
            padding: 12px 0 !important;
          }

          .benefit-checkmark {
            font-size: 18px !important;
            margin-right: 12px !important;
          }

          .countdown-timer {
            padding: 18px 25px !important;
            font-size: 16px !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }

          .stat-card {
            padding: 20px 15px !important;
          }

          .stat-number {
            font-size: 36px !important;
          }

          .stat-label {
            font-size: 13px !important;
          }

          .success-stories {
            padding: 25px 15px !important;
          }

          .story-card {
            padding: 20px 10px !important;
          }

          .urgency-section {
            padding: 25px 15px !important;
          }

          .urgency-title {
            font-size: 20px !important;
          }

          .urgency-subtitle {
            font-size: 16px !important;
          }

          .cta-button {
            padding: 16px 20px !important;
            font-size: 16px !important;
            margin: 10px 0 !important;
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .contact-section {
            padding: 25px 15px !important;
          }

          .contact-title {
            font-size: 20px !important;
          }

          .contact-info {
            font-size: 16px !important;
          }

          .footer-slogan {
            font-size: 20px !important;
          }

          .footer-tagline {
            font-size: 16px !important;
          }

          .warning-section {
            padding: 20px 10px !important;
          }

          .warning-text {
            font-size: 15px !important;
          }

          .footer-section {
            padding: 25px 15px !important;
          }
        }

        /* Extra Small Mobile Devices */
        @media only screen and (max-width: 480px) {
          .main-title {
            font-size: 20px !important;
          }

          .congratulations-title {
            font-size: 20px !important;
          }

          .offer-title {
            font-size: 18px !important;
          }

          .stat-number {
            font-size: 28px !important;
          }

          .cta-button {
            font-size: 14px !important;
            padding: 14px 20px !important;
          }
        }
      </style>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #ffffff; color: #ffffff;">
      
      <!-- Main Container with Neon Border -->
      <div class="main-container" style="width: 100%; margin: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 100%); border-radius: 0; overflow: hidden; box-shadow: 0 0 50px rgba(0,255,255,0.3), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);">

        <!-- Neon Header -->
        <div style="background: linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%); padding: 3px; border-radius: 0;">
          <div class="header-content" style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%); padding: 50px 20px; text-align: center; border-radius: 0; position: relative;">

            <!-- Animated Background Elements -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 20%, rgba(0,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,0,255,0.1) 0%, transparent 50%);"></div>

            <!-- Main Title with Neon Glow -->
            <h1 class="main-title" style="color: #00ffff; margin: 0 0 25px 0; font-size: 36px; font-weight: 800; text-shadow: 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4), 0 0 60px rgba(0,255,255,0.2); letter-spacing: -0.5px; position: relative; z-index: 1;">
              🚀 Your Success Journey Starts NOW!
            </h1>

            <!-- Neon Badge -->
            <div class="neon-badge" style="background: linear-gradient(45deg, #00ffff, #ff00ff); padding: 3px; border-radius: 30px; margin: 25px auto; max-width: 380px; box-shadow: 0 10px 30px rgba(0,255,255,0.4), 0 0 50px rgba(255,0,255,0.3); position: relative; z-index: 1;">
              <div style="background: #0a0a0a; border-radius: 27px; padding: 18px 35px;">
                <span class="neon-badge-text" style="color: #00ffff; font-size: 18px; font-weight: 700; text-shadow: 0 0 15px rgba(0,255,255,0.8); letter-spacing: 1px;">📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content" style="padding: 50px 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); position: relative;">
          
          <!-- Subtle Background Pattern -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(0,255,255,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.05) 0%, transparent 40%); pointer-events: none;"></div>
          
          <!-- Personal Greeting -->
          <p class="greeting-text" style="font-size: 22px; color: #ffffff; margin-bottom: 35px; font-weight: 600; position: relative; z-index: 1;">
            Dear <span style="color: #00ffff; text-shadow: 0 0 15px rgba(0,255,255,0.6); font-weight: 700;">${userName}</span>,
          </p>

          <!-- Congratulations Section -->
          <div class="congratulations-section" style="background: linear-gradient(135deg, #ff00ff 0%, #ff0080 100%); padding: 40px 20px; border-radius: 20px; text-align: center; margin: 40px 0; box-shadow: 0 20px 50px rgba(255,0,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2); position: relative; overflow: hidden; z-index: 1;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%);"></div>
            <h2 class="congratulations-title" style="margin: 0 0 20px 0; font-size: 34px; color: #ffffff; font-weight: 800; text-shadow: 0 0 25px rgba(255,255,255,0.8); position: relative; z-index: 1;">🎯 CONGRATULATIONS!</h2>
            <p class="congratulations-subtitle" style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 600; position: relative; z-index: 1;">You've just taken the FIRST STEP toward a ₹10+ LPA career!</p>
          </div>

          <!-- Course Interest Message -->
          <p style="color: #e0e0e0; font-size: 18px; margin: 35px 0; line-height: 1.8; position: relative; z-index: 1;">
            Your enquiry about <strong style="color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.6); font-weight: 700;">"${courseInterest}"</strong> shows you're serious about success. We're <span style="color: #ff00ff; font-weight: 700;">THRILLED</span> to help you transform your career!
          </p>

          <!-- Exclusive Offer Section -->
          <div class="offer-section" style="background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%); padding: 4px; border-radius: 24px; margin: 45px 0; box-shadow: 0 25px 60px rgba(0,255,255,0.3), 0 0 100px rgba(255,0,255,0.2); position: relative; z-index: 1;">
            <div class="offer-content" style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); padding: 45px 20px; border-radius: 20px; position: relative;">

              <!-- Limited Time Badge -->
              <div style="position: absolute; top: -25px; right: -25px; background: linear-gradient(45deg, #ff00ff, #ff0080); color: white; padding: 15px 30px; border-radius: 35px; text-align: center; font-weight: 800; font-size: 16px; transform: rotate(15deg); box-shadow: 0 15px 35px rgba(255,0,255,0.5); text-shadow: 0 0 15px rgba(255,255,255,0.8); z-index: 2;">
                LIMITED TIME OFFER!
              </div>

              <!-- Offer Title -->
              <h3 class="offer-title" style="color: #00ffff; margin: 0 0 35px 0; font-size: 32px; text-align: center; font-weight: 800; text-shadow: 0 0 25px rgba(0,255,255,0.8); letter-spacing: -0.5px;">
                🔥 EXCLUSIVE OFFER - JUST FOR YOU! 🔥
              </h3>

              <!-- Benefits List -->
              <div class="benefits-list" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 20px; border-radius: 20px; margin: 30px 0; border: 2px solid rgba(0,255,255,0.4); box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3);">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li class="benefit-item" style="padding: 18px 0; border-bottom: 1px solid rgba(0,255,255,0.3); font-size: 20px; color: #ffffff; display: flex; align-items: center;">
                    <span class="benefit-checkmark" style="color: #00ffff; font-weight: 800; text-shadow: 0 0 15px rgba(0,255,255,0.6); margin-right: 20px; font-size: 22px;">✅ 35% OFF</span> your first course enrollment
                  </li>
                  <li class="benefit-item" style="padding: 18px 0; border-bottom: 1px solid rgba(0,255,255,0.3); font-size: 20px; color: #ffffff; display: flex; align-items: center;">
                    <span class="benefit-checkmark" style="color: #00ffff; font-weight: 800; text-shadow: 0 0 15px rgba(0,255,255,0.6); margin-right: 20px; font-size: 22px;">✅ FREE</span> 1-on-1 career counseling (Worth ₹2,500)
                  </li>
                  <li class="benefit-item" style="padding: 18px 0; border-bottom: 1px solid rgba(0,255,255,0.3); font-size: 20px; color: #ffffff; display: flex; align-items: center;">
                    <span class="benefit-checkmark" style="color: #00ffff; font-weight: 800; text-shadow: 0 0 15px rgba(0,255,255,0.6); margin-right: 20px; font-size: 22px;">✅ LIFETIME</span> access to exclusive community
                  </li>
                  <li class="benefit-item" style="padding: 18px 0; border-bottom: 1px solid rgba(0,255,255,0.3); font-size: 20px; color: #ffffff; display: flex; align-items: center;">
                    <span class="benefit-checkmark" style="color: #00ffff; font-weight: 800; text-shadow: 0 0 15px rgba(0,255,255,0.6); margin-right: 20px; font-size: 22px;">✅ 100%</span> Job placement assistance
                  </li>
                  <li class="benefit-item" style="padding: 18px 0; font-size: 20px; color: #ffffff; display: flex; align-items: center;">
                    <span class="benefit-checkmark" style="color: #00ffff; font-weight: 800; text-shadow: 0 0 15px rgba(0,255,255,0.6); margin-right: 20px; font-size: 22px;">✅ INDUSTRY</span> recognized certification
                  </li>
                </ul>
              </div>
              
              <!-- Countdown Timer -->
              <div style="text-align: center; margin: 40px 0;">
                <div style="background: linear-gradient(45deg, #ff00ff, #ff0080); color: white; padding: 25px 50px; border-radius: 40px; display: inline-block; font-weight: 800; font-size: 24px; box-shadow: 0 20px 50px rgba(255,0,255,0.5); text-shadow: 0 0 20px rgba(255,255,255,0.8); animation: pulse 2s infinite;">
                  ⏰ Offer Expires in 48 HOURS!
                </div>
              </div>
              
            </div>
          </div>

          <!-- Success Statistics -->
          <div style="background: linear-gradient(135deg, rgba(0,255,255,0.15), rgba(255,0,255,0.15)); padding: 40px 20px; border-radius: 20px; margin: 40px 0; border: 1px solid rgba(0,255,255,0.4); backdrop-filter: blur(10px); box-shadow: 0 15px 40px rgba(0,0,0,0.3); position: relative; z-index: 1;">
            <h3 style="color: #00ffff; text-align: center; margin: 0 0 35px 0; font-size: 28px; font-weight: 800; text-shadow: 0 0 20px rgba(0,255,255,0.8);">🚀 Why Smart Learners Choose Learnnect</h3>

            <!-- 2x2 Grid Layout for Better Mobile Support -->
            <div class="stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; max-width: 600px; margin: 0 auto;">

              <!-- Row 1 -->
              <div class="stat-card" style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,255,255,0.05)); border-radius: 15px; border: 1px solid rgba(0,255,255,0.2);">
                <div class="stat-number" style="font-size: 42px; font-weight: 800; color: #00ffff; text-shadow: 0 0 25px rgba(0,255,255,0.8); margin-bottom: 12px; line-height: 1;">₹15L+</div>
                <div class="stat-label" style="font-size: 14px; color: #e0e0e0; font-weight: 600; line-height: 1.3;">Average Data Scientist Salary</div>
              </div>

              <div class="stat-card" style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(255,0,255,0.1), rgba(255,0,255,0.05)); border-radius: 15px; border: 1px solid rgba(255,0,255,0.2);">
                <div class="stat-number" style="font-size: 42px; font-weight: 800; color: #ff00ff; text-shadow: 0 0 25px rgba(255,0,255,0.8); margin-bottom: 12px; line-height: 1;">300%</div>
                <div class="stat-label" style="font-size: 14px; color: #e0e0e0; font-weight: 600; line-height: 1.3;">Job Growth in AI/ML</div>
              </div>

              <!-- Row 2 -->
              <div class="stat-card" style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,255,255,0.05)); border-radius: 15px; border: 1px solid rgba(0,255,255,0.2);">
                <div class="stat-number" style="font-size: 42px; font-weight: 800; color: #00ffff; text-shadow: 0 0 25px rgba(0,255,255,0.8); margin-bottom: 12px; line-height: 1;">100%</div>
                <div class="stat-label" style="font-size: 14px; color: #e0e0e0; font-weight: 600; line-height: 1.3;">Hands-on Project Based</div>
              </div>

              <div class="stat-card" style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(255,0,255,0.1), rgba(255,0,255,0.05)); border-radius: 15px; border: 1px solid rgba(255,0,255,0.2);">
                <div class="stat-number" style="font-size: 42px; font-weight: 800; color: #ff00ff; text-shadow: 0 0 25px rgba(255,0,255,0.8); margin-bottom: 12px; line-height: 1;">LIVE</div>
                <div class="stat-label" style="font-size: 14px; color: #e0e0e0; font-weight: 600; line-height: 1.3;">Interactive Sessions</div>
              </div>

            </div>

            <!-- Fallback for email clients that don't support CSS Grid -->
            <!--[if mso]>
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td width="50%" style="padding: 10px;">
                  <div style="text-align: center; padding: 20px; background: rgba(0,255,255,0.1); border-radius: 15px;">
                    <div style="font-size: 42px; font-weight: 800; color: #00ffff; margin-bottom: 12px;">₹15L+</div>
                    <div style="font-size: 14px; color: #e0e0e0; font-weight: 600;">Average Data Scientist Salary</div>
                  </div>
                </td>
                <td width="50%" style="padding: 10px;">
                  <div style="text-align: center; padding: 20px; background: rgba(255,0,255,0.1); border-radius: 15px;">
                    <div style="font-size: 42px; font-weight: 800; color: #ff00ff; margin-bottom: 12px;">300%</div>
                    <div style="font-size: 14px; color: #e0e0e0; font-weight: 600;">Job Growth in AI/ML</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding: 10px;">
                  <div style="text-align: center; padding: 20px; background: rgba(0,255,255,0.1); border-radius: 15px;">
                    <div style="font-size: 42px; font-weight: 800; color: #00ffff; margin-bottom: 12px;">100%</div>
                    <div style="font-size: 14px; color: #e0e0e0; font-weight: 600;">Hands-on Project Based</div>
                  </div>
                </td>
                <td width="50%" style="padding: 10px;">
                  <div style="text-align: center; padding: 20px; background: rgba(255,0,255,0.1); border-radius: 15px;">
                    <div style="font-size: 42px; font-weight: 800; color: #ff00ff; margin-bottom: 12px;">LIVE</div>
                    <div style="font-size: 14px; color: #e0e0e0; font-weight: 600;">Interactive Sessions</div>
                  </div>
                </td>
              </tr>
            </table>
            <![endif]-->

          </div>

          <!-- Success Stories -->
          <div class="success-stories" style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 35px 20px; border-radius: 20px; margin: 35px 0; border-left: 5px solid #00ffff; box-shadow: 0 15px 40px rgba(0,0,0,0.4), 0 0 50px rgba(0,255,255,0.1); position: relative; z-index: 1;">
            <h4 style="color: #00ffff; margin: 0 0 25px 0; font-size: 24px; font-weight: 700; text-shadow: 0 0 15px rgba(0,255,255,0.6);">🚀 What You'll Achieve:</h4>
            <div class="story-card" style="margin: 20px 0; padding: 25px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); border-radius: 15px; border: 1px solid rgba(0,255,255,0.3);">
              <strong style="color: #00ffff; font-size: 20px; text-shadow: 0 0 10px rgba(0,255,255,0.5);">Build Real Projects</strong><br>
              <em style="color: #e0e0e0; font-size: 18px; margin-top: 8px; display: block;">"Create a portfolio of 5+ industry-ready projects that showcase your skills to employers."</em>
            </div>
            <div class="story-card" style="margin: 20px 0; padding: 25px; background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); border-radius: 15px; border: 1px solid rgba(255,0,255,0.3);">
              <strong style="color: #ff00ff; font-size: 20px; text-shadow: 0 0 10px rgba(255,0,255,0.5);">Master In-Demand Skills</strong><br>
              <em style="color: #e0e0e0; font-size: 18px; margin-top: 8px; display: block;">"Learn Python, Machine Learning, and AI tools that companies are actively hiring for."</em>
            </div>
          </div>

          <!-- Urgency Section -->
          <div class="urgency-section" style="background: linear-gradient(135deg, #ff00ff, #ff0080); padding: 35px 20px; border-radius: 20px; text-align: center; margin: 40px 0; box-shadow: 0 20px 50px rgba(255,0,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2); position: relative; z-index: 1;">
            <h3 class="urgency-title" style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: 800; text-shadow: 0 0 20px rgba(255,255,255,0.8);">⚡ URGENT: Next Batch Starts in 3 Days!</h3>
            <p class="urgency-subtitle" style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 600;">Only 5 seats remaining. Don't miss out on this life-changing opportunity!</p>
          </div>

          <!-- Call to Action Buttons -->
          <div style="text-align: center; margin: 50px 0; position: relative; z-index: 1;">
            <a href="tel:+919876543210"
               class="cta-button"
               style="background: linear-gradient(45deg, #00ffff, #0080ff);
                      color: #ffffff;
                      padding: 22px 45px;
                      text-decoration: none;
                      border-radius: 35px;
                      font-weight: 800;
                      display: inline-block;
                      margin: 15px;
                      box-shadow: 0 15px 40px rgba(0,255,255,0.5);
                      font-size: 20px;
                      text-shadow: 0 0 15px rgba(255,255,255,0.8);
                      transition: all 0.3s ease;
                      border: 2px solid rgba(0,255,255,0.5);">
              📞 Call NOW: +91-7007788926
            </a>
            <br>
            <a href="https://learnnect-app.onrender.com/courses"
               class="cta-button"
               style="background: linear-gradient(45deg, #ff00ff, #ff0080);
                      color: #ffffff;
                      padding: 22px 45px;
                      text-decoration: none;
                      border-radius: 35px;
                      font-weight: 800;
                      display: inline-block;
                      margin: 15px;
                      box-shadow: 0 15px 40px rgba(255,0,255,0.5);
                      font-size: 20px;
                      text-shadow: 0 0 15px rgba(255,255,255,0.8);
                      transition: all 0.3s ease;
                      border: 2px solid rgba(255,0,255,0.5);">
              🚀 Enroll Now & Save 50%
            </a>
          </div>

          <!-- Contact Information -->
          <div class="contact-section" style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); color: white; padding: 40px 20px; border-radius: 20px; margin: 35px 0; border: 2px solid rgba(0,255,255,0.4); box-shadow: 0 15px 40px rgba(0,0,0,0.4), 0 0 50px rgba(0,255,255,0.1); position: relative; z-index: 1;">
            <h4 class="contact-title" style="color: #00ffff; margin: 0 0 25px 0; font-size: 26px; font-weight: 800; text-shadow: 0 0 20px rgba(0,255,255,0.8);">📞 Ready to Transform Your Career?</h4>
            <p class="contact-info" style="margin: 12px 0; font-size: 18px; color: #e0e0e0;"><strong style="color: #ff00ff; font-weight: 700;">Phone:</strong> +91-7007788926</p>
            <p class="contact-info" style="margin: 12px 0; font-size: 18px; color: #e0e0e0;"><strong style="color: #ff00ff; font-weight: 700;">WhatsApp:</strong> +91-7007788926</p>
            <p class="contact-info" style="margin: 12px 0; font-size: 18px; color: #e0e0e0;"><strong style="color: #ff00ff; font-weight: 700;">Email:</strong> support@learnnect.com</p>
            <p class="contact-info" style="margin: 25px 0 12px 0; color: #00ffff; font-size: 18px; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,255,0.5);"><strong>Best Time to Call:</strong> 9 AM - 9 PM (Mon-Sun)</p>
          </div>

          <!-- Footer with Slogan -->
          <div style="text-align: center; margin: 50px 0; position: relative; z-index: 1;">
            <div class="footer-slogan" style="background: linear-gradient(45deg, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 800; margin: 25px 0; text-shadow: 0 0 20px rgba(0,255,255,0.5);">
              📚 LEARN • 🤝 CONNECT • 🏆 SUCCEED!!
            </div>
            <p class="footer-tagline" style="color: #e0e0e0; font-style: italic; font-size: 20px; font-weight: 600;">"Where Dreams Meet Reality"</p>
          </div>

          <!-- Final Warning -->
          <div class="warning-section" style="background: linear-gradient(135deg, rgba(255,255,0,0.15), rgba(255,165,0,0.15)); border: 2px solid rgba(255,255,0,0.4); padding: 25px 20px; border-radius: 20px; margin: 35px 0; position: relative; z-index: 1;">
            <p class="warning-text" style="margin: 0; color: #ffff00; font-weight: 800; font-size: 18px; text-shadow: 0 0 15px rgba(255,255,0,0.6); text-align: center;">
              ⚠️ P.S. - This exclusive offer is only valid for the next 48 hours.
              Our courses have a 100% success rate, and seats fill up FAST!
            </p>
          </div>

          <p style="color: #e0e0e0; font-size: 18px; text-align: center; margin: 40px 0; font-weight: 600; position: relative; z-index: 1;">
            Don't let this opportunity slip away. Your future self will thank you!
          </p>

        </div>

        <!-- Footer -->
        <div class="footer-section" style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); color: white; padding: 40px 20px; text-align: center; border-top: 2px solid rgba(0,255,255,0.4);">
          <p style="margin: 0; font-weight: 800; font-size: 22px; color: #00ffff; text-shadow: 0 0 15px rgba(0,255,255,0.6);">The Learnnect Success Team</p>
          <p style="margin: 15px 0 0 0; font-style: italic; color: #e0e0e0; font-size: 18px; font-weight: 600;">Transforming Lives, One Course at a Time</p>
          <p style="margin: 25px 0 0 0; font-size: 16px; color: #888888;">© 2025 Learnnect. All rights reserved.</p>
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