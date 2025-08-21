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

const MensPlayers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config } = useGoogleSheets();

  // Fetch men's players data
  useEffect(() => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Men!A:Z');
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
        return '#10b981';
      case 'amateur':
        return '#6366f1';
      case 'junior':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      case 'intermediate':
        return '#6366f1';
      case 'beginner':
        return '#f59e0b';
      default:
        return '#6b7280';
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
      fetchSheetData(config.spreadsheetId, 'Men!A:Z');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
          Men's Tennis Players
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Player Profiles and Statistics
        </Typography>
      </Box>

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
            background: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.300',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Person sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                {stats.totalPlayers}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Total Players
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.300',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <SportsTennis sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                {stats.totalMatches}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Total Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.300',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.5)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <TrendingUp sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                {stats.avgWinRate}%
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Average Win Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Player Table */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.300' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Player Profiles
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
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                                   '& fieldset': {
                   borderColor: 'grey.400',
                 },
                 '&:hover fieldset': {
                   borderColor: 'grey.500',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: 'primary.main',
                 },
                }
              }}
            />
                         <IconButton 
               onClick={handleRefresh}
               sx={{ 
                 backgroundColor: 'grey.200',
                 color: 'text.primary',
                 '&:hover': { 
                   backgroundColor: 'grey.300',
                   color: 'primary.main'
                 }
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
                 backgroundColor: 'grey.100',
                 borderBottom: '2px solid',
                 borderColor: 'grey.300'
               }}>
                {headers.map((header, index) => (
                  <TableCell 
                    key={index} 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                         backgroundColor: 'grey.200',
                         transition: 'background-color 0.2s ease'
                       },
                       transition: 'background-color 0.2s ease',
                       borderBottom: '1px solid',
                       borderColor: 'grey.200'
                     }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          {row[0]?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
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
                           backgroundColor: 'grey.200',
                           color: 'text.primary',
                           fontWeight: 500,
                           fontSize: '0.75rem',
                           height: 24
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
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data sourced from Google Sheets • Men's Tennis League Statistics
        </Typography>
      </Box>
    </Box>
  );
};

export default MensPlayers;
