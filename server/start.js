// Backend server starter script
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

// Start the server
console.log('Starting DraftBot Dashboard server...');

const server = spawn('node', [path.join(__dirname, 'index.js')], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});