import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import configFile from '../config.js';

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
  const [dataCache, setDataCache] = useState(new Map());
  const [config, setConfig] = useState({
    spreadsheetId: configFile.spreadsheetId,
    apiKey: configFile.apiKey,
    range: configFile.range,
    useServiceAccount: configFile.useServiceAccount,
  });

  const fetchSheetData = useCallback(async (spreadsheetId, range = 'A:Z') => {
    if (!spreadsheetId) return;
    
    // Check cache first
    const cacheKey = `${spreadsheetId}-${range}`;
    const cachedData = dataCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < 30000) { // 30 second cache
      setSheetsData(cachedData.data);
      return;
    }
    
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
      
      // Cache the response
      setDataCache(prev => new Map(prev.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })));
      
      setSheetsData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sheet data');
      console.error('Error fetching sheet data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.useServiceAccount, config.apiKey, dataCache]);

  const updateConfig = useCallback((newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('sheetsConfig', JSON.stringify(newConfig));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sheetsData,
    isLoading,
    error,
    config,
    fetchSheetData,
    updateConfig,
  }), [sheetsData, isLoading, error, config, fetchSheetData, updateConfig]);

  useEffect(() => {
    console.log('GoogleSheetsContext initialized with config:', config);
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, config.range);
    } else {
      console.log('No spreadsheet ID configured, using fallback data');
    }
  }, [config.spreadsheetId, config.range, fetchSheetData]);

  return (
    <GoogleSheetsContext.Provider value={contextValue}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};
