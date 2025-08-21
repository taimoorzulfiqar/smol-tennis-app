import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents,
  People,
  TrendingUp,
  Schedule,
  SportsTennis,
  Timeline,
  Group,
  Assessment,
} from '@mui/icons-material';

const TournamentDashboard = () => {
  const tournamentSections = [
    {
      title: 'Player Rankings',
      description: 'View current player standings and rankings',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      path: '/rankings',
      color: '#2e7d32',
    },
    {
      title: 'Match Results',
      description: 'Track match outcomes and scores',
      icon: <SportsTennis sx={{ fontSize: 40 }} />,
      path: '/matches',
      color: '#ff6f00',
    },
    {
      title: 'Tournament Schedule',
      description: 'View upcoming matches and events',
      icon: <Schedule sx={{ fontSize: 40 }} />,
      path: '/schedule',
      color: '#1976d2',
    },
    {
      title: 'Player Profiles',
      description: 'Detailed player information and stats',
      icon: <People sx={{ fontSize: 40 }} />,
      path: '/players',
      color: '#9c27b0',
    },
    {
      title: 'Tournament Bracket',
      description: 'Visual tournament progression',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      path: '/bracket',
      color: '#d32f2f',
    },
    {
      title: 'Team Standings',
      description: 'Team rankings and performance',
      icon: <Group sx={{ fontSize: 40 }} />,
      path: '/teams',
      color: '#388e3c',
    },
    {
      title: 'Statistics',
      description: 'Advanced analytics and insights',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/stats',
      color: '#7b1fa2',
    },
    {
      title: 'Champions',
      description: 'Tournament winners and history',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      path: '/champions',
      color: '#f57c00',
    },
  ];

  return (
    <Box>
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
          Expert Tennis League
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Professional Tennis Tournament Management
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip 
            label="Tournament Active" 
            color="success" 
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {tournamentSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardActionArea 
                component={Link} 
                to={section.path}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: section.color, mb: 2 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">24</Typography>
              <Typography variant="body2">Active Players</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="secondary">156</Typography>
              <Typography variant="body2">Matches Played</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">8</Typography>
              <Typography variant="body2">Tournament Days</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main">4</Typography>
              <Typography variant="body2">Remaining Rounds</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TournamentDashboard;
