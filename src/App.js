import React from 'react';

function App() {
  console.log('App component is loading...');
  
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#2e7d32' }}>🎾 Tennis App Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <div style={{ 
        backgroundColor: '#4caf50', 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        ✅ App is loading successfully!
      </div>
    </div>
  );
}

export default App;
