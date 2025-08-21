import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    spreadsheetId: '', // Replace with your actual Spreadsheet ID
    apiKey: '', // Replace with your actual API Key
    range: 'Men!A:F', // Men sheet with columns A-F
    useServiceAccount: false, // Set to true to use service account
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
    const savedConfig = localStorage.getItem('sheetsConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      if (parsedConfig.spreadsheetId) {
        fetchSheetData(parsedConfig.spreadsheetId, parsedConfig.range);
      }
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
