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
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Search,
  SportsTennis,
  Schedule,
  TrendingUp,
  Refresh,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const WomensMatches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config } = useGoogleSheets();

  // Fetch women's matches data
  useEffect(() => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'WomenMatches!A:Z');
    }
  }, [config.spreadsheetId, fetchSheetData]);

  // Get data from sheets or use fallback
  const getMatchData = () => {
    if (sheetsData.values && sheetsData.values.length > 0) {
      return sheetsData.values;
    }
    
    // Fallback data if no Google Sheets data
    return [
      ['Date', 'Player 1', 'Player 2', 'Score', 'Winner', 'Duration', 'Tournament'],
      ['2024-01-16', 'Sarah Johnson', 'Emily Davis', '6-3, 6-4', 'Sarah Johnson', '1h 50m', 'Winter Cup'],
      ['2024-01-21', 'Maria Garcia', 'Lisa Chen', '6-2, 6-1', 'Maria Garcia', '1h 25m', 'Winter Cup'],
      ['2024-01-26', 'Anna Wilson', 'Jessica Brown', '7-5, 6-3', 'Anna Wilson', '2h 05m', 'Winter Cup'],
      ['2024-02-02', 'Emily Davis', 'Rachel Lee', '6-4, 6-2', 'Emily Davis', '1h 40m', 'Spring League'],
      ['2024-02-06', 'Sarah Johnson', 'Michelle Taylor', '6-1, 6-0', 'Sarah Johnson', '1h 15m', 'Spring League'],
      ['2024-02-11', 'Lisa Chen', 'Anna Wilson', '4-6, 6-4, 6-2', 'Anna Wilson', '2h 20m', 'Spring League'],
      ['2024-02-16', 'Jessica Brown', 'Rachel Lee', '6-3, 7-6', 'Jessica Brown', '2h 10m', 'Spring League'],
      ['2024-02-21', 'Maria Garcia', 'Michelle Taylor', '6-4, 6-4', 'Maria Garcia', '1h 55m', 'Spring League']
    ];
  };

  const matchData = getMatchData();
  const headers = matchData[0] || [];
  const dataRows = matchData.slice(1) || [];

  const filteredData = dataRows.filter(row => 
    (row[1] && row[1].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row[2] && row[2].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row[4] && row[4].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMatchStatus = (winner, player1, player2) => {
    if (!winner) return 'Scheduled';
    return 'Completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#e91e63';
      case 'Scheduled':
        return '#9c27b0';
      case 'In Progress':
        return '#ff9800';
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
    if (dataRows.length === 0) return { totalMatches: 0, completedMatches: 0, avgDuration: 0 };
    
    const totalMatches = dataRows.length;
    const completedMatches = dataRows.filter(row => row[4]).length;
    const durations = dataRows
      .filter(row => row[5])
      .map(row => {
        const duration = row[5];
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
          return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
      });
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    
    return { totalMatches, completedMatches, avgDuration };
  };

  const stats = getStats();

  const handleRefresh = () => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'WomenMatches!A:Z');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <SportsTennis sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Women's Tennis Matches
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Match Schedule and Results
        </Typography>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
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
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            color: 'white',
            boxShadow: 3
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.completedMatches}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Completed Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            boxShadow: 3
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {Math.floor(stats.avgDuration / 60)}h {stats.avgDuration % 60}m
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Average Duration
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Matches Table */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
            🎾 Match Results
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Search matches..."
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
              onClick={handleRefresh}
              sx={{ 
                backgroundColor: 'secondary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'secondary.dark' }
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
                background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
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
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  const status = getMatchStatus(row[4], row[1], row[2]);
                  return (
                    <TableRow 
                      key={rowIndex}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#fce4ec',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease-in-out'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {new Date(row[0]).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {row[1]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {row[2]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {row[3]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: status === 'Completed' ? 'success.main' : 'inherit'
                          }}
                        >
                          {row[4] || 'TBD'}
                        </Typography>
                      </TableCell>
                      <TableCell>{row[5]}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row[6]} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#9c27b0',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getStatusColor(status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          Data sourced from Google Sheets • Women's Tennis League Matches
        </Typography>
      </Paper>
    </Box>
  );
};

export default WomensMatches;
