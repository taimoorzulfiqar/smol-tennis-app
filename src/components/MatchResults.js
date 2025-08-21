import React, { useState } from 'react';
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
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  SportsTennis,
  CheckCircle,
  Cancel,
  Schedule,
  EmojiEvents,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const MatchResults = () => {
  const { sheetsData, isLoading } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getMatchData = () => {
    if (!sheetsData.values || sheetsData.values.length < 2) {
      // Sample match data
      return [
        ['Date', 'Tournament', 'Round', 'Player 1', 'Player 2', 'Score', 'Winner', 'Duration', 'Status'],
        ['2024-01-15', 'Australian Open', 'Final', 'Novak Djokovic', 'Jannik Sinner', '6-3, 6-3, 7-6', 'Novak Djokovic', '2h 45m', 'Completed'],
        ['2024-01-14', 'Australian Open', 'Semi-Final', 'Novak Djokovic', 'Carlos Alcaraz', '7-6, 6-4, 6-2', 'Novak Djokovic', '2h 15m', 'Completed'],
        ['2024-01-14', 'Australian Open', 'Semi-Final', 'Jannik Sinner', 'Daniil Medvedev', '6-4, 6-2, 6-3', 'Jannik Sinner', '1h 55m', 'Completed'],
        ['2024-01-13', 'Australian Open', 'Quarter-Final', 'Novak Djokovic', 'Taylor Fritz', '6-3, 6-4, 6-2', 'Novak Djokovic', '2h 05m', 'Completed'],
        ['2024-01-13', 'Australian Open', 'Quarter-Final', 'Carlos Alcaraz', 'Alexander Zverev', '6-4, 6-3, 7-6', 'Carlos Alcaraz', '2h 30m', 'Completed'],
        ['2024-01-12', 'Australian Open', 'Round 4', 'Novak Djokovic', 'Hubert Hurkacz', '6-2, 6-3, 6-4', 'Novak Djokovic', '1h 45m', 'Completed'],
        ['2024-01-12', 'Australian Open', 'Round 4', 'Jannik Sinner', 'Andrey Rublev', '6-4, 6-2, 6-3', 'Jannik Sinner', '2h 10m', 'Completed'],
        ['2024-01-11', 'Australian Open', 'Round 3', 'Novak Djokovic', 'Stefanos Tsitsipas', '6-3, 6-4, 6-2', 'Novak Djokovic', '2h 20m', 'Completed'],
        ['2024-01-11', 'Australian Open', 'Round 3', 'Carlos Alcaraz', 'Holger Rune', '6-4, 6-3, 6-2', 'Carlos Alcaraz', '2h 05m', 'Completed'],
      ];
    }
    return sheetsData.values;
  };

  const matchData = getMatchData();
  const headers = matchData[0];
  const dataRows = matchData.slice(1);

  const filteredData = dataRows.filter(row => 
    row.some(cell => 
      cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoundColor = (round) => {
    switch (round?.toLowerCase()) {
      case 'final':
        return '#FFD700';
      case 'semi-final':
        return '#C0C0C0';
      case 'quarter-final':
        return '#CD7F32';
      default:
        return '#2e7d32';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getMatchStats = () => {
    const completed = dataRows.filter(row => row[8]?.toLowerCase() === 'completed').length;
    const total = dataRows.length;
    const avgDuration = dataRows
      .filter(row => row[7])
      .map(row => {
        const duration = row[7];
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
          return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
      })
      .filter(d => d > 0);
    
    const avgMinutes = avgDuration.length > 0 ? Math.round(avgDuration.reduce((a, b) => a + b, 0) / avgDuration.length) : 0;
    
    return {
      completed,
      total,
      avgDuration: `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`
    };
  };

  const stats = getMatchStats();

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <SportsTennis sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Match Results
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Tournament Match Outcomes and Scores
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Match Statistics
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Completed Matches: {stats.completed}/{stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Duration: {stats.avgDuration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate: {Math.round((stats.completed / stats.total) * 100)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Highlights
              </Typography>
              <Grid container spacing={2}>
                {dataRows.slice(0, 3).map((match, index) => (
                  <Grid item xs={12} key={index}>
                    <Box display="flex" alignItems="center" gap={2} p={1}>
                      <Avatar sx={{ bgcolor: getRoundColor(match[2]), width: 32, height: 32 }}>
                        <EmojiEvents sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {match[3]} vs {match[4]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {match[2]} • {match[1]}
                        </Typography>
                      </Box>
                      <Chip 
                        label={match[6]} 
                        size="small" 
                        color="success"
                        icon={<CheckCircle />}
                      />
                    </Box>
                    {index < 2 && <Divider sx={{ my: 1 }} />}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">All Match Results</Typography>
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
            sx={{ width: 300 }}
          />
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {headers.map((header, index) => (
                  <TableCell 
                    key={index} 
                    sx={{ 
                      fontWeight: 'bold',
                      color: header === 'Winner' ? '#2e7d32' : 'inherit'
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
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      backgroundColor: row[2]?.toLowerCase() === 'final' ? '#fff8e1' : 'inherit'
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {cellIndex === 2 ? (
                          <Chip 
                            label={cell} 
                            size="small" 
                            sx={{ 
                              backgroundColor: getRoundColor(cell),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        ) : cellIndex === 8 ? (
                          <Chip 
                            label={cell} 
                            size="small" 
                            color={getStatusColor(cell)}
                            icon={cell?.toLowerCase() === 'completed' ? <CheckCircle /> : <Schedule />}
                          />
                        ) : cellIndex === 6 ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <EmojiEvents sx={{ color: '#FFD700', fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                              {cell}
                            </Typography>
                          </Box>
                        ) : (
                          cell
                        )}
                      </TableCell>
                    ))}
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
    </Box>
  );
};

export default MatchResults;
