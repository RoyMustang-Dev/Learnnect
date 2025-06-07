# 🚀 Enquiry Widget Quick Setup Guide

## 📋 Prerequisites

Before setting up the enquiry widget, ensure you have:

1. ✅ Learnnect website running
2. ✅ Google Apps Script configured
3. ✅ Google Sheets integration working
4. ✅ Email system operational

## 🛠️ Installation Steps

### Step 1: Verify Component Files

Ensure these files are in place:

```
src/
├── components/
│   └── EnquiryWidget.tsx          ✅ Main widget component
├── hooks/
│   └── usePageTimer.ts            ✅ Time tracking hook
├── services/
│   └── googleAppsScriptService.ts ✅ Updated with enquiry methods
└── App.tsx                        ✅ Updated with widget integration
```

### Step 2: Update Google Apps Script

1. Open your Google Apps Script project
2. Update the script with the new enquiry handler:

```javascript
// Add to the switch statement in doPost function
case 'enquiry':
  result = handleEnquiryForm(doc, e)
  break
```

3. Add the new functions:
   - `handleEnquiryForm(doc, e)`
   - `sendEnquiryConfirmationEmail(e)`

### Step 3: Test the Implementation

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Open Browser**: Navigate to `http://localhost:3000`

3. **Test Auto-Popup**:
   - Wait 10 seconds on the homepage
   - Popup should appear automatically
   - Fill and submit the form

4. **Test Manual Widget**:
   - Click the floating button in bottom-right
   - Compact form should slide out
   - Test form submission

### Step 4: Verify Data Flow

1. **Check Google Sheets**:
   - Open your ContactForms sheet
   - Verify enquiry data is being stored
   - Check for proper formatting

2. **Check Email Delivery**:
   - Submit a test enquiry
   - Verify confirmation email is received
   - Check email formatting and links

## ⚙️ Configuration Options

### Auto-Popup Timing

Change the delay before auto-popup appears:

```typescript
// In App.tsx
<EnquiryWidget autoShowDelay={15000} /> // 15 seconds
```

### Course Options

Update available courses in the dropdown:

```typescript
// In EnquiryWidget.tsx
const courseOptions = [
  'Your Course 1',
  'Your Course 2',
  'Your Course 3',
  'Other'
];
```

### Styling Customization

The widget uses Tailwind CSS classes matching your website theme:

- **Primary Color**: `text-neon-cyan`, `border-neon-cyan`
- **Secondary Color**: `text-neon-magenta`, `border-neon-magenta`
- **Background**: `bg-gradient-to-br from-gray-900/95 to-neon-black/95`

## 🎯 Testing Checklist

### ✅ Functionality Tests

- [ ] Auto-popup appears after 10 seconds
- [ ] Manual widget button works
- [ ] Form validation works correctly
- [ ] Form submission succeeds
- [ ] Success message displays
- [ ] Widget closes automatically after success
- [ ] Session storage prevents duplicate popups

### ✅ Responsive Tests

- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Form fields are properly sized
- [ ] Buttons are touch-friendly

### ✅ Integration Tests

- [ ] Data appears in Google Sheets
- [ ] Email confirmation is sent
- [ ] Email content is properly formatted
- [ ] User data pre-fills when logged in
- [ ] Analytics tracking works

## 🐛 Troubleshooting

### Common Issues

#### 1. Auto-Popup Not Appearing
**Symptoms**: Widget button shows but no auto-popup
**Solutions**:
- Check browser console for errors
- Verify `usePageTimer` hook is working
- Clear sessionStorage: `sessionStorage.clear()`

#### 2. Form Submission Fails
**Symptoms**: Form shows error on submission
**Solutions**:
- Check Google Apps Script URL in `.env`
- Verify Google Apps Script is deployed
- Check network tab for API errors

#### 3. Email Not Received
**Symptoms**: Form submits but no email
**Solutions**:
- Check spam folder
- Verify Google Apps Script email function
- Check MailApp permissions in Google Apps Script

#### 4. Styling Issues
**Symptoms**: Widget doesn't match website theme
**Solutions**:
- Verify Tailwind CSS is loaded
- Check for CSS conflicts
- Update color classes if needed

### Debug Commands

```bash
# Check if all dependencies are installed
npm list

# Clear browser cache and storage
# In browser console:
localStorage.clear()
sessionStorage.clear()

# Check Google Apps Script logs
# In Google Apps Script editor: View > Logs
```

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Popup Display Rate**: How often auto-popup shows
2. **Conversion Rate**: Popup views to form submissions
3. **Course Interest**: Most requested courses
4. **Response Time**: Time from enquiry to follow-up

### Google Sheets Data Structure

The enquiry data is stored with these fields:
- Date
- Name
- Email
- Subject (includes course interest)
- Message (formatted with phone and details)
- Status (set to "Enquiry")

## 🚀 Going Live

### Pre-Launch Checklist

- [ ] All tests passing
- [ ] Google Apps Script deployed as web app
- [ ] Email templates reviewed and approved
- [ ] Analytics tracking configured
- [ ] Team trained on handling enquiries

### Launch Steps

1. **Deploy to Production**:
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

2. **Monitor Initial Performance**:
   - Watch for form submissions
   - Check email delivery rates
   - Monitor user engagement

3. **Optimize Based on Data**:
   - Adjust popup timing if needed
   - Update course options based on demand
   - Refine email templates

## 📞 Support

### Getting Help

If you encounter issues:

1. **Check Documentation**: Review this guide and main documentation
2. **Console Logs**: Check browser and Google Apps Script logs
3. **Test Environment**: Verify in development first
4. **Data Verification**: Check Google Sheets for data flow

### Contact Information

- **Technical Support**: Check Google Apps Script execution logs
- **Email Issues**: Verify MailApp permissions and quotas
- **UI/UX Issues**: Review Tailwind CSS classes and responsive design

---

**Setup Status**: ✅ Ready for Production
**Estimated Setup Time**: 15-30 minutes
**Difficulty Level**: Intermediate
