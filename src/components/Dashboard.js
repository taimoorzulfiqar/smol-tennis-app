import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Settings,
  Refresh,
  Search,
  TrendingUp,
  People,
  EmojiEvents,
} from '@mui/icons-material';
import { useGoogleSheets } from '../context/GoogleSheetsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { sheetsData, isLoading, error, config, fetchSheetData } = useGoogleSheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    if (sheetsData.values && sheetsData.values.length > 0) {
      const headers = sheetsData.values[0];
      const dataRows = sheetsData.values.slice(1);
      
      const filtered = dataRows.filter(row => 
        row.some(cell => 
          cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      setFilteredData(filtered);
    }
  }, [sheetsData, searchTerm]);

  const handleRefresh = () => {
    if (config.spreadsheetId) {
      fetchSheetData(config.spreadsheetId, config.range);
    }
  };

  const getChartData = () => {
    if (!sheetsData.values || sheetsData.values.length < 2) return [];
    
    const headers = sheetsData.values[0];
    const dataRows = sheetsData.values.slice(1);
    
    // Try to find numeric columns for charting
    const numericColumns = headers.map((header, index) => {
      const hasNumericData = dataRows.some(row => 
        row[index] && !isNaN(parseFloat(row[index]))
      );
      return { header, index, hasNumericData };
    }).filter(col => col.hasNumericData);

    if (numericColumns.length === 0) return [];

    // Create chart data from first numeric column
    const chartCol = numericColumns[0];
    return dataRows.slice(0, 10).map((row, index) => ({
      name: row[0] || `Row ${index + 1}`,
      value: parseFloat(row[chartCol.index]) || 0,
    }));
  };

  const chartData = getChartData();

  if (!config.spreadsheetId) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h5" gutterBottom>
          Welcome to Tennis App
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configure your Google Sheets connection to start viewing data
        </Typography>
        <Button
          component={Link}
          to="/config"
          variant="contained"
          startIcon={<Settings />}
          size="large"
        >
          Configure Sheets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/config"
            variant="outlined"
            startIcon={<Settings />}
            sx={{ mr: 1 }}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sheetsData.values && sheetsData.values.length > 0 && (
            <>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <People color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Total Rows</Typography>
                      </Box>
                      <Typography variant="h4" color="primary">
                        {sheetsData.values.length - 1}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <TrendingUp color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Columns</Typography>
                      </Box>
                      <Typography variant="h4" color="secondary">
                        {sheetsData.values[0].length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <EmojiEvents color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6">Status</Typography>
                      </Box>
                      <Chip label="Connected" color="success" />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {chartData.length > 0 && (
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Data Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#2e7d32" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Data Distribution
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#ff6f00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Sheet Data</Typography>
                  <TextField
                    size="small"
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {sheetsData.values[0].map((header, index) => (
                          <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {cell || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
