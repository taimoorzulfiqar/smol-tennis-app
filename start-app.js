const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Tennis App...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  console.log('🌐 Starting frontend...');
  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend error:', error);
  });

  frontend.on('close', (code) => {
    console.log(`🌐 Frontend exited with code ${code}`);
  });
}, 3000);

backend.on('error', (error) => {
  console.error('❌ Backend error:', error);
});

backend.on('close', (code) => {
  console.log(`📡 Backend exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});
