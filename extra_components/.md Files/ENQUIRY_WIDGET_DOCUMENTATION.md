# 🎯 Enquiry Widget Implementation Documentation

## 📋 Overview

The Enquiry Widget is a sophisticated, non-chatbot enquiry system designed to capture leads and course inquiries from website visitors. It features auto-popup functionality, persistent availability, and seamless integration with Google Sheets for data storage.

## ✨ Key Features

### 🚀 Auto-Popup Functionality
- **Smart Timing**: Automatically appears after 10 seconds of user engagement
- **Visibility Tracking**: Only counts time when the page is actually visible
- **Session Memory**: Prevents multiple popups in the same session using sessionStorage
- **User-Friendly**: Non-intrusive design that doesn't disrupt user experience

### 🎨 Design & UI/UX
- **Cyberpunk Theme**: Matches Learnnect's neon-themed design language
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Professional transitions and hover effects
- **Accessibility**: Screen reader friendly and keyboard navigable

### 📱 Widget States
1. **Vertical Button**: Professional vertical "ENQUIRE NOW" button on right edge
2. **Auto-Popup Modal**: Full-screen overlay with detailed form
3. **Expanded Widget**: Compact form that slides out from the vertical button
4. **Success State**: Confirmation message with auto-close functionality

### 📊 Data Integration
- **Google Sheets**: Automatic data storage in organized sheets
- **Email Notifications**: Automated confirmation emails to users
- **Activity Tracking**: Integration with existing analytics system
- **Real-time Processing**: Instant form submission and feedback

## 🛠️ Technical Implementation

### Core Components

#### 1. EnquiryWidget.tsx
```typescript
// Main widget component with all functionality
- Auto-popup logic with page timer
- Form handling and validation
- Google Sheets integration
- Email notification triggers
- Responsive design implementation
```

#### 2. usePageTimer.ts
```typescript
// Custom hook for accurate time tracking
- Visibility-aware timing
- Pause/resume functionality
- Target time detection
- Performance optimized
```

#### 3. Google Apps Script Integration
```javascript
// Enhanced backend processing
- New 'enquiry' action type
- Dedicated email templates
- Data formatting and storage
- Error handling and logging
```

### Form Fields

#### Required Fields
- **Name**: User's full name (auto-filled if logged in)
- **Email**: Contact email address (auto-filled if logged in)

#### Optional Fields
- **Phone**: Contact phone number
- **Course Interest**: Dropdown with available courses
- **Message**: Additional details or questions

### Data Flow

```
User Interaction → Form Submission → Google Apps Script → Google Sheets
                                                      ↓
Email Notification ← Confirmation Email ← Email Service
```

## 🎯 User Experience Journey

### 1. Initial Page Load
- Vertical "ENQUIRE NOW" button appears on right edge of screen
- Professional gradient design with phone icon
- Notification badge shows for first-time visitors

### 2. Auto-Popup Trigger (10 seconds)
- Modal overlay appears with enquiry form
- Professional design matching website theme
- Easy-to-close with X button or outside click

### 3. Manual Widget Interaction
- Click vertical "ENQUIRE NOW" button to open compact form
- Slide-out animation from right side
- All same functionality as auto-popup

### 4. Form Submission
- Real-time validation and feedback
- Loading state with spinner animation
- Success confirmation with auto-close
- Email notification to user

### 5. Post-Submission
- Vertical widget remains available for future use
- Session storage prevents auto-popup repeat
- User can still manually open widget by clicking vertical button

## 📧 Email System

### Enquiry Confirmation Email
- **Subject**: "🎯 Your Course Enquiry Received - Learnnect Team"
- **Content**: Professional HTML template with course-specific messaging
- **Branding**: Consistent with Learnnect visual identity
- **Call-to-Action**: Links to course catalog and platform

### Features
- Personalized with user name and course interest
- Responsive email design for all devices
- Professional styling with gradients and colors
- Clear next steps and contact information

## 🔧 Configuration Options

### Widget Customization
```typescript
<EnquiryWidget 
  autoShowDelay={10000}  // 10 seconds default
/>
```

### Available Courses
```typescript
const courseOptions = [
  'Complete Data Science with Lean 6 Sigma',
  'AI & Machine Learning',
  'Generative AI',
  'Data Science with Gen AI',
  'Machine Learning with Gen AI',
  'Python for Data Science',
  'Other'
];
```

## 📊 Analytics & Tracking

### Tracked Events
- Widget button clicks
- Auto-popup displays
- Form submissions
- Email confirmations
- User engagement time

### Data Storage
- **Google Sheets**: ContactForms sheet with enquiry data
- **Session Storage**: Popup display tracking
- **Activity Logs**: User interaction analytics

## 🚀 Deployment & Integration

### Files Modified/Created
1. `src/components/EnquiryWidget.tsx` - Main widget component
2. `src/hooks/usePageTimer.ts` - Time tracking hook
3. `src/App.tsx` - Global widget integration
4. `src/services/googleAppsScriptService.ts` - Enhanced API service
5. `extra_components/.gs Files/GOOGLE_APPS_SCRIPT_LEARNNECT.gs` - Backend processing

### Integration Points
- **App.tsx**: Global widget availability
- **Google Sheets**: Data storage and management
- **Email System**: Automated notifications
- **Analytics**: User behavior tracking

## 🎨 Design Specifications

### Colors
- **Primary**: Neon Cyan (#00ffff)
- **Secondary**: Neon Magenta (#ff00ff)
- **Background**: Dark gradients with transparency
- **Text**: White with cyan/magenta accents

### Animations
- **Popup**: Scale and fade transitions
- **Button**: Hover scale and glow effects
- **Form**: Smooth slide animations
- **Loading**: Professional spinner animations

### Responsive Breakpoints
- **Mobile**: < 768px - Compact form layout
- **Tablet**: 768px - 1024px - Medium form size
- **Desktop**: > 1024px - Full-featured layout

## 🔒 Security & Privacy

### Data Protection
- Form validation and sanitization
- Secure Google Apps Script endpoints
- No sensitive data storage in localStorage
- GDPR-compliant data handling

### Session Management
- sessionStorage for popup tracking
- No persistent user data storage
- Automatic cleanup on session end

## 📈 Performance Optimization

### Efficiency Features
- Lazy loading of form components
- Optimized re-rendering with React hooks
- Minimal DOM manipulation
- Efficient event listeners

### Bundle Size
- Tree-shaking compatible
- Minimal external dependencies
- Optimized icon usage
- Compressed animations

## 🎯 Future Enhancements

### Planned Features
1. **A/B Testing**: Different popup timings and designs
2. **Smart Targeting**: Course-specific popups based on page content
3. **Advanced Analytics**: Conversion tracking and optimization
4. **Multi-language**: Internationalization support
5. **Integration**: CRM and marketing automation connections

### Scalability
- Modular component architecture
- Easy theme customization
- Configurable behavior options
- Plugin-ready structure

## 📞 Support & Maintenance

### Monitoring
- Google Apps Script execution logs
- Email delivery tracking
- Form submission analytics
- Error reporting and handling

### Updates
- Regular security patches
- Feature enhancements
- Performance optimizations
- Design improvements

---

**Implementation Status**: ✅ Complete and Production Ready
**Last Updated**: December 2024
**Version**: 1.0.0
