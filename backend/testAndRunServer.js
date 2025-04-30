// Script to test database connection before starting the server
const { execSync } = require('child_process');
const { join } = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}Testing database connection...${colors.reset}`);

try {
  // Run the database connection test
  execSync('npx ts-node src/utils/testDbConnection.ts', { stdio: 'inherit' });
  
  console.log(`${colors.green}Database connection successful! Starting server...${colors.reset}`);
  
  // Start the server
  console.log(`${colors.blue}Starting server...${colors.reset}`);
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  console.log(`${colors.yellow}Database connection failed. Please check your MongoDB connection settings in .env file.${colors.reset}`);
  process.exit(1);
} 