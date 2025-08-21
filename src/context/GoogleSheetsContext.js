import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.js';

const GoogleSheetsContext = createContext();

export const useGoogleSheets = () => {
  const context = useContext(GoogleSheetsContext);
  if (!context) {
    throw new Error('useGoogleSheets must be used within a GoogleSheetsProvider');
  }
  return context;
};

export const GoogleSheetsProvider = ({ children }) => {
  const [sheetsData, setSheetsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({
    spreadsheetId: config.spreadsheetId,
    apiKey: config.apiKey,
    range: config.range,
    useServiceAccount: config.useServiceAccount, // Use setting from config.js
  });

  const fetchSheetData = async (spreadsheetId, range = 'A:Z') => {
    if (!spreadsheetId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        spreadsheetId,
        range,
        useServiceAccount: config.useServiceAccount.toString()
      });
      
      if (!config.useServiceAccount && config.apiKey) {
        params.append('apiKey', config.apiKey);
      }
      
      const response = await axios.get(`/api/sheets?${params.toString()}`);
      setSheetsData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sheet data');
      console.error('Error fetching sheet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('sheetsConfig', JSON.stringify(newConfig));
  };

  useEffect(() => {
    // Use config from config.js file directly
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, config.range);
    }
  }, []);

  const value = {
    sheetsData,
    isLoading,
    error,
    config,
    fetchSheetData,
    updateConfig,
  };

  return (
    <GoogleSheetsContext.Provider value={value}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};
