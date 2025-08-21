import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Settings,
  CheckCircle,
  Info,
  Link as LinkIcon,
  Security,
  AccountCircle,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { useNavigate } from 'react-router-dom';

const SheetsSetup = () => {
  const { config, updateConfig, fetchSheetData } = useGoogleSheets();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    spreadsheetId: config.spreadsheetId || '',
    apiKey: config.apiKey || '',
    useServiceAccount: config.useServiceAccount || false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError('');
  };

  const handleTestConnection = async () => {
    if (!formData.spreadsheetId) {
      setError('Spreadsheet ID is required');
      return;
    }

    if (!formData.useServiceAccount && !formData.apiKey) {
      setError('API Key is required when not using service account');
      return;
    }

    try {
      const newConfig = {
        ...config,
        spreadsheetId: formData.spreadsheetId,
        apiKey: formData.apiKey,
        useServiceAccount: formData.useServiceAccount,
        range: 'Men!A:F',
      };
      updateConfig(newConfig);
      await fetchSheetData(formData.spreadsheetId, 'Men!A:F');
      setSuccess('Connection successful! Your data is now loaded and will auto-refresh every 30 seconds.');
      setError('');
      
      // Redirect to main page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Connection failed. Please check your configuration.');
      setSuccess('');
    }
  };

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Settings sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Google Sheets Setup
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Connect your Men's Tennis League data
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              
              <TextField
                fullWidth
                label="Google Sheets API Key"
                value={formData.apiKey}
                onChange={handleInputChange('apiKey')}
                margin="normal"
                required
                type="password"
                helperText="Your Google Sheets API key from Google Cloud Console"
              />
              
              <TextField
                fullWidth
                label="Spreadsheet ID"
                value={formData.spreadsheetId}
                onChange={handleInputChange('spreadsheetId')}
                margin="normal"
                required
                helperText="Found in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit"
              />
              
                             <TextField
                 fullWidth
                 label="Range"
                 value="Men!A:F"
                 margin="normal"
                 disabled
                 helperText="Automatically set to Men sheet, columns A-F"
               />
               
               <Divider sx={{ my: 2 }} />
               
               <FormControlLabel
                 control={
                   <Switch
                     checked={formData.useServiceAccount}
                     onChange={(e) => setFormData({
                       ...formData,
                       useServiceAccount: e.target.checked
                     })}
                   />
                 }
                 label="Use Service Account (Recommended)"
               />
               
               {formData.useServiceAccount && (
                 <Alert severity="info" sx={{ mt: 2 }}>
                   <Typography variant="body2">
                     Service Account mode: Place your service account JSON key file in the <code>server/</code> folder as <code>service-account-key.json</code>
                   </Typography>
                 </Alert>
               )}
              
              <Box mt={3}>
                                 <Button
                   variant="contained"
                   onClick={handleTestConnection}
                   disabled={!formData.spreadsheetId || (!formData.useServiceAccount && !formData.apiKey)}
                   fullWidth
                 >
                   Test Connection
                 </Button>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Setup Instructions
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Get API Key"
                    secondary="Go to Google Cloud Console and create an API key for Google Sheets API"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Prepare Your Sheet"
                    secondary="Ensure your Google Sheet has a 'Men' tab with columns: Name, Matches Played, Matches Won, Matches Lost, Games Won, Category"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Set Permissions"
                    secondary="Make your Google Sheet publicly accessible or share with appropriate permissions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary="Test Connection"
                    secondary="Click 'Test Connection' to verify your setup and load data"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SheetsSetup;
