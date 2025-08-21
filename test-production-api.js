// Test script to verify production API endpoint
const axios = require('axios');

async function testProductionAPI() {
  const baseUrl = 'https://experttennisacademy.xyz'; // Your custom domain
  const spreadsheetId = '1LEk1FWjg2totERwT2lG-vQPlmeopktk6z3B8GU622jU';
  
  try {
    console.log('Testing production API endpoint...');
    console.log(`URL: ${baseUrl}/api/sheets`);
    
    const response = await axios.get(`${baseUrl}/api/sheets`, {
      params: {
        spreadsheetId,
        range: 'Men!A:Z',
        useServiceAccount: 'true'
      }
    });
    
    console.log('✅ API is working!');
    console.log('Response status:', response.status);
    console.log('Data received:', response.data.values ? `${response.data.values.length} rows` : 'No data');
    
    if (response.data.values && response.data.values.length > 0) {
      console.log('First row:', response.data.values[0]);
    }
    
  } catch (error) {
    console.error('❌ API test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n🔧 This usually means:');
      console.log('1. Environment variables not set in Vercel');
      console.log('2. Service account key is invalid');
      console.log('3. Google Sheets API not enabled');
    }
    
    if (error.response?.status === 403) {
      console.log('\n🔧 This usually means:');
      console.log('1. Service account doesn\'t have access to the spreadsheet');
      console.log('2. Need to share the spreadsheet with: tennis-app@sending-emails-468010.iam.gserviceaccount.com');
    }
    
    if (error.response?.status === 404) {
      console.log('\n🔧 This usually means:');
      console.log('1. API route not deployed properly');
      console.log('2. Check if /api/sheets.js exists in your Vercel deployment');
    }
  }
}

// Run the test
testProductionAPI();
