# Vercel Deployment Guide

## 🚀 **Deploy to Vercel**

### **Step 1: Connect to Vercel**

1. **Go to [Vercel](https://vercel.com)** and sign in with your GitHub account
2. **Click "New Project"**
3. **Import your repository**: `taimoorzulfiqar/smol-tennis-app`
4. **Select the repository** and click "Deploy"

### **Step 2: Configure Environment Variables**

In your Vercel project settings, add this environment variable:

#### **Service Account Key (Required)**
```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"sending-emails-468010",...}
```

**How to set this:**
1. Copy the entire content of your `server/service-account-key.json` file
2. In Vercel Dashboard → Settings → Environment Variables
3. Add variable: `GOOGLE_SERVICE_ACCOUNT_KEY`
4. Value: Paste the entire JSON content
5. Select "Production" and "Preview" environments
6. Click "Save"

### **Step 3: Deploy**

1. **Push your changes** to GitHub
2. **Vercel will automatically deploy** your app using the updated configuration
3. **Your app will be available** at: `https://your-app-name.vercel.app`

## 🔧 **Post-Deployment Setup**

### **1. Configure Your App**
1. **Visit your deployed app**
2. **Go to**: `/setup`
3. **Toggle**: "Use Service Account (Recommended)"
4. **Enter**: Your Spreadsheet ID
5. **Click**: "Test Connection"

### **2. Share Your Google Sheet**
1. **Open your Google Sheet**
2. **Click "Share"**
3. **Add**: `tennis-app@sending-emails-468010.iam.gserviceaccount.com`
4. **Set permission**: "Editor" (or "Viewer")
5. **Click "Send"**

## 🎯 **What's Fixed**

- ✅ **Proper API routing** - API calls now go to `/api/sheets`
- ✅ **Environment variables** - Consistent service account configuration
- ✅ **Build configuration** - Both frontend and API routes properly configured
- ✅ **CORS handling** - API routes handle cross-origin requests

## 🔒 **Security Notes**

- **Never commit** service account keys to Git
- **Use environment variables** in Vercel
- **Keep your Google Sheet** permissions minimal
- **Monitor your API usage** in Google Cloud Console

## 🚨 **Troubleshooting**

### **"Service account configuration error"**
- Check environment variable is set correctly in Vercel
- Verify the JSON is valid and complete
- Ensure the variable is available in Production environment

### **"Access denied" error**
- Make sure you shared the Google Sheet with the service account email
- Check that the service account has the correct permissions
- Verify Google Sheets API is enabled in your project

### **Build errors**
- Check that all dependencies are in `package.json`
- Ensure the build script is correct
- Verify the Vercel configuration is valid

### **API not found errors**
- Ensure your API calls go to `/api/sheets` (not `/api/sheets`)
- Check that the API route is properly deployed in Vercel
- Verify the route configuration in `vercel.json`

## 📞 **Need Help?**

1. **Check Vercel logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Test locally** first with `npm run dev`
4. **Check Google Cloud Console** for API usage and errors
5. **Review deployment logs** in Vercel dashboard for specific error messages
