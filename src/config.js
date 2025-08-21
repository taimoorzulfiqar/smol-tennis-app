// Google Sheets Configuration
// This file contains the actual configuration for the tennis app
// 
// TO CONFIGURE (Service Account Method - Recommended):
// 1. Create a service account in Google Cloud Console
// 2. Add your service account credentials to server/.env file (already done)
// 3. Share your Google Sheet with the service account email
// 4. The spreadsheet ID is already set to your Expert Tennis League sheet
// 5. The app will read from different sheets:
//    - Men!A:Z for men's players data
//    - Women!A:Z for women's players data  
//    - Mens Matches!A:Z for men's matches data
//    - Womens Matches!A:Z for women's matches data
//    - Mens Leaderboard!A:Z for men's leaderboard data
//    - Womens Leaderboard!A:Z for women's leaderboard data
//
// ALTERNATIVE (API Key Method):
// 1. Set useServiceAccount to false
// 2. Replace 'YOUR_API_KEY_HERE' with your actual Google Sheets API key

const config = {
  // Your Google Sheets API Key (only needed if useServiceAccount is false)
  apiKey: 'AIzaSyDIyMoMHbTaalqtKhys7LucrMnz5yVbQgM',
  
  // Your Google Sheet ID (found in the URL)
  spreadsheetId: '1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU',
  
  // Sheet ranges for different sections:
  // - Men's Players: 'Men!A:Z'
  // - Women's Players: 'Women!A:Z'
  // - Men's Matches: 'Mens Matches!A:Z'
  // - Women's Matches: 'Womens Matches!A:Z'
  // - Men's Leaderboard: 'Mens Leaderboard!A:Z'
  // - Women's Leaderboard: 'Womens Leaderboard!A:Z'
  // The default range is for men's players (legacy compatibility)
  range: 'Men!A:Z',
  
  // Set to true to use Service Account (recommended), false to use API Key
  useServiceAccount: false,
  
  // API Base URL - handles both development and production
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? '' // Empty string for Vercel (uses same domain)
    : '' // Empty string for development (uses proxy)
};

export default config;
