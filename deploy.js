// Deployment script for DraftBot Dashboard
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Determine environment
const args = process.argv.slice(2);
const isProd = args.includes('--prod') || args.includes('-p');
const env = isProd ? 'production' : 'development';

console.log(`Starting deployment for ${env} environment...`);

try {
  // 1. Install dependencies
  console.log('\nInstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // 2. Build the frontend
  console.log('\nBuilding frontend...');
  if (isProd) {
    execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
  }

  // 3. Start the application
  console.log('\nStarting application...');
  if (isProd) {
    console.log('Running in production mode');
    execSync('npm run start:prod', { stdio: 'inherit' });
  } else {
    console.log('Running in development mode');
    execSync('npm run start', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}