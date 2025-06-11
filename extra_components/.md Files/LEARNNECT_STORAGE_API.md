# Learnnect Storage API Specification

## Overview
This API handles resume storage using Learnnect's Google Drive service account. All resumes are stored in Learnnect's Google Drive, organized by user folders.

## Authentication
- Uses Learnnect's Google Drive service account
- No user authentication required for Google Drive
- Server-side only implementation

## Endpoints

### 1. Upload Resume
**POST** `/api/storage/upload-resume`

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Resume file (PDF, DOC, DOCX)
  - `userId`: User's unique ID
  - `fullName`: User's full name
  - `fileName`: Generated filename with timestamp

**Response:**
```json
{
  "success": true,
  "fileId": "google_drive_file_id",
  "downloadURL": "https://drive.google.com/file/d/FILE_ID/view",
  "fileName": "Resume_2024-01-15T10-30-00.pdf",
  "folderPath": "Learnnect_John_Doe_a1b2c3d4"
}
```

### 2. Get User Resumes
**GET** `/api/storage/user-resumes?userId={userId}&fullName={fullName}`

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "google_drive_file_id",
      "name": "Resume_2024-01-15T10-30-00.pdf",
      "size": 1024000,
      "mimeType": "application/pdf",
      "createdTime": "2024-01-15T10:30:00.000Z",
      "downloadURL": "https://drive.google.com/file/d/FILE_ID/view"
    }
  ]
}
```

### 3. Delete Resume
**DELETE** `/api/storage/delete-resume`

**Request:**
```json
{
  "fileId": "google_drive_file_id",
  "userId": "user_id_for_verification"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

### 4. Get Download URL
**GET** `/api/storage/download-url?fileId={fileId}&userId={userId}`

**Response:**
```json
{
  "success": true,
  "downloadURL": "https://drive.google.com/file/d/FILE_ID/view"
}
```

### 5. Health Check
**GET** `/api/storage/health`

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "message": "Learnnect storage is operational"
}
```

## Folder Structure
```
Learnnect Google Drive/
├── Learnnect_John_Doe_a1b2c3d4/
│   ├── Resume_2024-01-15T10-30-00.pdf
│   ├── Resume_2024-01-20T14-45-00.docx
│   └── Resume_2024-01-25T09-15-00.pdf
├── Learnnect_Jane_Smith_b2c3d4e5/
│   ├── Resume_2024-01-16T11-20-00.pdf
│   └── Resume_2024-01-22T16-30-00.docx
└── ...
```

## Implementation Requirements

### Backend Setup (Python/Node.js)
1. **Google Service Account:**
   - Create service account in Google Cloud Console
   - Download service account key JSON
   - Enable Google Drive API

2. **Environment Variables:**
   ```bash
   GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
   GOOGLE_DRIVE_FOLDER_ID=learnnect_main_folder_id
   ```

3. **Dependencies:**
   - Python: `google-api-python-client`, `google-auth`
   - Node.js: `googleapis`, `google-auth-library`

### Security Considerations
- Service account has limited scope (only Learnnect's Drive)
- File permissions set to organization-only access
- User verification for all operations
- Rate limiting on upload endpoints
- File type validation (PDF, DOC, DOCX only)
- File size limits (10MB max)

## Error Handling
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Error Codes:**
- `INVALID_FILE_TYPE`: Unsupported file format
- `FILE_TOO_LARGE`: File exceeds size limit
- `STORAGE_FULL`: Storage quota exceeded
- `UPLOAD_FAILED`: Google Drive upload failed
- `USER_NOT_FOUND`: Invalid user ID
- `FILE_NOT_FOUND`: Resume file not found
- `PERMISSION_DENIED`: User not authorized for file

## Testing
1. **Unit Tests:** Test each endpoint individually
2. **Integration Tests:** Test full upload/download flow
3. **Load Tests:** Test concurrent uploads
4. **Security Tests:** Test unauthorized access attempts

## Deployment
1. Deploy backend API with service account credentials
2. Update frontend environment variables
3. Test connection with health check endpoint
4. Monitor storage usage and performance
