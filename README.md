# Men's Tennis League - Player Profiles

A focused tennis application that displays Men's Tennis League player profiles and statistics from Google Sheets. The app shows player information including matches played, wins, losses, games won, and categories.

<!-- Production deployment ready with Vercel serverless functions -->

## Features

- 👥 **Player Profiles**: Display Men's Tennis League player information
- 📊 **Statistics Dashboard**: Overview cards showing total players, matches, and win rates
- 🔍 **Search Functionality**: Search and filter players by name
- 📋 **Data Table**: Organized table with player avatars, match statistics, and categories
- 🎨 **Tennis-Themed UI**: Beautiful Material-UI interface with tennis-specific styling
- 🔗 **Google Sheets Integration**: Connect to your Google Sheet with Men's player data
- ⚙️ **Easy Setup**: Simple configuration wizard for Google Sheets connection
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

Before running this application, you need:

1. **Google Cloud Console Account**: To get a Google Sheets API key
2. **Google Sheet**: A spreadsheet with data you want to display
3. **Node.js**: Version 14 or higher

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Choose Authentication Method

#### **Option A: Service Account (Recommended)**

1. **Go to Google Cloud Console**: Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Create a new project** or select an existing one
3. **Enable billing** (required, but Google Sheets API has a generous free tier)
4. **Enable the Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
5. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name: `tennis-league-api`
   - Role: "Editor" (or "Viewer" for read-only)
6. **Download Service Account Key**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Save as `service-account-key.json` in the `server/` folder
7. **Share your Google Sheet** with the service account email (found in the JSON file)

**📖 Detailed Service Account Setup**: See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)

#### **Option B: API Key (Alternative)**

1. **Follow steps 1-4 above**
2. **Create API credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
3. **Secure your API key** (Important!):
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add `http://localhost:3000/*` for development
   - Under "API restrictions", select "Restrict key" and choose "Google Sheets API"
   - Click "Save"

### 3. Prepare Your Google Sheet

1. Create or open a Google Sheet
2. Create a sheet named "Men" with the following columns:
   - Name
   - Matches Played
   - Matches Won
   - Matches Lost
   - Games Won
   - Category
3. Make sure it's publicly accessible or shared with appropriate permissions
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU/edit?gid=0#gid=0
   ```

### 4. Start the Application

```bash
# Start the backend server (in one terminal)
cd server
npm start

# Start the frontend (in another terminal)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 5. Configure the App

1. **Open the app**: http://localhost:3000 in your browser
2. **Setup Google Sheets**: 
   - If no data is loaded, click "Setup Google Sheets" 
   - Or go directly to http://localhost:3000/setup
3. **Choose authentication**:
   - **Service Account**: Toggle "Use Service Account (Recommended)"
   - **API Key**: Leave toggle off and enter your API key
4. **Enter your credentials**:
   - Spreadsheet ID (from Step 3)
   - API Key (only if not using service account)
5. **Test connection**: Click "Test Connection" to verify your setup
6. **Auto-refresh**: Your data will automatically refresh every 30 seconds
7. **Manual refresh**: Use the refresh button (🔄) to update data immediately

## Usage

### Main Features

- **📊 Statistics Overview**: View total players, matches, and average win rates at the top
- **🔍 Player Search**: Use the search box to filter players by name
- **📋 Player Table**: Browse all players with their match statistics and categories
- **🎨 Visual Elements**: Player avatars, color-coded categories, and win rate highlighting
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Configuration

- **API Key**: Your Google Sheets API key from Google Cloud Console
- **Spreadsheet ID**: The ID from your Google Sheet URL
- **Range**: Optional range specification (default: A:Z for all columns)

## Project Structure

```
tennis-app/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.js    # Main dashboard
│   │   └── SheetsConfig.js # Configuration wizard
│   ├── context/            # React context
│   │   └── GoogleSheetsContext.js
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
├── server/                 # Backend server
│   ├── server.js           # Express server
│   └── package.json        # Server dependencies
└── package.json            # Frontend dependencies
```

## API Endpoints

### Backend Server (Port 3001)

- `GET /api/sheets` - Fetch data from Google Sheets
  - Query parameters: `spreadsheetId`, `range`, `apiKey`
- `GET /api/health` - Health check endpoint

## Troubleshooting

### Common Issues

1. **"Access denied" error**:
   - Check your API key is correct
   - Ensure your Google Sheet is publicly accessible
   - Verify Google Sheets API is enabled in your project

2. **"Spreadsheet not found" error**:
   - Double-check the Spreadsheet ID
   - Make sure the sheet exists and you have access

3. **CORS errors**:
   - Ensure the backend server is running on port 3001
   - Check that the proxy is configured in package.json

4. **No data displayed**:
   - Verify your sheet has data in the specified range
   - Check the range parameter (default: A:Z)

### Security Notes

- Keep your API key secure and don't commit it to version control
- Consider using environment variables for production
- The API key is stored in localStorage for convenience (not recommended for production)

## Technologies Used

- **Frontend**: React, Material-UI, Recharts, Axios
- **Backend**: Node.js, Express, Google APIs
- **Charts**: Recharts library
- **Styling**: Material-UI with custom theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
