import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import {
  Schedule,
  SportsTennis,
  Event,
  AccessTime,
  LocationOn,
  Group,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const TournamentSchedule = () => {
  const { sheetsData, isLoading } = useGoogleSheets();

  const getScheduleData = () => {
    if (!sheetsData.values || sheetsData.values.length < 2) {
      // Sample schedule data
      return [
        ['Date', 'Time', 'Court', 'Round', 'Player 1', 'Player 2', 'Status', 'Tournament'],
        ['2024-01-16', '10:00 AM', 'Center Court', 'Quarter-Final', 'Novak Djokovic', 'Taylor Fritz', 'Scheduled', 'Australian Open'],
        ['2024-01-16', '11:30 AM', 'Court 1', 'Quarter-Final', 'Carlos Alcaraz', 'Alexander Zverev', 'Scheduled', 'Australian Open'],
        ['2024-01-16', '2:00 PM', 'Center Court', 'Quarter-Final', 'Daniil Medvedev', 'Jannik Sinner', 'Scheduled', 'Australian Open'],
        ['2024-01-16', '3:30 PM', 'Court 1', 'Quarter-Final', 'Andrey Rublev', 'Stefanos Tsitsipas', 'Scheduled', 'Australian Open'],
        ['2024-01-17', '10:00 AM', 'Center Court', 'Semi-Final', 'TBD', 'TBD', 'TBD', 'Australian Open'],
        ['2024-01-17', '2:00 PM', 'Center Court', 'Semi-Final', 'TBD', 'TBD', 'TBD', 'Australian Open'],
        ['2024-01-18', '7:00 PM', 'Center Court', 'Final', 'TBD', 'TBD', 'TBD', 'Australian Open'],
      ];
    }
    return sheetsData.values;
  };

  const scheduleData = getScheduleData();
  const dataRows = scheduleData.slice(1);

  const groupByDate = (data) => {
    const grouped = {};
    data.forEach(row => {
      const date = row[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(row);
    });
    return grouped;
  };

  const groupedSchedule = groupByDate(dataRows);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'info';
      case 'in progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'tbd':
        return 'default';
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Schedule sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1">
              Tournament Schedule
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Match Schedule and Court Assignments
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {Object.entries(groupedSchedule).map(([date, matches]) => (
          <Grid item xs={12} key={date}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Event color="primary" />
                  <Typography variant="h6" color="primary">
                    {formatDate(date)}
                  </Typography>
                  <Badge badgeContent={matches.length} color="secondary">
                    <SportsTennis />
                  </Badge>
                </Box>
                
                <List>
                  {matches.map((match, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getRoundColor(match[3]) }}>
                            <SportsTennis />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="body1" fontWeight="bold">
                                {match[4]} vs {match[5]}
                              </Typography>
                              <Chip 
                                label={match[3]} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getRoundColor(match[3]),
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime sx={{ fontSize: 16 }} />
                                <Typography variant="body2">
                                  {match[1]}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocationOn sx={{ fontSize: 16 }} />
                                <Typography variant="body2">
                                  {match[2]}
                                </Typography>
                              </Box>
                              <Chip 
                                label={match[6]} 
                                size="small" 
                                color={getStatusColor(match[6])}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < matches.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {Object.keys(groupedSchedule).length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No matches scheduled
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updated tournament schedule
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TournamentSchedule;
