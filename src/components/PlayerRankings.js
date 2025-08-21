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
  Avatar,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Remove,
  EmojiEvents,
  Star,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const PlayerRankings = () => {
  const { sheetsData, isLoading } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getRankingData = () => {
    if (!sheetsData.values || sheetsData.values.length < 2) {
      // Sample data if no Google Sheets data
      return [
        ['Rank', 'Player Name', 'Country', 'Points', 'Matches Won', 'Matches Lost', 'Win Rate', 'Trend'],
        [1, 'Novak Djokovic', 'Serbia', 9850, 1089, 213, '83.6%', 'up'],
        [2, 'Carlos Alcaraz', 'Spain', 8855, 147, 42, '77.8%', 'up'],
        [3, 'Daniil Medvedev', 'Russia', 7280, 350, 143, '71.0%', 'down'],
        [4, 'Jannik Sinner', 'Italy', 6490, 200, 89, '69.2%', 'up'],
        [5, 'Andrey Rublev', 'Russia', 5010, 320, 180, '64.0%', 'stable'],
        [6, 'Stefanos Tsitsipas', 'Greece', 4235, 280, 150, '65.1%', 'down'],
        [7, 'Alexander Zverev', 'Germany', 3980, 400, 200, '66.7%', 'up'],
        [8, 'Holger Rune', 'Denmark', 3765, 120, 60, '66.7%', 'stable'],
        [9, 'Hubert Hurkacz', 'Poland', 3240, 250, 140, '64.1%', 'down'],
        [10, 'Taylor Fritz', 'USA', 3150, 220, 130, '62.9%', 'up'],
      ];
    }
    return sheetsData.values;
  };

  const rankingData = getRankingData();
  const headers = rankingData[0];
  const dataRows = rankingData.slice(1);

  const filteredData = dataRows.filter(row => 
    row.some(cell => 
      cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      case 'stable':
        return <Remove color="action" />;
      default:
        return <Remove color="action" />;
    }
  };

  const getRankColor = (rank) => {
    switch (parseInt(rank)) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'inherit';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <TrendingUp sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Player Rankings
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Current ATP Tour Rankings
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 3 Players
              </Typography>
              <Grid container spacing={2}>
                {dataRows.slice(0, 3).map((player, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box textAlign="center" p={2}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mx: 'auto', 
                          mb: 1,
                          bgcolor: getRankColor(index + 1)
                        }}
                      >
                        {index === 0 && <EmojiEvents />}
                        {index === 1 && <Star />}
                        {index === 2 && <Star />}
                      </Avatar>
                      <Typography variant="h6">{player[1]}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player[2]} • {player[3]} pts
                      </Typography>
                      <Chip 
                        label={`#${player[0]}`} 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ranking Stats
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Players: {dataRows.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Points: {Math.round(dataRows.reduce((sum, row) => sum + (parseInt(row[3]) || 0), 0) / dataRows.length)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Highest Win Rate: {Math.max(...dataRows.map(row => parseFloat(row[6]?.replace('%', '') || 0))}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Complete Rankings</Typography>
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
                      color: header === 'Rank' ? '#2e7d32' : 'inherit'
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
                      backgroundColor: parseInt(row[0]) <= 3 ? '#fff8e1' : 'inherit'
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {cellIndex === 0 ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: getRankColor(cell)
                              }}
                            >
                              {cell}
                            </Typography>
                          </Box>
                        ) : cellIndex === headers.length - 1 ? (
                          getTrendIcon(cell)
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

export default PlayerRankings;
