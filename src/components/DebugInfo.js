import React from 'react';
import { Box, Paper, Typography, Alert, Button } from '@mui/material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const DebugInfo = () => {
  const { sheetsData, isLoading, error, config, fetchSheetData } = useGoogleSheets();

  const handleTestFetch = () => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, 'Men!A:Z');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Debug Information
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Configuration:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'white', p: 1, borderRadius: 1 }}>
          Spreadsheet ID: {config.spreadsheetId || 'Not set'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'white', p: 1, borderRadius: 1 }}>
          Use Service Account: {config.useServiceAccount ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: 'white', p: 1, borderRadius: 1 }}>
          Range: {config.range || 'Not set'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Status:
        </Typography>
        <Typography variant="body2">
          Loading: {isLoading ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          Has Error: {error ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          Has Data: {sheetsData.values ? 'Yes' : 'No'}
        </Typography>
        {sheetsData.values && (
          <Typography variant="body2">
            Rows: {sheetsData.values.length}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {sheetsData.values && sheetsData.values.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Data Preview:
          </Typography>
          <Box sx={{ fontFamily: 'monospace', backgroundColor: 'white', p: 1, borderRadius: 1, fontSize: '0.8rem' }}>
            <div>Headers: {JSON.stringify(sheetsData.values[0])}</div>
            {sheetsData.values.length > 1 && (
              <div>First Row: {JSON.stringify(sheetsData.values[1])}</div>
            )}
            {sheetsData.values.length > 2 && (
              <div>Second Row: {JSON.stringify(sheetsData.values[2])}</div>
            )}
          </Box>
        </Box>
      )}

      <Button 
        variant="contained" 
        onClick={handleTestFetch}
        disabled={isLoading}
        sx={{ mr: 1 }}
      >
        Test Fetch Data
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={() => window.location.reload()}
      >
        Reload Page
      </Button>
    </Paper>
  );
};

export default DebugInfo;
