// Google Sheets API Service for storing user data
// This service will store user authentication data in a Google Sheets database

export interface UserSheetData {
  platform: 'Google' | 'GitHub' | 'LinkedIn' | 'Form';
  userName: string;
  userEmail: string;
  mobile?: string;
  userId: string;
  createdAt: string;
  lastLogin: string;
  profilePicture?: string;
  githubUsername?: string;
}

class GoogleSheetsService {
  private readonly SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;
  private readonly API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
  private readonly SHEET_NAME = 'UserData'; // Name of the sheet tab

  constructor() {
    if (!this.SHEET_ID || !this.API_KEY) {
      console.warn('⚠️ Google Sheets credentials not configured. User data will not be synced to sheets.');
    }
  }

  /**
   * Check if Google Sheets is configured
   */
  isConfigured(): boolean {
    return !!(this.SHEET_ID && this.API_KEY);
  }

  /**
   * Add user data to Google Sheets
   */
  async addUserToSheet(userData: UserSheetData): Promise<void> {
    if (!this.isConfigured()) {
      console.log('📊 Google Sheets not configured, skipping sheet update');
      return;
    }

    try {
      console.log('📊 Adding user to Google Sheets:', userData.userEmail);

      // Prepare the row data in the order of columns
      const rowData = [
        userData.platform,
        userData.userName,
        userData.userEmail,
        userData.mobile || '',
        userData.userId,
        userData.createdAt,
        userData.lastLogin,
        userData.profilePicture || '',
        userData.githubUsername || ''
      ];

      // Google Sheets API endpoint for appending data
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}:append?valueInputOption=RAW&key=${this.API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Sheets API error: ${errorData.error?.message || response.statusText}`);
      }

      console.log('✅ User data added to Google Sheets successfully');
    } catch (error) {
      console.error('❌ Failed to add user to Google Sheets:', error);
      // Don't throw error - we don't want to break user registration if sheets fail
    }
  }

  /**
   * Update user's last login time in Google Sheets
   */
  async updateUserLastLogin(userEmail: string, lastLogin: string): Promise<void> {
    if (!this.isConfigured()) {
      return;
    }

    try {
      console.log('📊 Updating last login in Google Sheets for:', userEmail);

      // First, find the user's row
      const findUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}?key=${this.API_KEY}`;
      
      const findResponse = await fetch(findUrl);
      if (!findResponse.ok) {
        throw new Error('Failed to read sheet data');
      }

      const sheetData = await findResponse.json();
      const rows = sheetData.values || [];

      // Find the row with matching email (column C, index 2)
      let rowIndex = -1;
      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        if (rows[i][2] === userEmail) { // Email is in column C (index 2)
          rowIndex = i + 1; // Google Sheets uses 1-based indexing
          break;
        }
      }

      if (rowIndex === -1) {
        console.log('📊 User not found in sheet, skipping last login update');
        return;
      }

      // Update the last login column (column G, index 6)
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!G${rowIndex}?valueInputOption=RAW&key=${this.API_KEY}`;

      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[lastLogin]]
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update last login');
      }

      console.log('✅ Last login updated in Google Sheets');
    } catch (error) {
      console.error('❌ Failed to update last login in Google Sheets:', error);
    }
  }

  /**
   * Initialize the Google Sheet with headers (call this once to set up the sheet)
   */
  async initializeSheet(): Promise<void> {
    if (!this.isConfigured()) {
      console.log('📊 Google Sheets not configured, cannot initialize');
      return;
    }

    try {
      const headers = [
        'Platform Name',
        'User Name', 
        'User Email',
        'Mobile',
        'User ID',
        'Created At',
        'Last Login',
        'Profile Picture',
        'GitHub Username'
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!A1:I1?valueInputOption=RAW&key=${this.API_KEY}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize sheet headers');
      }

      console.log('✅ Google Sheet initialized with headers');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheet:', error);
    }
  }

  /**
   * Check if user exists in the sheet
   */
  async checkUserExists(userEmail: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}?key=${this.API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        return false;
      }

      const sheetData = await response.json();
      const rows = sheetData.values || [];

      // Check if email exists in column C (index 2)
      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        if (rows[i][2] === userEmail) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Failed to check user existence in Google Sheets:', error);
      return false;
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
