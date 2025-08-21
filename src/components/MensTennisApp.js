import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import {
  Search,
  SportsTennis,
  TrendingUp,
  EmojiEvents,
  Person,
  Category,
  Refresh,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const MensTennisApp = () => {
  const { sheetsData, isLoading, error, fetchSheetData } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Auto-fetch data when component mounts
    if (sheetsData.values && sheetsData.values.length === 0) {
      fetchSheetData();
    }
  }, [fetchSheetData, sheetsData.values]);

  const getPlayerData = () => {
    // If we have real data from Google Sheets, use it
    if (sheetsData.values && sheetsData.values.length >= 2) {
      return sheetsData.values;
    }
    
    // Fallback sample data for demonstration
    return [
      ['Name', 'Matches Played', 'Matches Won', 'Matches Lost', 'Games Won', 'Category'],
      ['Taimoor Zulfiqar', '2', '2', '0', '12', 'Intermediate'],
      ['Farhan', '1', '0', '1', '4', 'Beginner'],
      ['Umer', '1', '0', '1', '5', 'Intermediate'],
      ['Murtaza', '0', '0', '0', '0', 'Beginner'],
      ['Ahmed', '3', '2', '1', '15', 'Advanced'],
      ['Bilal', '2', '1', '1', '8', 'Intermediate'],
      ['Hassan', '1', '1', '0', '6', 'Beginner'],
      ['Usman', '2', '0', '2', '3', 'Beginner']
    ];
  };

  const playerData = getPlayerData();
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (playerData) {
      const interval = setInterval(() => {
        fetchSheetData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [fetchSheetData, playerData]);
  
  // Add debugging information
  console.log('App Debug Info:', {
    sheetsData,
    isLoading,
    error,
    playerData: playerData ? playerData.length : 'null'
  });
  
  // Show error or loading state if no data is available
  if (!playerData) {
    return (
      <Box>
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <SportsTennis sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Men's Tennis League
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Player Profiles and Statistics
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connection Error
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please check your service account configuration in Vercel environment variables.
            </Typography>
          </Alert>
        )}

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {isLoading ? 'Loading Data...' : 'No Data Available'}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isLoading 
              ? 'Connecting to your Google Sheets...' 
              : 'Unable to load data from Google Sheets. Please check your configuration.'
            }
          </Typography>
          {!isLoading && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current Spreadsheet ID: {sheetsData.spreadsheetId || 'Not configured'}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => fetchSheetData()}
                startIcon={<Refresh />}
                sx={{ mt: 2 }}
              >
                Retry Connection
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    );
  }

  const headers = playerData[0];
  const dataRows = playerData.slice(1);

  const filteredData = dataRows.filter(row => 
    row[0] && row[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWinRate = (won, lost) => {
    const total = parseInt(won) + parseInt(lost);
    if (total === 0) return '0%';
    return `${Math.round((parseInt(won) / total) * 100)}%`;
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'professional':
        return '#2e7d32';
      case 'amateur':
        return '#1976d2';
      case 'junior':
        return '#ff6f00';
      default:
        return '#757575';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStats = () => {
    if (dataRows.length === 0) return { totalPlayers: 0, totalMatches: 0, avgWinRate: 0 };
    
    const totalPlayers = dataRows.length;
    const totalMatches = dataRows.reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
    const totalWins = dataRows.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
    const totalLosses = dataRows.reduce((sum, row) => sum + (parseInt(row[3]) || 0), 0);
    const avgWinRate = totalMatches > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
    
    return { totalPlayers, totalMatches, avgWinRate };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <SportsTennis sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Men's Tennis League
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Player Profiles and Statistics
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            boxShadow: 3
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalPlayers}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Players
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 100%)',
            color: 'white',
            boxShadow: 3
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SportsTennis sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalMatches}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: 'white',
            boxShadow: 3
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.avgWinRate}%
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Average Win Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Player Table */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            🎾 Player Profiles
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <IconButton 
              onClick={() => fetchSheetData()}
              disabled={isLoading}
              color="primary"
              title="Refresh data from Google Sheets"
              sx={{ 
                backgroundColor: '#2e7d32',
                color: 'white',
                '&:hover': { backgroundColor: '#1b5e20' }
              }}
            >
              <Refresh />
            </IconButton>
          </Box>
        </Box>
        
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                color: 'white'
              }}>
                {headers.map((header, index) => (
                  <TableCell 
                    key={index} 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '1.1rem'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Win Rate
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#f0f8f0',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ 
                          bgcolor: '#2e7d32',
                          width: 45,
                          height: 45,
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}>
                          {row[0]?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                          {row[0]}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row[1]}</TableCell>
                    <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      {row[2]}
                    </TableCell>
                    <TableCell sx={{ color: 'error.main' }}>
                      {row[3]}
                    </TableCell>
                    <TableCell>{row[4]}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row[5]} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getCategoryColor(row[5]),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: getWinRate(row[2], row[3]) >= '70%' ? 'success.main' : 'inherit'
                        }}
                      >
                        {getWinRate(row[2], row[3])}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Footer */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data sourced from Google Sheets • Men's Tennis League Statistics
        </Typography>
      </Paper>
    </Box>
  );
};

export default MensTennisApp;
