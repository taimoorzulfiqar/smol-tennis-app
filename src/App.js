import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { SportsTennis } from '@mui/icons-material';
import MensTennisApp from './components/MensTennisApp';
import SheetsSetup from './components/SheetsSetup';
import { GoogleSheetsProvider } from './context/GoogleSheetsContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleSheetsProvider>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
                         <AppBar position="static">
               <Toolbar>
                 <SportsTennis sx={{ mr: 2 }} />
                 <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                   Men's Tennis League
                 </Typography>
               </Toolbar>
             </AppBar>
            
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Routes>
                <Route path="/" element={<MensTennisApp />} />
                <Route path="/setup" element={<SheetsSetup />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </GoogleSheetsProvider>
    </ThemeProvider>
  );
}

export default App;
