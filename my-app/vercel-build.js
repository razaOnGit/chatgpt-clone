const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.VITE_API_URL = 'https://chatgpt-clone-br89.onrender.com';

console.log('Starting build process...');
console.log('Node version:', process.version);
console.log('NPM version:', execSync('npm -v').toString().trim());

// Ensure we're in the right directory
const rootDir = process.cwd();
console.log('Current directory:', rootDir);
console.log('Directory contents:', fs.readdirSync('.'));

try {
  // Install dependencies
  console.log('\nInstalling dependencies...');
  execSync('npm install --prefer-offline --no-audit --progress=false', { 
    stdio: 'inherit',
    cwd: rootDir
  });

  // Run build
  console.log('\nBuilding application...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: rootDir
  });

  // Verify build output
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Build failed: dist directory not found');
  }

  console.log('\nBuild output:', fs.readdirSync(distDir));
  console.log('\n✅ Build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}
