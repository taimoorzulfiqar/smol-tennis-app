import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Search,
  Flag,
  Cake,
  Height,
  Weight,
  TrendingUp,
  EmojiEvents,
  SportsTennis,
  Star,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const PlayerProfiles = () => {
  const { sheetsData, isLoading } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const getPlayerData = () => {
    if (!sheetsData.values || sheetsData.values.length < 2) {
      // Sample player data
      return [
        ['Player Name', 'Country', 'Age', 'Height', 'Weight', 'Ranking', 'Wins', 'Losses', 'Win Rate', 'Grand Slams', 'Career Titles'],
        ['Novak Djokovic', 'Serbia', 36, '188cm', '77kg', 1, 1089, 213, '83.6%', 24, 98],
        ['Carlos Alcaraz', 'Spain', 20, '183cm', '80kg', 2, 147, 42, '77.8%', 2, 12],
        ['Daniil Medvedev', 'Russia', 27, '198cm', '83kg', 3, 350, 143, '71.0%', 1, 20],
        ['Jannik Sinner', 'Italy', 22, '188cm', '76kg', 4, 200, 89, '69.2%', 1, 10],
        ['Andrey Rublev', 'Russia', 26, '188cm', '75kg', 5, 320, 180, '64.0%', 0, 15],
        ['Stefanos Tsitsipas', 'Greece', 25, '193cm', '89kg', 6, 280, 150, '65.1%', 0, 10],
        ['Alexander Zverev', 'Germany', 26, '198cm', '90kg', 7, 400, 200, '66.7%', 0, 21],
        ['Holger Rune', 'Denmark', 20, '188cm', '77kg', 8, 120, 60, '66.7%', 0, 4],
        ['Hubert Hurkacz', 'Poland', 26, '196cm', '82kg', 9, 250, 140, '64.1%', 0, 7],
        ['Taylor Fritz', 'USA', 25, '196cm', '86kg', 10, 220, 130, '62.9%', 0, 6],
      ];
    }
    return sheetsData.values;
  };

  const playerData = getPlayerData();
  const headers = playerData[0];
  const dataRows = playerData.slice(1);

  const filteredPlayers = dataRows.filter(row => 
    row[0] && row[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCountryFlag = (country) => {
    // Simple country code mapping
    const countryCodes = {
      'Serbia': '🇷🇸',
      'Spain': '🇪🇸',
      'Russia': '🇷🇺',
      'Italy': '🇮🇹',
      'Greece': '🇬🇷',
      'Germany': '🇩🇪',
      'Denmark': '🇩🇰',
      'Poland': '🇵🇱',
      'USA': '🇺🇸',
    };
    return countryCodes[country] || '🏳️';
  };

  const getRankingColor = (ranking) => {
    switch (parseInt(ranking)) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#2e7d32';
    }
  };

  const PlayerCard = ({ player }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
      onClick={() => setSelectedPlayer(player)}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: getRankingColor(player[5]),
              fontSize: '1.5rem'
            }}
          >
            {player[0].split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {player[0]}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                {getCountryFlag(player[1])} {player[1]}
              </Typography>
              <Chip 
                label={`#${player[5]}`} 
                size="small" 
                sx={{ 
                  backgroundColor: getRankingColor(player[5]),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
        </Box>
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Age: {player[2]}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Win Rate: {player[8]}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Height: {player[3]}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Weight: {player[4]}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const PlayerDetail = ({ player }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: getRankingColor(player[5]),
              fontSize: '2rem'
            }}
          >
            {player[0].split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold">
              {player[0]}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <Typography variant="h6" color="text.secondary">
                {getCountryFlag(player[1])} {player[1]}
              </Typography>
              <Chip 
                label={`Rank #${player[5]}`} 
                sx={{ 
                  backgroundColor: getRankingColor(player[5]),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Cake />
                </ListItemIcon>
                <ListItemText primary={`Age: ${player[2]} years old`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Height />
                </ListItemIcon>
                <ListItemText primary={`Height: ${player[3]}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Weight />
                </ListItemIcon>
                <ListItemText primary={`Weight: ${player[4]}`} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Career Statistics
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SportsTennis />
                </ListItemIcon>
                <ListItemText primary={`Matches: ${player[6]}W - ${player[7]}L`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText primary={`Win Rate: ${player[8]}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEvents />
                </ListItemIcon>
                <ListItemText primary={`Grand Slams: ${player[9]}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary={`Career Titles: ${player[10]}`} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <People sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Player Profiles
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Detailed Player Information and Statistics
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
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
            />
          </Paper>
          
          <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {filteredPlayers.map((player, index) => (
                <Grid item xs={12} key={index}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {selectedPlayer ? (
            <PlayerDetail player={selectedPlayer} />
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select a player to view details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on any player card to see their full profile
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerProfiles;
