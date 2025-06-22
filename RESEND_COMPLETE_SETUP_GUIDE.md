# 📧 Resend Email Service Complete Setup Guide

## 🎯 **Overview**
This guide covers the complete setup of Resend email service for Learnnect OTP verification and custom email sending. Resend is a modern, developer-friendly email API that's perfect for transactional emails.

---

## ✅ **Why Resend?**

### **Advantages over Gmail API:**
- ✅ **Simple Setup**: No complex OAuth or service accounts
- ✅ **Better Deliverability**: Dedicated email infrastructure
- ✅ **Free Tier**: 3,000 emails/month, 100 emails/day
- ✅ **Professional**: Built for transactional emails
- ✅ **Analytics**: Built-in email tracking and analytics
- ✅ **No Backend Required**: Direct API calls from frontend

### **Pricing:**
- **Free**: 3,000 emails/month, 100 emails/day
- **Pro**: $20/month for 50,000 emails
- **Perfect for OTP**: Free tier covers most OTP needs

---

## 🔧 **Step 1: Code Changes (Already Implemented)**

### **1.1 OTP Service Updates**

**File: `src/services/otpService.ts`** ✅ **ALREADY UPDATED**

The following changes have been implemented:

```typescript
// Resend Configuration
private readonly resendConfig: ResendConfig = {
  apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  fromEmail: 'support@learnnect.com',
  baseUrl: 'https://api.resend.com'
};

// Send OTP via Email using Resend
private async sendOTPEmail(email: string, otp: string, purpose: string): Promise<boolean> {
  // Uses Resend API for email sending
}

// Send email using Resend API
private async sendResendEmail(to: string, htmlContent: string, otp: string, purpose: string): Promise<boolean> {
  // Direct API call to Resend
}
```

### **1.2 Environment Variables**

**File: `.env.example`** ✅ **ALREADY UPDATED**

```env
# Resend Email Service (Recommended for Email OTP)
VITE_RESEND_API_KEY=your_resend_api_key_here
```

---

## 🚀 **Step 2: Resend Account Setup**

### **2.1 Create Resend Account**

1. **Visit Resend Website:**
   - Go to [https://resend.com/](https://resend.com/)
   - Click **"Sign Up"** or **"Get Started"**

2. **Sign Up:**
   ```
   Email: support@learnnect.com
   Password: [Create strong password]
   Company: Learnnect
   ```

3. **Verify Email:**
   - Check your email for verification link
   - Click to verify your account

### **2.2 Domain Verification**

1. **Add Your Domain:**
   - In Resend dashboard, go to **"Domains"**
   - Click **"Add Domain"**
   - Enter: `learnnect.com`

2. **DNS Configuration:**
   - Resend will provide DNS records to add
   - Add these records to your domain DNS settings:

   ```dns
   # Example DNS records (actual values will be provided by Resend)
   Type: TXT
   Name: _resend
   Value: resend-verify=abc123def456...

   Type: MX
   Name: @
   Value: 10 mx.resend.com

   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@learnnect.com
   ```

3. **Verify Domain:**
   - Click **"Verify Domain"** in Resend dashboard
   - Verification usually takes 5-10 minutes

### **2.3 Get API Key**

1. **Navigate to API Keys:**
   - In Resend dashboard, go to **"API Keys"**
   - Click **"Create API Key"**

2. **Create Key:**
   ```
   Name: Learnnect OTP Service
   Permission: Send emails
   Domain: learnnect.com (or All domains)
   ```

3. **Copy API Key:**
   - Copy the generated API key (starts with `re_`)
   - **Keep this secure** - it won't be shown again
   - Example: `re_123456789_abcdefghijklmnopqrstuvwxyz`

---

## 🌐 **Step 3: Environment Variables Setup**

### **3.1 Local Development**

**File: `.env`** (create if doesn't exist)

```env
# Resend Configuration
VITE_RESEND_API_KEY=re_your_actual_api_key_here
```

### **3.2 Netlify Production**

1. **Go to Netlify Dashboard:**
   - Open [https://app.netlify.com/](https://app.netlify.com/)
   - Select your Learnnect site

2. **Add Environment Variable:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**

3. **Add Resend API Key:**
   ```
   Key: VITE_RESEND_API_KEY
   Value: re_your_actual_api_key_here
   ```

4. **Deploy:**
   - Click **Save**
   - Trigger a new deployment

---

## 🧪 **Step 4: Testing the Setup**

### **4.1 Local Testing**

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test OTP Email:**
   - Go to signup/login page
   - Enter your email address
   - Request OTP
   - Check console for success logs
   - Check your email inbox

### **4.2 Production Testing**

1. **Deploy to Netlify:**
   - Push changes to your repository
   - Netlify will auto-deploy

2. **Test Live:**
   - Go to https://learnnect.com
   - Test OTP email functionality
   - Verify emails are received

---

## 📊 **Step 5: Email Templates & Customization**

### **5.1 Current OTP Email Template**

The system generates professional HTML emails with:
- ✅ Learnnect branding
- ✅ Gradient OTP display
- ✅ Security warnings
- ✅ Responsive design
- ✅ Professional styling

### **5.2 Customize Email Template**

**File: `src/services/otpService.ts`**

To customize the email template, modify the `generateOTPEmailHTML` method:

```typescript
private generateOTPEmailHTML(_email: string, otp: string, purpose: string): string {
  // Customize the HTML template here
  // Current template includes:
  // - Learnnect header with gradient
  // - Large OTP display
  // - Security warnings
  // - Professional footer
}
```

---

## 📈 **Step 6: Monitoring & Analytics**

### **6.1 Resend Dashboard**

1. **Email Analytics:**
   - Go to **"Logs"** in Resend dashboard
   - View sent emails, delivery status, opens, clicks

2. **Monitor Usage:**
   - Check **"Usage"** section
   - Track monthly email count
   - Monitor against free tier limits

### **6.2 Set Up Alerts**

1. **Usage Alerts:**
   - Set up alerts when approaching limits
   - Monitor delivery failures

2. **Error Monitoring:**
   - Check console logs for API errors
   - Monitor OTP success rates

---

## 🔒 **Step 7: Security & Best Practices**

### **7.1 API Key Security**

- ✅ Never commit API keys to version control
- ✅ Use environment variables only
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod

### **7.2 Email Security**

- ✅ Domain verification prevents spoofing
- ✅ SPF/DKIM records improve deliverability
- ✅ DMARC policy protects domain reputation

### **7.3 Rate Limiting**

- ✅ Built-in rate limiting (100 emails/day free)
- ✅ Implement user-level rate limiting
- ✅ Monitor for abuse patterns

---

## 💰 **Step 8: Cost Management**

### **8.1 Free Tier Limits**

- **3,000 emails/month**
- **100 emails/day**
- **Perfect for OTP verification**

### **8.2 Usage Estimation**

```
Daily OTP Emails: ~50-100 (within free limit)
Monthly OTP Emails: ~1,500-3,000 (within free limit)
Cost: $0/month for typical usage
```

### **8.3 Scaling**

If you exceed free limits:
- **Pro Plan**: $20/month for 50,000 emails
- **Still very cost-effective**

---

## 🛠️ **Step 9: Advanced Features**

### **9.1 Email Templates**

Create reusable templates in Resend:
- OTP verification
- Welcome emails
- Password reset
- Course enrollment confirmations

### **9.2 Webhooks**

Set up webhooks for:
- Email delivery confirmation
- Bounce handling
- Unsubscribe management

### **9.3 Bulk Emails**

Use Resend for:
- Newsletter sending
- Course announcements
- Marketing campaigns

---

## 📋 **Implementation Checklist**

### **Account Setup:**
- [ ] Create Resend account with support@learnnect.com
- [ ] Verify email address
- [ ] Add and verify learnnect.com domain
- [ ] Configure DNS records
- [ ] Create API key

### **Environment Setup:**
- [ ] Add VITE_RESEND_API_KEY to local .env
- [ ] Add VITE_RESEND_API_KEY to Netlify
- [ ] Test local development
- [ ] Deploy and test production

### **Testing:**
- [ ] Test OTP email sending
- [ ] Verify email delivery
- [ ] Check email formatting
- [ ] Test different email providers (Gmail, Outlook, etc.)
- [ ] Monitor Resend dashboard

### **Monitoring:**
- [ ] Set up usage monitoring
- [ ] Configure delivery alerts
- [ ] Monitor success/failure rates
- [ ] Track email analytics

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Domain Not Verified:**
   - Check DNS records are correctly added
   - Wait 5-10 minutes for propagation
   - Use DNS checker tools

2. **API Key Invalid:**
   - Ensure key starts with `re_`
   - Check for extra spaces or characters
   - Regenerate key if needed

3. **Emails Not Delivered:**
   - Check spam/junk folders
   - Verify domain is verified
   - Check Resend logs for errors

4. **Rate Limit Exceeded:**
   - Monitor daily usage (100 emails/day free)
   - Implement user-level rate limiting
   - Consider upgrading to Pro plan

### **Support Resources:**
- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Status Page**: https://status.resend.com/

---

## 🎉 **Ready to Go!**

Resend email service is now ready for production use! The implementation provides:

- ✅ **Professional OTP emails** with Learnnect branding
- ✅ **Reliable delivery** with 99.9% uptime
- ✅ **Cost-effective** with generous free tier
- ✅ **Easy monitoring** with built-in analytics
- ✅ **Scalable** for future email needs

**Next Steps:**
1. Create Resend account
2. Verify domain
3. Get API key
4. Add to environment variables
5. Test and deploy!

The email OTP system will be live and ready for your users! 🚀
