# Learnnect Storage Service Troubleshooting

## Current Issue: Invalid JWT Signature

The storage service is failing with "Invalid JWT Signature" error. This is a common Google Service Account authentication issue.

## Quick Fix Steps

### 1. Run Diagnostic Scripts

```bash
# Check and fix service account formatting
cd backend
python fix_service_account.py

# Test Google Drive connection
python test_drive_connection.py
```

### 2. Common Solutions

#### A. Fix Private Key Formatting
The most common cause is improper private key formatting in the JSON:

```bash
# If your service account JSON has literal \n instead of actual newlines:
# Wrong: "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."
# Right: "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

#### B. Regenerate Service Account Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to IAM & Admin > Service Accounts
3. Find your service account: `learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com`
4. Click on it, go to "Keys" tab
5. Delete old key and create new JSON key
6. Update your `GOOGLE_SERVICE_ACCOUNT_JSON` environment variable

#### C. Check System Time
JWT signatures are time-sensitive:
```bash
# On Linux/Mac
sudo ntpdate -s time.nist.gov

# On Windows
w32tm /resync
```

### 3. Environment Variable Setup

Make sure your environment variable is properly set:

```bash
# For development (.env file)
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"learnnect-gdrive",...}'

# For production (Render)
# Set in Render dashboard under Environment Variables
```

### 4. Verify Service Account Permissions

Your service account needs:
1. **Google Drive API** enabled
2. **Editor** access to the Learnnect Drive folder
3. **Service Account Token Creator** role (if needed)

## Error Types and Solutions

### "Invalid JWT Signature"
- **Cause**: Malformed private key, system time sync, expired key
- **Solution**: Fix private key formatting, sync time, regenerate key

### "invalid_grant"
- **Cause**: Service account permissions, API not enabled
- **Solution**: Check Google Cloud Console settings

### "forbidden" / "Permission denied"
- **Cause**: Service account lacks Drive API access
- **Solution**: Enable Google Drive API, grant folder access

### "quota exceeded"
- **Cause**: Google Drive API quota limits
- **Solution**: Check quota usage in Google Cloud Console

## Manual Testing

### Test with curl:
```bash
# Check health endpoint
curl https://learnnect-backend.onrender.com/api/storage/health

# Expected response:
{
  "success": true,
  "status": "connected",
  "message": "Learnnect storage is operational",
  "service_account": "learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com",
  "folder_id": "1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd"
}
```

### Test file upload:
```bash
curl -X POST https://learnnect-backend.onrender.com/api/storage/upload-resume \
  -F "file=@test.pdf" \
  -F "userId=test123" \
  -F "userEmail=test@example.com" \
  -F "fileName=test_resume.pdf"
```

## Service Account Details

- **Email**: `learnnect-platform-gdrive@learnnect-gdrive.iam.gserviceaccount.com`
- **Project**: `learnnect-gdrive`
- **Folder ID**: `1w-7EywK43Pn1GkwRqzScE1qbnh8GUwdd`

## Next Steps

1. **Immediate**: Run `python fix_service_account.py` to diagnose the issue
2. **If that fails**: Regenerate the service account key
3. **If still failing**: Check Google Cloud Console for API settings
4. **Last resort**: Create a new service account with proper permissions

## Contact

If you continue having issues:
1. Check the diagnostic script outputs
2. Verify all environment variables are set correctly
3. Ensure the service account has proper permissions
4. Consider regenerating the service account key

The storage service should work once the JWT signature issue is resolved.
