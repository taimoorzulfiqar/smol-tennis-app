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
  IconButton,
} from '@mui/material';
import {
  Search,
  SportsTennis,
  TrendingUp,
  Person,
  Refresh,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const WomensPlayers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config } = useGoogleSheets();

  // Fetch women's players data
  useEffect(() => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Women!A:Z');
    }
  }, [config.spreadsheetId, fetchSheetData]);

  // Get data from sheets or use fallback
  const getPlayerData = () => {
    if (sheetsData.values && sheetsData.values.length > 0) {
      return sheetsData.values;
    }
    
    // Fallback data if no Google Sheets data
    return [
      ['Name', 'Matches Played', 'Matches Won', 'Matches Lost', 'Games Won', 'Category'],
      ['Sarah Johnson', '3', '2', '1', '18', 'Advanced'],
      ['Emily Davis', '2', '1', '1', '12', 'Intermediate'],
      ['Maria Garcia', '1', '1', '0', '8', 'Beginner'],
      ['Lisa Chen', '2', '0', '2', '6', 'Intermediate'],
      ['Anna Wilson', '1', '1', '0', '10', 'Advanced'],
      ['Jessica Brown', '2', '2', '0', '15', 'Intermediate'],
      ['Rachel Lee', '1', '0', '1', '4', 'Beginner'],
      ['Michelle Taylor', '3', '1', '2', '11', 'Intermediate']
    ];
  };

  const playerData = getPlayerData();
  const headers = playerData[0] || [];
  const dataRows = playerData.slice(1) || [];

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
        return '#e91e63';
      case 'amateur':
        return '#9c27b0';
      case 'junior':
        return '#ff9800';
      case 'advanced':
        return '#f44336';
      case 'intermediate':
        return '#9c27b0';
      case 'beginner':
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
    if (dataRows.length === 0) return { totalPlayers: 0, totalMatches: 0, avgWinRate: 0 };
    
    const totalPlayers = dataRows.length;
    const totalMatches = dataRows.reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
    const totalWins = dataRows.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
    const totalLosses = dataRows.reduce((sum, row) => sum + (parseInt(row[3]) || 0), 0);
    const avgWinRate = totalMatches > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;
    
    return { totalPlayers, totalMatches, avgWinRate };
  };

  const stats = getStats();

  const handleRefresh = () => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Women!A:Z');
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
          Women's Tennis Players
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Player Profiles and Statistics
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
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
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
                        backgroundColor: '#fce4ec',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ 
                          bgcolor: '#e91e63',
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
          Data sourced from Google Sheets • Women's Tennis League Statistics
        </Typography>
      </Paper>
    </Box>
  );
};

export default WomensPlayers;
