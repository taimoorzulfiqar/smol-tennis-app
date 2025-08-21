import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test Component
        </Typography>
        <Typography variant="body1">
          This is a simple test component to verify the app is working.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          If you can see this, the basic app structure is working correctly.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestComponent;
