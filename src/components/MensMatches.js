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

const MensMatches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config } = useGoogleSheets();

  // Fetch men's matches data
  useEffect(() => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'MenMatches!A:Z');
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
      ['2024-01-15', 'Taimoor Zulfiqar', 'Ahmed', '6-4, 6-2', 'Taimoor Zulfiqar', '1h 45m', 'Winter Cup'],
      ['2024-01-20', 'Farhan', 'Bilal', '4-6, 6-4, 7-5', 'Bilal', '2h 15m', 'Winter Cup'],
      ['2024-01-25', 'Umer', 'Hassan', '6-1, 6-0', 'Hassan', '1h 20m', 'Winter Cup'],
      ['2024-02-01', 'Ahmed', 'Usman', '6-3, 6-4', 'Ahmed', '1h 55m', 'Spring League'],
      ['2024-02-05', 'Taimoor Zulfiqar', 'Bilal', '7-5, 6-3', 'Taimoor Zulfiqar', '2h 10m', 'Spring League'],
      ['2024-02-10', 'Farhan', 'Umer', '6-2, 6-2', 'Farhan', '1h 30m', 'Spring League'],
      ['2024-02-15', 'Hassan', 'Usman', '6-4, 7-6', 'Hassan', '2h 05m', 'Spring League'],
      ['2024-02-20', 'Ahmed', 'Bilal', '5-7, 6-4, 6-2', 'Ahmed', '2h 35m', 'Spring League']
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
        return '#2e7d32';
      case 'Scheduled':
        return '#1976d2';
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
      fetchSheetData(config.spreadsheetId, 'MenMatches!A:Z');
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
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <SportsTennis sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Men's Tennis Matches
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
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
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
            background: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 100%)',
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
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
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
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
                          backgroundColor: '#f0f8f0',
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
                            backgroundColor: '#1976d2',
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
          Data sourced from Google Sheets • Men's Tennis League Matches
        </Typography>
      </Paper>
    </Box>
  );
};

export default MensMatches;
