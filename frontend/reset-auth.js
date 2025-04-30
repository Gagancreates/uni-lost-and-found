// Script to reset authentication state for debugging
const fs = require('fs');
const path = require('path');

// Clear localStorage in development
console.log('This script helps reset authentication state during development.');
console.log('Add this code to your development environment to clear auth tokens:');
console.log(`
// In browser console:
localStorage.removeItem('authToken');
localStorage.removeItem('user');

// Or in your React component:
import { useEffect } from 'react';

useEffect(() => {
  // Reset auth state
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Redirect to login
  window.location.href = '/login';
}, []);
`);

// Check for .next directory and suggest clearing it
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('\nYou may also want to clear the Next.js cache:');
  console.log('npm run clean');
  console.log('# or manually:');
  console.log('rm -rf .next');
}

console.log('\nAfter clearing auth state, restart your development server:');
console.log('npm run dev'); 