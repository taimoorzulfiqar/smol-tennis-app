# Production Deployment Guide

## Current Issue: "Failed to fetch sheet data" in Production

The app is failing in production because the Google Sheets API configuration isn't properly set up for Vercel's serverless environment.

## Solution Steps:

### 1. Set Up Environment Variables in Vercel

You need to add your Google Service Account credentials to Vercel's environment variables:

1. **Go to your Vercel dashboard**
2. **Select your tennis-app project**
3. **Go to Settings → Environment Variables**
4. **Add the following environment variable:**

```
Name: GOOGLE_SERVICE_ACCOUNT_KEY
Value: [Your entire service account JSON as a single line]
```

**To get the service account JSON:**
- Copy the contents of `server/service-account-key.json`
- Remove all line breaks and spaces to make it a single line
- Paste it as the value

### 2. Alternative: Use API Key Method

If you prefer to use API Key instead of Service Account:

1. **Update `src/config.js`:**
```javascript
const config = {
  apiKey: 'YOUR_ACTUAL_API_KEY_HERE',
  spreadsheetId: '1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU',
  range: 'Men!A:Z',
  useServiceAccount: false, // Change this to false
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? '' 
    : ''
};
```

2. **Get your API Key from Google Cloud Console:**
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create credentials → API Key
   - Replace 'YOUR_ACTUAL_API_KEY_HERE' with your key

### 3. Deploy to Vercel

After setting up environment variables:

```bash
# Deploy to Vercel
vercel --prod
```

### 4. Verify the Fix

1. **Check the API endpoint:** Visit `https://your-app.vercel.app/api/sheets?spreadsheetId=1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU&range=Men!A:Z&useServiceAccount=true`

2. **Should return JSON data** instead of an error

### 5. Troubleshooting

**If still getting errors:**

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Check the logs for `/api/sheets`

2. **Verify Environment Variables:**
   - Make sure `GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly
   - The JSON should be valid and complete

3. **Check Google Sheets Permissions:**
   - Ensure your service account email has access to the spreadsheet
   - The service account email is: `tennis-app@sending-emails-468010.iam.gserviceaccount.com`

## Current Status

✅ **API Endpoint:** `/api/sheets.js` is properly configured for Vercel  
✅ **Dependencies:** `googleapis` package is included  
✅ **CORS:** Properly configured for production  
❌ **Environment Variables:** Need to be set in Vercel dashboard  

## Next Steps

1. Set up environment variables in Vercel
2. Deploy the updated code
3. Test the API endpoint
4. Verify the app works in production

The main issue is that Vercel needs the Google Service Account credentials as environment variables, which aren't currently set up in your production environment.
