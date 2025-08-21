import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
    apiBaseUrl: configFile.apiBaseUrl,
  });
  
  // Add polling interval reference
  const pollingIntervalRef = useRef(null);

  const fetchSheetData = useCallback(async (spreadsheetId, range = 'A:Z', forceRefresh = false) => {
    if (!spreadsheetId) return;
    
    // Check cache first (unless forcing refresh)
    const cacheKey = `${spreadsheetId}-${range}`;
    const cachedData = dataCache.get(cacheKey);
    
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < 30000) { // 30 second cache
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
      
      const apiUrl = config.apiBaseUrl ? `${config.apiBaseUrl}/api/sheets` : '/api/sheets';
      console.log('Making API request to:', apiUrl, 'with params:', params.toString());
      const response = await axios.get(`${apiUrl}?${params.toString()}`);
      
      // Cache the response
      setDataCache(prev => new Map(prev.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })));
      
      setSheetsData(response.data);
      console.log('Successfully fetched data:', response.data);
    } catch (err) {
      console.error('Error fetching sheet data:', err);
      // Only set error if it's not a 404 (sheet not found) error
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch sheet data');
      } else {
        console.log('Sheet not found, using fallback data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [config.useServiceAccount, config.apiKey, config.apiBaseUrl, dataCache]);

  // Start automatic polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll every 2 minutes (120000ms)
    pollingIntervalRef.current = setInterval(() => {
      if (config.spreadsheetId) {
        console.log('Auto-refreshing data from Google Sheets...');
        fetchSheetData(config.spreadsheetId, config.range, true); // Force refresh
      }
    }, 120000); // 2 minutes
  }, [config.spreadsheetId, config.range, fetchSheetData]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

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
    startPolling,
    stopPolling,
  }), [sheetsData, isLoading, error, config, fetchSheetData, updateConfig, startPolling, stopPolling]);

  useEffect(() => {
    console.log('GoogleSheetsContext initialized with config:', config);
    if (config.spreadsheetId) {
      console.log('Fetching data for spreadsheet:', config.spreadsheetId, 'range:', config.range);
      fetchSheetData(config.spreadsheetId, config.range);
      
      // Start automatic polling
      startPolling();
    } else {
      console.log('No spreadsheet ID configured, using fallback data');
    }
    
    // Cleanup polling on unmount
    return () => {
      stopPolling();
    };
  }, [config.spreadsheetId, config.range, fetchSheetData, startPolling, stopPolling]);

  return (
    <GoogleSheetsContext.Provider value={contextValue}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};
