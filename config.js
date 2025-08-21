// Google Sheets Configuration
// This file contains the actual configuration for the tennis app
// 
// TO CONFIGURE (Service Account Method - Recommended):
// 1. Create a service account in Google Cloud Console
// 2. Add your service account credentials to server/.env file (already done)
// 3. Share your Google Sheet with the service account email
// 4. The spreadsheet ID is already set to your Expert Tennis League sheet
// 5. The range is set to 'Men!A:F' to read the Men's sheet with columns A-F
//
// ALTERNATIVE (API Key Method):
// 1. Set useServiceAccount to false
// 2. Replace 'YOUR_API_KEY_HERE' with your actual Google Sheets API key

const config = {
  // Your Google Sheets API Key (only needed if useServiceAccount is false)
  apiKey: 'YOUR_API_KEY_HERE',
  
  // Your Google Sheet ID (found in the URL)
  spreadsheetId: '1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU',
  
  // Sheet range (don't change this unless your data structure is different)
  range: 'Men!A:F',
  
  // Set to true to use Service Account (recommended), false to use API Key
  useServiceAccount: true
};

export default config;
