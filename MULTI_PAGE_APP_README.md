# Tennis League Management System - Multi-Page App

A comprehensive React-based tennis league management application with separate pages for men's and women's tennis data, featuring modern UI design and Google Sheets integration.

## 🎾 Features

### Navigation
- **Responsive Sidebar Navigation** - Collapsible navigation drawer with mobile support
- **6 Main Pages** - Separate sections for men's and women's tennis data
- **Modern Material-UI Design** - Beautiful, responsive interface with gradient themes

### Pages Overview

#### 1. Men's Players (`/mens-players`)
- **Data Source**: `Men!A:Z` sheet
- **Features**:
  - Player profiles with avatars
  - Match statistics (played, won, lost, games won)
  - Win rate calculations
  - Category classification (Beginner, Intermediate, Advanced)
  - Search functionality
  - Pagination
  - Statistics cards (Total Players, Total Matches, Average Win Rate)

#### 2. Women's Players (`/womens-players`)
- **Data Source**: `Women!A:Z` sheet
- **Features**: Same as Men's Players but with women's data
- **Theme**: Pink/purple gradient theme

#### 3. Men's Matches (`/mens-matches`)
- **Data Source**: `MenMatches!A:Z` sheet
- **Features**:
  - Match schedule and results
  - Player matchups
  - Score display
  - Match duration tracking
  - Tournament information
  - Match status indicators (Completed, Scheduled)
  - Statistics cards (Total Matches, Completed Matches, Average Duration)

#### 4. Women's Matches (`/womens-matches`)
- **Data Source**: `WomenMatches!A:Z` sheet
- **Features**: Same as Men's Matches but with women's data
- **Theme**: Pink/purple gradient theme

#### 5. Men's Leaderboard (`/mens-leaderboard`)
- **Data Source**: `Men!A:Z` sheet (processed for rankings)
- **Features**:
  - Dynamic ranking calculation
  - Points system (wins × 3 + games won × 0.1)
  - Top 3 highlighting with gold/silver/bronze colors
  - Star badges for top performers
  - Win rate calculations
  - Category chips

#### 6. Women's Leaderboard (`/womens-leaderboard`)
- **Data Source**: `Women!A:Z` sheet (processed for rankings)
- **Features**: Same as Men's Leaderboard but with women's data
- **Theme**: Pink/purple gradient theme

## 🗂️ Google Sheets Structure

The app expects the following sheet structure in your Google Sheets:

### Men's Players Sheet (`Men`)
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Name | Matches Played | Matches Won | Matches Lost | Games Won | Category |

### Women's Players Sheet (`Women`)
Same structure as Men's sheet but for women's data.

### Men's Matches Sheet (`MenMatches`)
| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Date | Player 1 | Player 2 | Score | Winner | Duration | Tournament |

### Women's Matches Sheet (`WomenMatches`)
Same structure as Men's Matches but for women's data.

## 🎨 Design Features

### Color Themes
- **Men's Sections**: Green gradient theme (#2e7d32 to #4caf50)
- **Women's Sections**: Pink gradient theme (#e91e63 to #f06292)
- **Responsive Design**: Mobile-first approach with collapsible navigation

### Interactive Elements
- **Hover Effects**: Scale animations on table rows
- **Search Functionality**: Real-time filtering across all pages
- **Refresh Buttons**: Manual data refresh from Google Sheets
- **Loading States**: Circular progress indicators
- **Error Handling**: Alert messages for connection issues

### Statistics Cards
Each page features beautiful gradient cards showing:
- Total Players/Matches
- Win Rates
- Average Durations (for match pages)
- Points (for leaderboard pages)

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Google Sheets API access
- Service account credentials or API key

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Google Sheets access in `src/config.js`
4. Start the development server: `npm start`

### Google Sheets Setup
1. Create a Google Sheet with the required structure
2. Share the sheet with your service account email (if using service account)
3. Update the `spreadsheetId` in `src/config.js`
4. Ensure your sheet has the required tabs: `Men`, `Women`, `MenMatches`, `WomenMatches`

## 📱 Responsive Design

The app is fully responsive with:
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with overlay navigation
- **Touch-friendly**: Large touch targets and smooth animations

## 🔧 Configuration

### Environment Variables
- `GOOGLE_SERVICE_ACCOUNT_*`: Service account credentials (for production)
- `PORT`: Server port (default: 3001)

### Customization
- **Colors**: Modify theme colors in `src/App.js`
- **Data Structure**: Update sheet ranges in individual components
- **Scoring System**: Modify ranking calculations in leaderboard components

## 📊 Data Flow

1. **Google Sheets** → **Server API** → **React Context** → **Components**
2. **Real-time Updates**: Manual refresh buttons on each page
3. **Fallback Data**: Sample data when Google Sheets is unavailable
4. **Error Handling**: Graceful degradation with user-friendly messages

## 🎯 Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filtering**: Date ranges, categories, tournaments
- **Export Features**: PDF reports, CSV downloads
- **User Authentication**: Admin vs viewer roles
- **Match Scheduling**: Calendar integration
- **Player Profiles**: Detailed player pages with history

## 🛠️ Technical Stack

- **Frontend**: React 18, Material-UI 5
- **Backend**: Node.js, Express
- **Data**: Google Sheets API
- **Authentication**: Service Account or API Key
- **Styling**: Material-UI with custom themes
- **State Management**: React Context API

## 📝 License

This project is licensed under the MIT License.
