// WhatsApp Service for Learnnect
// Sends enrollment confirmations and motivational messages via WhatsApp

interface WhatsAppMessage {
  to: string; // Phone number with country code
  message: string;
  type: 'enrollment' | 'welcome' | 'motivation' | 'reminder';
}

class WhatsAppService {
  private readonly apiUrl = 'https://api.whatsapp.com/send'; // For demo purposes
  
  // Send enrollment confirmation via WhatsApp
  async sendEnrollmentConfirmation(data: {
    phone: string;
    name: string;
    courseName: string;
    courseId: string;
    price: number;
    enrollmentDate: string;
  }): Promise<boolean> {
    try {
      const message = this.generateEnrollmentMessage(data);
      
      // For demo purposes, we'll log the message
      // In production, you'd integrate with WhatsApp Business API
      console.log('📱 WhatsApp Enrollment Confirmation:', {
        to: `+91${data.phone}`,
        message,
        timestamp: new Date().toISOString()
      });

      // TODO: Implement actual WhatsApp sending
      // Options:
      // 1. WhatsApp Business API (Official)
      // 2. Twilio WhatsApp API
      // 3. MessageBird WhatsApp API
      // 4. 360Dialog WhatsApp API

      return true;
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Send welcome message to new users
  async sendWelcomeMessage(data: {
    phone: string;
    name: string;
  }): Promise<boolean> {
    try {
      const message = this.generateWelcomeMessage(data);
      
      console.log('📱 WhatsApp Welcome Message:', {
        to: `+91${data.phone}`,
        message,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('❌ Error sending WhatsApp welcome message:', error);
      return false;
    }
  }

  // Send motivational message
  async sendMotivationalMessage(data: {
    phone: string;
    name: string;
    courseName: string;
  }): Promise<boolean> {
    try {
      const message = this.generateMotivationalMessage(data);
      
      console.log('📱 WhatsApp Motivational Message:', {
        to: `+91${data.phone}`,
        message,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('❌ Error sending WhatsApp motivational message:', error);
      return false;
    }
  }

  // Generate enrollment confirmation message
  private generateEnrollmentMessage(data: {
    name: string;
    courseName: string;
    courseId: string;
    price: number;
    enrollmentDate: string;
  }): string {
    const enrollmentDate = new Date(data.enrollmentDate).toLocaleDateString('en-IN');
    
    return `🎉 *Enrollment Confirmed!*

Hi ${data.name}! 👋

Welcome to *${data.courseName}*! 

📚 *Course Details:*
• Course ID: ${data.courseId}
• Price: ${data.price === 0 ? 'FREE' : `₹${data.price}`}
• Enrolled: ${enrollmentDate}

🚀 *What's Next?*
✅ Check your email for course access
✅ Visit your dashboard: learnnect.com/dashboard
✅ Join our community for support

💡 *Pro Tip:* Set aside 30 minutes daily for consistent learning progress!

🔥 *"The expert in anything was once a beginner. Your journey starts now!"*

Need help? Reply to this message or email support@learnnect.com

Happy Learning! 🎯
Team Learnnect`;
  }

  // Generate welcome message for new users
  private generateWelcomeMessage(data: {
    name: string;
  }): string {
    return `🎉 *Welcome to Learnnect!*

Hi ${data.name}! 👋

Thank you for joining our learning community! 

🌟 *What makes us different?*
• Industry-relevant courses
• Hands-on projects
• Real-world applications
• Supportive community

🎯 *Ready to start?*
• Explore courses: learnnect.com/courses
• Complete your profile
• Join our community

💪 *"Every expert was once a beginner. Your potential is unlimited!"*

Let's build something amazing together! 🚀

Team Learnnect
support@learnnect.com`;
  }

  // Generate motivational message
  private generateMotivationalMessage(data: {
    name: string;
    courseName: string;
  }): string {
    const motivationalQuotes = [
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "Your limitation—it's only your imagination.",
      "Push yourself, because no one else is going to do it for you.",
      "Great things never come from comfort zones.",
      "Dream it. Wish it. Do it.",
      "Success doesn't just find you. You have to go out and get it.",
      "The harder you work for something, the greater you'll feel when you achieve it.",
      "Don't stop when you're tired. Stop when you're done."
    ];

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    return `🔥 *Keep Going, ${data.name}!*

You're doing amazing in *${data.courseName}*! 💪

🎯 *Remember:*
"${randomQuote}"

📈 *Your Progress Matters:*
• Every lesson completed is a step forward
• Every project builds your portfolio
• Every challenge makes you stronger

🚀 *Stay Consistent:*
• Set daily learning goals
• Practice what you learn
• Connect with fellow learners

💡 *Need Support?*
Our community is here to help!
Visit: learnnect.com/dashboard

You've got this! 🌟

Team Learnnect
support@learnnect.com`;
  }

  // Send course reminder
  async sendCourseReminder(data: {
    phone: string;
    name: string;
    courseName: string;
    lastActivity: string;
  }): Promise<boolean> {
    try {
      const message = this.generateReminderMessage(data);
      
      console.log('📱 WhatsApp Course Reminder:', {
        to: `+91${data.phone}`,
        message,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('❌ Error sending WhatsApp reminder:', error);
      return false;
    }
  }

  // Generate course reminder message
  private generateReminderMessage(data: {
    name: string;
    courseName: string;
    lastActivity: string;
  }): string {
    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(data.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    return `📚 *Don't Let Your Progress Slip!*

Hi ${data.name}! 👋

We noticed you haven't been active in *${data.courseName}* for ${daysSinceActivity} days.

🎯 *Quick Reminder:*
• Consistency is key to mastery
• Just 15 minutes daily makes a difference
• Your future self will thank you

🚀 *Continue Learning:*
Visit your dashboard: learnnect.com/dashboard

💪 *"A little progress each day adds up to big results!"*

We believe in you! 🌟

Team Learnnect
support@learnnect.com`;
  }

  // Validate Indian phone number
  private validatePhoneNumber(phone: string): boolean {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number
    // Should be 10 digits starting with 6, 7, 8, or 9
    return /^[6-9]\d{9}$/.test(cleanPhone);
  }

  // Format phone number for WhatsApp
  private formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    return `91${cleanPhone}`; // Add India country code
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
