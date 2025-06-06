# 📊 Google Sheets Integration Setup Guide
**Complete Guide for Learnnect EdTech Platform Data Storage**

## 🎯 Overview

This guide will help you set up Google Sheets as a database for storing user data from your Learnnect EdTech platform. We'll use Google Apps Script for secure, reliable data storage with automatic email notifications.

## 📋 What You'll Achieve

- **Automatic user signup tracking** in Google Sheets
- **Login activity monitoring** with timestamps
- **Contact form submissions** storage
- **Course enrollment tracking**
- **User activity analytics**
- **Automated welcome emails** for new users
- **Contact form confirmation emails**

## 🔧 Step 1: Create Google Spreadsheet

### 1.1 Create New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"+ Blank"** to create a new spreadsheet
3. Rename it to **"Learnnect User Database"**

### 1.2 Create Required Sheets
Create these 5 tabs in your spreadsheet:

#### **UserSignUps Tab**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| Date | Platform | UserName | UserEmail | Mobile | UserID | Provider | Status |

#### **ExistingUsers Tab**
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Email | IsActive | LastLogin | LoginCount |

#### **ContactForms Tab**
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Date | Name | Email | Subject | Message | Status |

#### **CourseEnrollments Tab**
| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Date | UserEmail | CourseID | CourseName | Price | PaymentStatus | EnrollmentStatus |

#### **UserActivity Tab**
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Date | UserEmail | Action | Details | Platform | SessionID |

## 🔧 Step 2: Set Up Google Apps Script

### 2.1 Create Apps Script Project
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the default `myFunction()` code
3. Copy and paste the entire content from `GOOGLE_APPS_SCRIPT_CORRECT.gs`
4. Save the project (Ctrl+S) and name it **"Learnnect Data Handler"**

### 2.2 Run Initial Setup
1. In the Apps Script editor, select the `initialSetup` function
2. Click the **Run** button (▶️)
3. Grant necessary permissions when prompted
4. Check the execution log to confirm setup completed

### 2.3 Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Choose **Type**: Web app
3. Set **Execute as**: Me (your email)
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this for your .env file

## 🔧 Step 3: Configure Your React App

### 3.1 Update Environment Variables
Add this to your `.env` file:
```bash
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual ID from your deployed web app URL.

### 3.2 Test the Integration
1. Start your development server: `npm run dev`
2. Try signing up with a new account
3. Check your Google Sheets - you should see the data appear automatically!

## 📊 Data Flow Explanation

### **User Signup Process**
1. User signs up via Google/GitHub/Email
2. React app calls `googleAppsScriptService.recordUserSignup()`
3. Data is sent to Google Apps Script
4. Script adds row to **UserSignUps** sheet
5. Automated welcome email is sent to user

### **User Login Process**
1. User logs in successfully
2. React app calls `googleAppsScriptService.recordUserLogin()`
3. Script updates **ExistingUsers** sheet
4. Login count is incremented
5. Last login timestamp is updated

### **Contact Form Process**
1. User submits contact form
2. Data is sent to **ContactForms** sheet
3. Automated confirmation email is sent
4. Status is set to "New" for follow-up

## 🔐 Security Features

### **Built-in Security**
- **CORS protection** - Only your domain can send data
- **Input validation** - All data is sanitized
- **Error handling** - Graceful failure without breaking user experience
- **Rate limiting** - Google Apps Script has built-in rate limits

### **Privacy Compliance**
- **No sensitive data** stored (passwords are handled by Firebase)
- **Email consent** - Only users who sign up receive emails
- **Data retention** - You control how long data is kept
- **GDPR compliant** - Easy to export/delete user data

## 📈 Analytics & Insights

### **Available Data Points**
- **User Growth**: Track signups over time
- **Platform Preferences**: See which auth methods users prefer
- **Engagement**: Monitor login frequency
- **Geographic Data**: Track user locations (if enabled)
- **Course Popularity**: See which courses get most enrollments

### **Sample Analytics Queries**
```javascript
// Count users by platform
=COUNTIF(UserSignUps!B:B,"Google")

// Calculate daily signups
=COUNTIFS(UserSignUps!A:A,">="&TODAY()-1,UserSignUps!A:A,"<"&TODAY())

// Average login frequency
=AVERAGE(ExistingUsers!D:D)
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. "Script not found" Error**
- **Cause**: Incorrect Apps Script URL
- **Solution**: Redeploy the script and update the URL

#### **2. "Permission denied" Error**
- **Cause**: Script permissions not granted
- **Solution**: Re-run `initialSetup()` and grant permissions

#### **3. Data not appearing in sheets**
- **Cause**: Sheet names don't match script expectations
- **Solution**: Ensure sheet tabs are named exactly as specified

#### **4. Emails not sending**
- **Cause**: Gmail API limits or permissions
- **Solution**: Check Apps Script execution logs for email errors

### **Debug Mode**
Enable debug logging by checking the Apps Script execution logs:
1. Go to Apps Script editor
2. Click **Executions** in the left sidebar
3. View detailed logs for each function call

## 🔄 Maintenance

### **Regular Tasks**
- **Weekly**: Review new signups and contact forms
- **Monthly**: Analyze user growth trends
- **Quarterly**: Clean up old activity logs if needed
- **Yearly**: Review and update email templates

### **Backup Strategy**
- **Google Sheets**: Automatically backed up by Google
- **Apps Script**: Export code and save locally
- **Data Export**: Use Google Takeout for full data export

## 📞 Support

### **Getting Help**
- **Apps Script Issues**: Check [Google Apps Script documentation](https://developers.google.com/apps-script)
- **Sheets Problems**: Visit [Google Sheets Help Center](https://support.google.com/sheets)
- **Integration Issues**: Check browser console for error messages

### **Advanced Features**
- **Custom Email Templates**: Modify the email functions in Apps Script
- **Additional Data Points**: Add new columns and update the script
- **Webhook Integration**: Connect to other services via Apps Script
- **Automated Reports**: Set up time-driven triggers for regular reports

## ✅ Success Checklist

- [ ] Google Spreadsheet created with all 5 tabs
- [ ] Apps Script deployed as web app
- [ ] Environment variable configured
- [ ] Test signup completed successfully
- [ ] Data appears in UserSignUps sheet
- [ ] Welcome email received
- [ ] Login tracking working
- [ ] Contact form integration tested

## 🎉 You're All Set!

Your Learnnect platform now has a complete Google Sheets database integration! Users will be automatically tracked, emails will be sent, and you'll have comprehensive analytics about your platform usage.

**Next Steps:**
1. Monitor the data flow for a few days
2. Customize email templates to match your brand
3. Set up regular data analysis routines
4. Consider adding more advanced features like automated reports

Your EdTech platform is now production-ready with enterprise-grade data storage and user communication! 🚀
