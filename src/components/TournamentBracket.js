import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Timeline,
  SportsTennis,
  EmojiEvents,
  Star,
} from '@mui/icons-material';

const TournamentBracket = () => {
  const bracketData = {
    final: {
      player1: 'Novak Djokovic',
      player2: 'Jannik Sinner',
      winner: 'Novak Djokovic',
      score: '6-3, 6-3, 7-6'
    },
    semifinals: [
      {
        player1: 'Novak Djokovic',
        player2: 'Carlos Alcaraz',
        winner: 'Novak Djokovic',
        score: '7-6, 6-4, 6-2'
      },
      {
        player1: 'Jannik Sinner',
        player2: 'Daniil Medvedev',
        winner: 'Jannik Sinner',
        score: '6-4, 6-2, 6-3'
      }
    ],
    quarterfinals: [
      {
        player1: 'Novak Djokovic',
        player2: 'Taylor Fritz',
        winner: 'Novak Djokovic',
        score: '6-3, 6-4, 6-2'
      },
      {
        player1: 'Carlos Alcaraz',
        player2: 'Alexander Zverev',
        winner: 'Carlos Alcaraz',
        score: '6-4, 6-3, 7-6'
      },
      {
        player1: 'Daniil Medvedev',
        player2: 'Andrey Rublev',
        winner: 'Daniil Medvedev',
        score: '6-4, 6-2, 6-3'
      },
      {
        player1: 'Jannik Sinner',
        player2: 'Stefanos Tsitsipas',
        winner: 'Jannik Sinner',
        score: '6-4, 6-2, 6-3'
      }
    ]
  };

  const MatchCard = ({ match, round, isWinner = false }) => (
    <Card 
      sx={{ 
        mb: 2,
        border: isWinner ? '2px solid #FFD700' : '1px solid #e0e0e0',
        backgroundColor: isWinner ? '#fff8e1' : 'white'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: isWinner ? '#FFD700' : '#2e7d32' }}>
            {isWinner ? <EmojiEvents sx={{ fontSize: 12 }} /> : <SportsTennis sx={{ fontSize: 12 }} />}
          </Avatar>
          <Typography variant="body2" fontWeight="bold">
            {match.player1} vs {match.player2}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {match.score}
        </Typography>
        {isWinner && (
          <Chip 
            label="Winner" 
            size="small" 
            color="success" 
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Timeline sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Tournament Bracket
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Visual Tournament Progression
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Quarter Finals */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Quarter Finals
            </Typography>
            {bracketData.quarterfinals.map((match, index) => (
              <MatchCard 
                key={index} 
                match={match} 
                round="quarter"
                isWinner={match.winner === bracketData.final.winner || 
                         bracketData.semifinals.some(sf => sf.winner === match.winner)}
              />
            ))}
          </Paper>
        </Grid>

        {/* Semi Finals */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="secondary">
              Semi Finals
            </Typography>
            {bracketData.semifinals.map((match, index) => (
              <MatchCard 
                key={index} 
                match={match} 
                round="semi"
                isWinner={match.winner === bracketData.final.winner}
              />
            ))}
          </Paper>
        </Grid>

        {/* Final */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FFD700' }}>
              Final
            </Typography>
            <MatchCard 
              match={bracketData.final} 
              round="final"
              isWinner={true}
            />
          </Paper>
        </Grid>

        {/* Champion */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FFD700' }}>
              Champion
            </Typography>
            <Card sx={{ border: '3px solid #FFD700', backgroundColor: '#fff8e1' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: '#FFD700'
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {bracketData.final.winner}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Tournament Champion
                </Typography>
                <Chip 
                  label="🏆 Winner" 
                  color="success" 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tournament Progress
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">4</Typography>
              <Typography variant="body2">Quarter Finals</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="secondary">2</Typography>
              <Typography variant="body2">Semi Finals</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ color: '#FFD700' }}>1</Typography>
              <Typography variant="body2">Final</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">1</Typography>
              <Typography variant="body2">Champion</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TournamentBracket;
