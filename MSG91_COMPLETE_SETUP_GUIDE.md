# 📱 MSG91 SMS OTP Complete Setup Guide

## 🎯 **Overview**
This guide covers the complete setup of MSG91 SMS OTP service for Learnnect, including all code changes, environment variables, and deployment updates.

---

## 📋 **Prerequisites & Government Documentation**

### **Required Documents for MSG91 Account:**
1. **Business Registration Certificate** (Company incorporation/partnership deed)
2. **GST Registration Certificate** (if applicable)
3. **PAN Card** (Business/Individual)
4. **Aadhaar Card** (for individual verification)
5. **Address Proof** (Utility bill/Bank statement)
6. **Bank Account Details** (for billing)
7. **Authorized Signatory ID Proof**

### **Important Notes:**
- MSG91 requires **government-approved documentation** for business verification
- Verification process takes **2-5 business days**
- Without proper documentation, account may be suspended
- **Recommendation**: Implement this service after obtaining all required documents

---

## 🔧 **Step 1: Code Changes (Frontend)**

### **1.1 Update OTP Service Configuration**

**File: `src/services/otpService.ts`**

Add MSG91 configuration section:

```typescript
// Add after line 59 (after gmailConfig)
// MSG91 Configuration for Production
private readonly msg91Config = {
  authKey: import.meta.env.VITE_MSG91_AUTH_KEY || '',
  templateId: import.meta.env.VITE_MSG91_TEMPLATE_ID || '',
  senderId: import.meta.env.VITE_MSG91_SENDER_ID || 'LRNECT',
  baseUrl: 'https://api.msg91.com/api/v5'
};
```

### **1.2 Update SMS Sending Method**

**File: `src/services/otpService.ts`**

Replace the `sendOTPSMS` method (around line 363):

```typescript
// Send OTP via SMS using MSG91
private async sendOTPSMS(phone: string, otp: string, purpose: string): Promise<boolean> {
  try {
    if (!this.msg91Config.authKey || !this.msg91Config.templateId) {
      console.log('📱 MSG91 not configured, logging OTP:', otp);
      return true; // Return true for development
    }

    const success = await this.sendMSG91OTP(phone, otp, purpose);
    
    if (success) {
      console.log('✅ OTP SMS sent successfully via MSG91');
      return true;
    } else {
      console.error('❌ Failed to send OTP SMS via MSG91');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending OTP SMS:', error);
    return false;
  }
}

// Format phone number for MSG91 (add country code)
private formatPhoneForMSG91(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `91${cleanPhone}`; // Add India country code
}

// Send OTP using MSG91 API
private async sendMSG91OTP(phone: string, otp: string, purpose: string): Promise<boolean> {
  try {
    const formattedPhone = this.formatPhoneForMSG91(phone);
    
    // MSG91 Send OTP API
    const url = `${this.msg91Config.baseUrl}/otp`;
    const payload = {
      template_id: this.msg91Config.templateId,
      mobile: formattedPhone,
      authkey: this.msg91Config.authKey,
      otp: otp,
      otp_expiry: this.otpExpiryMinutes,
      sender: this.msg91Config.senderId
    };

    console.log('📱 Sending MSG91 OTP:', {
      phone: formattedPhone,
      templateId: this.msg91Config.templateId,
      otp: otp
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': this.msg91Config.authKey
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok && result.type === 'success') {
      console.log('✅ MSG91 OTP sent successfully:', result);
      return true;
    } else {
      console.error('❌ MSG91 API error:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ MSG91 API Error:', error);
    return false;
  }
}
```

---

## 🌐 **Step 2: Environment Variables**

### **2.1 Update .env.example**

**File: `.env.example`**

Add MSG91 configuration:

```env
# MSG91 SMS OTP Service (Production)
# 1. Sign up at https://msg91.com/
# 2. Complete business verification with government documents
# 3. Get your Auth Key from API section
# 4. Create an OTP template and get Template ID
# 5. Set your Sender ID (6 characters, alphanumeric)
VITE_MSG91_AUTH_KEY=your_msg91_auth_key_here
VITE_MSG91_TEMPLATE_ID=your_msg91_template_id_here
VITE_MSG91_SENDER_ID=LRNECT
```

### **2.2 Create Local .env File**

**File: `.env` (for local development)**

```env
# MSG91 Configuration (Development)
VITE_MSG91_AUTH_KEY=
VITE_MSG91_TEMPLATE_ID=
VITE_MSG91_SENDER_ID=LRNECT
```

---

## 🚀 **Step 3: Netlify Deployment Updates**

### **3.1 Add Environment Variables to Netlify**

1. **Go to Netlify Dashboard:**
   - Open [https://app.netlify.com/](https://app.netlify.com/)
   - Select your Learnnect site

2. **Navigate to Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**

3. **Add MSG91 Variables:**
   ```
   Key: VITE_MSG91_AUTH_KEY
   Value: [Your MSG91 Auth Key - will be provided after account setup]
   
   Key: VITE_MSG91_TEMPLATE_ID
   Value: [Your MSG91 Template ID - will be provided after template approval]
   
   Key: VITE_MSG91_SENDER_ID
   Value: LRNECT
   ```

4. **Deploy Changes:**
   - Click **Save**
   - Trigger a new deployment to apply environment variables

---

## 🏗️ **Step 4: Backend Updates (Optional)**

### **4.1 Backend API Enhancement (if needed)**

**File: `backend-api-template.js`** (if you want server-side SMS sending)

Add MSG91 endpoint:

```javascript
// MSG91 Configuration
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Send SMS via MSG91 (server-side)
app.post('/api/send-sms-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phone, otp'
      });
    }

    if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
      console.log('MSG91 not configured, simulating SMS send');
      return res.json({
        success: true,
        message: 'SMS sent (demo mode)',
        requestId: 'demo_' + Date.now()
      });
    }

    // Format phone number
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;

    // MSG91 API call
    const response = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY
      },
      body: JSON.stringify({
        template_id: MSG91_TEMPLATE_ID,
        mobile: formattedPhone,
        authkey: MSG91_AUTH_KEY,
        otp: otp,
        otp_expiry: 10
      })
    });

    const result = await response.json();

    if (response.ok && result.type === 'success') {
      res.json({
        success: true,
        message: 'SMS sent successfully',
        requestId: result.request_id
      });
    } else {
      throw new Error(result.message || 'MSG91 API error');
    }

  } catch (error) {
    console.error('❌ MSG91 API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});
```

### **4.2 Render Backend Environment Variables**

If using backend SMS sending:

1. **Go to Render Dashboard:**
   - Open your backend service
   - Go to **Environment** tab

2. **Add Variables:**
   ```
   MSG91_AUTH_KEY = [Your MSG91 Auth Key]
   MSG91_TEMPLATE_ID = [Your MSG91 Template ID]
   ```

---

## 📱 **Step 5: MSG91 Account Setup (When Ready)**

### **5.1 Account Creation**

1. **Visit MSG91:**
   - Go to [https://msg91.com/](https://msg91.com/)
   - Click **Sign Up**

2. **Business Registration:**
   ```
   Business Email: support@learnnect.com
   Company Name: Learnnect
   Mobile Number: [Your business phone]
   Country: India
   Business Type: EdTech/Education
   ```

### **5.2 Document Verification**

1. **Upload Required Documents:**
   - Business registration certificate
   - GST certificate (if applicable)
   - PAN card
   - Address proof
   - Bank account details

2. **Wait for Approval:**
   - Verification takes 2-5 business days
   - You'll receive email confirmation

### **5.3 Get API Credentials**

1. **Access Dashboard:**
   - Login to MSG91 dashboard
   - Go to **API** section

2. **Copy Auth Key:**
   - Note down your **Auth Key**
   - This will be used in environment variables

### **5.4 Create OTP Template**

1. **Navigate to Templates:**
   - Go to **SMS** → **Templates**
   - Click **Create Template**

2. **Template Configuration:**
   ```
   Template Name: Learnnect OTP
   Template Type: OTP
   Category: Transactional
   Template Content: Your Learnnect OTP is ##OTP##. Valid for 10 minutes. Do not share with anyone. - LRNECT
   Sender ID: LRNECT
   ```

3. **Submit for Approval:**
   - Templates require approval (2-4 hours)
   - You'll receive **Template ID** via email

---

## 🧪 **Step 6: Testing & Validation**

### **6.1 Development Testing**

1. **Without MSG91 Credentials:**
   - OTP will be logged to console
   - Service returns success for development

2. **With MSG91 Credentials:**
   - Real SMS will be sent
   - Check console for API responses

### **6.2 Production Testing**

1. **Test Phone Number Validation:**
   - Try invalid numbers (should fail)
   - Try valid Indian numbers (should work)

2. **Test OTP Flow:**
   - Send OTP → Receive SMS → Verify OTP
   - Test expiry (10 minutes)
   - Test attempt limits (3 attempts)

---

## 💰 **Step 7: Cost Management**

### **7.1 MSG91 Pricing:**
- **Setup Cost**: Free account creation
- **SMS Cost**: ₹0.15-0.25 per SMS (varies by volume)
- **Monthly Estimate**: ₹1,500-2,500 for 10,000 SMS

### **7.2 Usage Monitoring:**
- Monitor SMS usage in MSG91 dashboard
- Set up billing alerts
- Track OTP success/failure rates

---

## 🔒 **Step 8: Security Considerations**

### **8.1 Environment Security:**
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys periodically

### **8.2 Rate Limiting:**
- Implement user-level rate limiting
- Monitor for abuse patterns
- Set daily/hourly SMS limits

---

## 📋 **Implementation Checklist**

### **Code Changes:**
- [ ] Update `src/services/otpService.ts` with MSG91 integration
- [ ] Add MSG91 configuration variables
- [ ] Update `.env.example` with MSG91 variables
- [ ] Test local development (console logging)

### **Deployment:**
- [ ] Add environment variables to Netlify
- [ ] Deploy frontend changes
- [ ] Test in staging environment

### **MSG91 Account (When Ready):**
- [ ] Gather all required government documents
- [ ] Create MSG91 account
- [ ] Complete business verification
- [ ] Get Auth Key and Template ID
- [ ] Update production environment variables
- [ ] Test production SMS sending

### **Monitoring:**
- [ ] Set up usage monitoring
- [ ] Configure billing alerts
- [ ] Monitor success/failure rates
- [ ] Set up error logging

---

## ⚠️ **Important Notes**

1. **Government Documentation**: MSG91 requires proper business documentation. Implement only after obtaining all required documents.

2. **Verification Time**: Account verification takes 2-5 business days.

3. **Template Approval**: OTP templates require approval (2-4 hours).

4. **Cost Management**: Monitor usage to control costs.

5. **Fallback**: Current implementation gracefully handles missing credentials for development.

---

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **Account Suspended**: Incomplete documentation
2. **Template Rejected**: Non-compliant message format
3. **API Errors**: Invalid credentials or rate limits
4. **SMS Not Delivered**: Invalid phone numbers or network issues

### **Support:**
- MSG91 Support: support@msg91.com
- Documentation: https://docs.msg91.com/
- Status Page: https://status.msg91.com/

This completes the MSG91 setup guide. The service is ready to implement once you have the required government documentation!
