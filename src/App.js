import React from 'react';

function App() {
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '50px',
      textAlign: 'center',
      fontSize: '24px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>🎾 TENNIS APP WORKS!</h1>
      <p>If you can see this red page, React is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;
