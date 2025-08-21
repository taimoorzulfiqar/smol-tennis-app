import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  TrendingUp,
  Refresh,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import LoadingSpinner from './LoadingSpinner';

const MensPlayers = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config, getDataForRange, clearDataForRange } = useGoogleSheets();

  // Fetch men's players data
  useEffect(() => {
    if (config.spreadsheetId) {
      // Clear any previous data to prevent showing stale data from other pages
      clearDataForRange('Men!A:Z');
      fetchSheetData(config.spreadsheetId, 'Men!A:Z');
    }
  }, [config.spreadsheetId, fetchSheetData, clearDataForRange]);

  // Get data from sheets or use fallback - memoized
  const playerData = useMemo(() => {
    const menData = getDataForRange('Men!A:Z');
    if (menData && menData.values && menData.values.length > 0) {
      return menData.values;
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
  }, [getDataForRange]);

  const headers = useMemo(() => playerData[0] || [], [playerData]);
  const dataRows = useMemo(() => playerData.slice(1) || [], [playerData]);

  // Sort data by games won in descending order and add rank
  const sortedAndRankedData = useMemo(() => {
    return dataRows
      .map((row, index) => ({
        ...row,
        originalIndex: index,
        gamesWon: parseInt(row[4]) || 0
      }))
      .sort((a, b) => b.gamesWon - a.gamesWon)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));
  }, [dataRows]);

  const filteredData = useMemo(() => 
    sortedAndRankedData.filter(row => 
      row[0] && row[0].toLowerCase().includes(searchTerm.toLowerCase())
    ), [sortedAndRankedData, searchTerm]);

  const getWinRate = useCallback((won, lost) => {
    const total = parseInt(won) + parseInt(lost);
    if (total === 0) return '0%';
    return `${Math.round((parseInt(won) / total) * 100)}%`;
  }, []);

  const getCategoryColor = useCallback((category) => {
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
  }, []);

  const getRankColor = useCallback((rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#757575';
    }
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);



  const handleRefresh = useCallback(() => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Men!A:Z');
    }
  }, [config.spreadsheetId, fetchSheetData]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading players data..." />;
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
              onChange={handleSearchChange}
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
                <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rank
                </TableCell>
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
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: row.rank <= 3 ? getRankColor(row.rank) : 'inherit'
                        }}
                      >
                        #{row.rank}
                      </Typography>
                    </TableCell>
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
});

MensPlayers.displayName = 'MensPlayers';

export default MensPlayers;
