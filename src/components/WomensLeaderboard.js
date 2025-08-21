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
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
} from '@mui/material';
import {
  SportsTennis,
  EmojiEvents,
  TrendingUp,
  Person,
  Refresh,
  Star,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const WomensLeaderboard = () => {
  const { sheetsData, isLoading, error, fetchSheetData, config } = useGoogleSheets();

  // Fetch women's players data for leaderboard
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
  const dataRows = playerData.slice(1) || [];

  // Calculate rankings
  const calculateRankings = () => {
    return dataRows
      .map((row, index) => {
        const name = row[0];
        const matchesPlayed = parseInt(row[1]) || 0;
        const matchesWon = parseInt(row[2]) || 0;
        const matchesLost = parseInt(row[3]) || 0;
        const gamesWon = parseInt(row[4]) || 0;
        const category = row[5];

        const winRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;
        const points = matchesWon * 3 + gamesWon * 0.1; // Simple scoring system

        return {
          name,
          matchesPlayed,
          matchesWon,
          matchesLost,
          gamesWon,
          category,
          winRate,
          points,
          originalIndex: index
        };
      })
      .sort((a, b) => {
        // Sort by points first, then by win rate, then by games won
        if (b.points !== a.points) return b.points - a.points;
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.gamesWon - a.gamesWon;
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));
  };

  const rankings = calculateRankings();

  const getRankColor = (rank) => {
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
        <EmojiEvents sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Women's Tennis Leaderboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Current Rankings and Statistics
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

      {/* Leaderboard Table */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
            🏆 Current Rankings
          </Typography>
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
        
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                color: 'white'
              }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Rank
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Player
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Matches
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Wins
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Losses
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Games Won
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Win Rate
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Points
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>
                  Category
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((player) => (
                <TableRow 
                  key={player.originalIndex}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#fce4ec',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease-in-out'
                    },
                    transition: 'all 0.2s ease-in-out',
                    ...(player.rank <= 3 && {
                      backgroundColor: '#fff3e0',
                      '&:hover': { backgroundColor: '#ffe0b2' }
                    })
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {player.rank <= 3 && (
                        <Star sx={{ color: getRankColor(player.rank), fontSize: 20 }} />
                      )}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: player.rank <= 3 ? getRankColor(player.rank) : 'inherit'
                        }}
                      >
                        #{player.rank}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Badge
                        badgeContent={player.rank}
                        color={player.rank <= 3 ? "warning" : "default"}
                        invisible={player.rank > 3}
                      >
                        <Avatar sx={{ 
                          bgcolor: player.rank <= 3 ? getRankColor(player.rank) : '#e91e63',
                          width: 45,
                          height: 45,
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}>
                          {player.name?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      </Badge>
                      <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{player.matchesPlayed}</TableCell>
                  <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {player.matchesWon}
                  </TableCell>
                  <TableCell sx={{ color: 'error.main' }}>
                    {player.matchesLost}
                  </TableCell>
                  <TableCell>{player.gamesWon}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: player.winRate >= 70 ? 'success.main' : 'inherit'
                      }}
                    >
                      {player.winRate.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: player.rank <= 3 ? getRankColor(player.rank) : 'inherit'
                      }}
                    >
                      {player.points.toFixed(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={player.category} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getCategoryColor(player.category),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data sourced from Google Sheets • Women's Tennis League Rankings
        </Typography>
      </Paper>
    </Box>
  );
};

export default WomensLeaderboard;
