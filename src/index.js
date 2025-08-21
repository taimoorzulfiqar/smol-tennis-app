import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleSheetsProvider } from './context/GoogleSheetsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleSheetsProvider>
      <App />
    </GoogleSheetsProvider>
  </React.StrictMode>
);
