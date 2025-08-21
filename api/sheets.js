import { google } from 'googleapis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
        
        // Check if we have the service account key in environment variables
        if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
          serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        } else {
          return res.status(500).json({ 
            error: 'Service account configuration not found. Please set GOOGLE_SERVICE_ACCOUNT_KEY environment variable.' 
          });
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
}
