# Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### **1. Code Changes**
- [x] Updated `vercel.json` with proper API route configuration
- [x] Updated `server/server.js` to handle environment variables consistently
- [x] API routes in `api/sheets.js` are properly configured
- [x] Frontend config in `src/config.js` is set for production

### **2. Environment Variables**
- [ ] Set `GOOGLE_SERVICE_ACCOUNT_KEY` in Vercel dashboard
- [ ] Copy entire service account JSON content
- [ ] Enable for both Production and Preview environments

### **3. Google Cloud Setup**
- [ ] Google Sheets API is enabled in your project
- [ ] Service account has proper permissions
- [ ] Google Sheet is shared with service account email

### **4. GitHub Repository**
- [ ] All changes are committed and pushed
- [ ] Repository is connected to Vercel
- [ ] No sensitive files are committed (check `.gitignore`)

## 🚀 **Deployment Steps**

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### **Step 2: Configure Vercel**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `GOOGLE_SERVICE_ACCOUNT_KEY` with your JSON content
5. Save and redeploy

### **Step 3: Test Deployment**
1. Wait for deployment to complete
2. Visit your app URL
3. Go to `/setup` page
4. Test the connection
5. Verify data loads correctly

## 🔍 **Common Issues & Solutions**

### **Build Fails**
- **Issue**: Missing dependencies
- **Solution**: Check `package.json` has all required packages

### **API 500 Errors**
- **Issue**: Environment variable not set
- **Solution**: Verify `GOOGLE_SERVICE_ACCOUNT_KEY` is configured

### **CORS Errors**
- **Issue**: Frontend can't access API
- **Solution**: API routes are properly configured in `vercel.json`

### **403 Access Denied**
- **Issue**: Google Sheet permissions
- **Solution**: Share sheet with service account email

## 📞 **If Deployment Still Fails**

1. **Check Vercel logs** in the deployment dashboard
2. **Look for specific error messages**
3. **Verify environment variables** are set correctly
4. **Test API endpoint** directly: `https://your-app.vercel.app/api/sheets`
5. **Check Google Cloud Console** for API usage errors

## 🎯 **Success Indicators**

- ✅ Build completes without errors
- ✅ App loads at your Vercel URL
- ✅ `/setup` page works
- ✅ Data loads from Google Sheets
- ✅ No console errors in browser
- ✅ API calls return 200 status codes
