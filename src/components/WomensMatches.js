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
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Search,
  SportsTennis,
  Refresh,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const WomensMatches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sheetsData, isLoading, error, fetchSheetData, config, getDataForRange, clearDataForRange } = useGoogleSheets();

  // Fetch women's matches data
  useEffect(() => {
    if (config.spreadsheetId) {
      // Clear any previous data to prevent showing stale data from other pages
      clearDataForRange('Womens Matches!A:Z');
      // Use the correct sheet name: 'Womens Matches'
      fetchSheetData(config.spreadsheetId, 'Womens Matches!A:Z').catch(() => {
        console.log('Womens Matches sheet not found, using fallback data');
      });
    }
  }, [config.spreadsheetId, fetchSheetData, clearDataForRange]);

  // Get data from sheets or use fallback
  const getMatchData = () => {
    const womensMatchesData = getDataForRange('Womens Matches!A:Z');
    if (womensMatchesData && womensMatchesData.values && womensMatchesData.values.length > 0) {
      return womensMatchesData.values;
    }
    
         // Fallback data if no Google Sheets data
     return [
       ['Match', 'Player 1', 'Player 2', 'Player 1 Score', 'Player 2 Score', 'Winner'],
       ['1', 'Sarah Johnson', 'Emily Davis', '6-3, 6-4', '3-6, 4-6', 'Sarah Johnson'],
       ['2', 'Maria Garcia', 'Lisa Chen', '6-2, 6-1', '2-6, 1-6', 'Maria Garcia'],
       ['3', 'Anna Wilson', 'Jessica Brown', '7-5, 6-3', '5-7, 3-6', 'Anna Wilson'],
       ['4', 'Emily Davis', 'Rachel Lee', '6-4, 6-2', '4-6, 2-6', 'Emily Davis'],
       ['5', 'Sarah Johnson', 'Michelle Taylor', '6-1, 6-0', '1-6, 0-6', 'Sarah Johnson'],
       ['6', 'Lisa Chen', 'Anna Wilson', '4-6, 6-4, 6-2', '6-4, 4-6, 2-6', 'Lisa Chen'],
       ['7', 'Jessica Brown', 'Rachel Lee', '6-3, 7-6', '3-6, 6-7', 'Jessica Brown'],
       ['8', 'Maria Garcia', 'Michelle Taylor', '6-4, 6-4', '4-6, 4-6', 'Maria Garcia']
     ];
  };

  const matchData = getMatchData();
  const headers = matchData[0] || [];
  const dataRows = matchData.slice(1) || [];

  const filteredData = dataRows.filter(row => 
    (row[1] && row[1].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row[2] && row[2].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row[5] && row[5].toLowerCase().includes(searchTerm.toLowerCase()))
  );



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleRefresh = () => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Womens Matches!A:Z');
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
                       <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                         {row[0]}
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
                       <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                         {row[4]}
                       </Typography>
                     </TableCell>
                     <TableCell>
                       <Typography 
                         variant="body1" 
                         sx={{ 
                           fontWeight: 'bold',
                           color: 'success.main'
                         }}
                       >
                         {row[5] || 'TBD'}
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
          Data sourced from Google Sheets • Women's Tennis League Matches
        </Typography>
      </Paper>
    </Box>
  );
};

export default WomensMatches;
