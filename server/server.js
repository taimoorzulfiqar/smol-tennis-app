const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets API endpoint
app.get('/api/sheets', async (req, res) => {
  try {
    const { spreadsheetId, range = 'A:Z', apiKey, useServiceAccount } = req.query;

    if (!spreadsheetId) {
      return res.status(400).json({ 
        error: 'Spreadsheet ID is required' 
      });
    }

    let auth;
    let sheets;

    if (useServiceAccount === 'true') {
      // Use Service Account authentication
      try {
        let serviceAccount;
        
        // Check if running on Vercel (environment variable) or local (file)
        if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
          serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        } else {
          const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
          serviceAccount = require(serviceAccountPath);
        }
        
        auth = new google.auth.GoogleAuth({
          credentials: serviceAccount,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        sheets = google.sheets({ 
          version: 'v4', 
          auth 
        });
      } catch (serviceAccountError) {
        console.error('Service account error:', serviceAccountError);
        return res.status(500).json({ 
          error: 'Service account configuration error. Please check your service account configuration.' 
        });
      }
    } else {
      // Use API Key authentication
      if (!apiKey) {
        return res.status(400).json({ 
          error: 'API Key is required when not using service account' 
        });
      }

      sheets = google.sheets({ 
        version: 'v4', 
        auth: apiKey 
      });
    }

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const { values } = response.data;

    if (!values || values.length === 0) {
      return res.json({ 
        message: 'No data found in the specified range',
        values: [] 
      });
    }

    res.json({
      values,
      range: response.data.range,
      majorDimension: response.data.majorDimension,
    });

  } catch (error) {
    console.error('Error fetching sheet data:', error);
    
    if (error.code === 403) {
      return res.status(403).json({ 
        error: 'Access denied. Please check your authentication and sheet permissions.' 
      });
    }
    
    if (error.code === 404) {
      return res.status(404).json({ 
        error: 'Spreadsheet not found. Please check the spreadsheet ID.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch sheet data',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
