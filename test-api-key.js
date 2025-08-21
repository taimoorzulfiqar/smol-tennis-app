// Test script to verify API with API Key method
const axios = require('axios');

async function testAPIWithKey() {
  const baseUrl = 'https://experttennisacademy.xyz';
  const spreadsheetId = '1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU';
  const apiKey = 'AIzaSyDIyMoMHbTaalqtKhys7LucrMnz5yVbQgM';
  
  try {
    console.log('Testing API with API Key method...');
    console.log(`URL: ${baseUrl}/api/sheets`);
    
    const response = await axios.get(`${baseUrl}/api/sheets`, {
      params: {
        spreadsheetId,
        range: 'Men!A:Z',
        useServiceAccount: 'false',
        apiKey: apiKey
      }
    });
    
    console.log('✅ API is working with API Key!');
    console.log('Response status:', response.status);
    console.log('Data received:', response.data.values ? `${response.data.values.length} rows` : 'No data');
    
    if (response.data.values && response.data.values.length > 0) {
      console.log('First row:', response.data.values[0]);
    }
    
  } catch (error) {
    console.error('❌ API test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error || error.message);
  }
}

// Run the test
testAPIWithKey();
