# Google Sheets Service Account Setup Guide

## 🔑 **Service Account vs API Key**

**Service Account (Recommended)**
- ✅ More secure and reliable
- ✅ No API key restrictions needed
- ✅ Better for production use
- ✅ Handles authentication automatically

**API Key**
- ⚠️ Requires careful security restrictions
- ⚠️ Can be rate-limited
- ⚠️ Less secure for production

## 🚀 **Step-by-Step Service Account Setup**

### **Step 1: Create Service Account**

1. **Go to Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Select your project** (same one where you enabled Google Sheets API)
3. **Navigate to**: "APIs & Services" > "Credentials"
4. **Click**: "Create Credentials" > "Service Account"
5. **Fill in details**:
   - **Service account name**: `tennis-league-api`
   - **Service account ID**: Auto-generated
   - **Description**: `Service account for Men's Tennis League app`
6. **Click**: "Create and Continue"

### **Step 2: Grant Permissions**

1. **Role**: Select "Editor" (or "Viewer" for read-only access)
2. **Click**: "Continue"
3. **Click**: "Done"

### **Step 3: Create and Download Key**

1. **Click on your service account** (in the credentials list)
2. **Go to**: "Keys" tab
3. **Click**: "Add Key" > "Create new key"
4. **Choose**: "JSON" format
5. **Click**: "Create"
6. **Save the downloaded file** as `service-account-key.json`

### **Step 4: Place Key File**

1. **Move the JSON file** to your project's `server/` folder
2. **Rename it** to `service-account-key.json`
3. **File structure should be**:
   ```
   tennis-app/
   ├── server/
   │   ├── service-account-key.json  ← Place here
   │   ├── server.js
   │   └── package.json
   └── src/
   ```

### **Step 5: Share Your Google Sheet**

1. **Open your Google Sheet**
2. **Click**: "Share" button (top right)
3. **Add your service account email** (found in the JSON file under `client_email`)
4. **Set permission**: "Editor" (or "Viewer" for read-only)
5. **Click**: "Send" (no need to send email)

### **Step 6: Configure Your App**

1. **Start your app**: `npm run dev`
2. **Go to setup**: http://localhost:3000/setup
3. **Toggle**: "Use Service Account (Recommended)"
4. **Enter**: Your Spreadsheet ID
5. **Click**: "Test Connection"

## 📋 **Service Account JSON Structure**

Your `service-account-key.json` file will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "tennis-league-api@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## 🔒 **Security Best Practices**

1. **Never commit** the service account key to version control
2. **Add to .gitignore**:
   ```
   server/service-account-key.json
   ```
3. **Use environment variables** in production
4. **Limit permissions** to only what's needed
5. **Regularly rotate** service account keys

## 🚨 **Troubleshooting**

### **"Service account configuration error"**
- Check that `service-account-key.json` is in the `server/` folder
- Verify the JSON file is valid and complete
- Ensure the file name is exactly `service-account-key.json`

### **"Access denied" error**
- Make sure you shared the Google Sheet with the service account email
- Check that the service account has the correct permissions
- Verify the Google Sheets API is enabled in your project

### **"Spreadsheet not found" error**
- Double-check your Spreadsheet ID
- Ensure the service account has access to the sheet
- Verify the sheet exists and is accessible

## 🎯 **Benefits of Service Account**

- **No API key restrictions** needed
- **More secure** authentication
- **Better rate limits** than API keys
- **Automatic token management**
- **Production-ready** solution

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for errors
2. Verify your Google Cloud Console setup
3. Ensure your Google Sheet permissions are correct
4. Restart your server after placing the service account key
