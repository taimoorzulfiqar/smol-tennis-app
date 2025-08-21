import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleSheetsProvider } from './context/GoogleSheetsContext';
import MensTennisApp from './components/MensTennisApp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  console.log('App component is loading...');
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎾 Tennis App is Loading!</h1>
      <p>If you can see this, the app is working!</p>
      <p>Check the browser console for more details.</p>
    </div>
  );
}

export default App;
