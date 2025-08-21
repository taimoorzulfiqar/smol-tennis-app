import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Info,
  Link as LinkIcon,
  Security,
  Code,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';

const steps = [
  'Get Google Sheets API Key',
  'Configure Spreadsheet',
  'Test Connection',
];

const SheetsConfig = () => {
  const navigate = useNavigate();
  const { config, updateConfig, fetchSheetData } = useGoogleSheets();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    spreadsheetId: config.spreadsheetId || '',
    apiKey: config.apiKey || '',
    range: config.range || 'A:Z',
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

  const handleSave = () => {
    if (!formData.spreadsheetId || !formData.apiKey) {
      setError('Please fill in all required fields');
      return;
    }

    updateConfig(formData);
    setSuccess('Configuration saved successfully!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (!formData.spreadsheetId || !formData.apiKey) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await fetchSheetData(formData.spreadsheetId, formData.range);
      setSuccess('Connection successful! Data loaded.');
      setActiveStep(2);
    } catch (err) {
      setError('Connection failed. Please check your configuration.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Step 1: Get Google Sheets API Key
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Go to Google Cloud Console"
                    secondary={
                      <MuiLink
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener"
                      >
                        https://console.cloud.google.com/
                      </MuiLink>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create a new project or select existing one"
                    secondary="Enable Google Sheets API for your project"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create API credentials"
                    secondary="Generate an API key from the Credentials page"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Code />
                  </ListItemIcon>
                  <ListItemText
                    primary="Copy your API key"
                    secondary="You'll need this key to connect to your sheets"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 2: Configure Your Spreadsheet
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
              label="Range (optional)"
              value={formData.range}
              onChange={handleInputChange('range')}
              margin="normal"
              helperText="Default: A:Z (all columns). Example: A1:D10 for specific range"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleTestConnection}
                disabled={!formData.spreadsheetId || !formData.apiKey}
              >
                Test Connection
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 3: Connection Status
            </Typography>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <Typography variant="body1" paragraph>
              Your Google Sheets connection is now configured and ready to use!
            </Typography>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<CheckCircle />}
            >
              Save Configuration
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Google Sheets Configuration
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Important Notes
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Make sure your Google Sheet is publicly accessible or shared with appropriate permissions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Security color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Keep your API key secure and don't share it publicly"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary="The app will automatically refresh data when you visit the dashboard"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SheetsConfig;
