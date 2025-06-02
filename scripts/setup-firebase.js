#!/usr/bin/env node

/**
 * Firebase Project Setup Helper
 * This script helps you set up your Firebase configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupFirebase() {
  console.log('🚀 Firebase Project Setup Helper');
  console.log('================================\n');
  
  console.log('First, create a new Firebase project at: https://console.firebase.google.com/');
  console.log('Then come back here to configure your environment.\n');
  
  const proceed = await question('Have you created your Firebase project? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\n📋 Steps to create Firebase project:');
    console.log('1. Go to https://console.firebase.google.com/');
    console.log('2. Click "Create a project"');
    console.log('3. Name it "Learnnect Platform"');
    console.log('4. Enable Google Analytics');
    console.log('5. Enable Authentication > Google provider');
    console.log('6. Create Firestore database');
    console.log('7. Add a web app');
    console.log('8. Copy the configuration\n');
    
    process.exit(0);
  }
  
  console.log('\n🔧 Enter your Firebase configuration:');
  console.log('(You can find this in Project Settings > General > Your apps)\n');
  
  const config = {};
  config.apiKey = await question('API Key: ');
  config.authDomain = await question('Auth Domain: ');
  config.projectId = await question('Project ID: ');
  config.storageBucket = await question('Storage Bucket: ');
  config.messagingSenderId = await question('Messaging Sender ID: ');
  config.appId = await question('App ID: ');
  config.measurementId = await question('Measurement ID (optional): ');
  
  // Create .env file
  const envContent = `# Firebase Configuration for Learnnect
# Generated on ${new Date().toISOString()}

VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.appId}
${config.measurementId ? `VITE_FIREBASE_MEASUREMENT_ID=${config.measurementId}` : ''}

# Other environment variables
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
`;

  const envPath = path.join(process.cwd(), '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
    console.log('\nPlease create .env file manually with this content:');
    console.log(envContent);
  }
  
  // Update firebase config file
  const firebaseConfigPath = path.join(process.cwd(), 'src', 'config', 'firebase.ts');
  
  try {
    let firebaseConfigContent = fs.readFileSync(firebaseConfigPath, 'utf8');
    
    // Replace placeholder values
    firebaseConfigContent = firebaseConfigContent
      .replace('"your-new-api-key"', `"${config.apiKey}"`)
      .replace('"your-new-project-id.firebaseapp.com"', `"${config.authDomain}"`)
      .replace('"your-new-project-id"', `"${config.projectId}"`)
      .replace('"your-new-project-id.appspot.com"', `"${config.storageBucket}"`)
      .replace('"your-messaging-sender-id"', `"${config.messagingSenderId}"`)
      .replace('"your-new-app-id"', `"${config.appId}"`)
      .replace('"your-measurement-id"', `"${config.measurementId || ''}"`);
    
    fs.writeFileSync(firebaseConfigPath, firebaseConfigContent);
    console.log('✅ Firebase config file updated!');
  } catch (error) {
    console.error('❌ Error updating firebase config:', error.message);
    console.log('Please update src/config/firebase.ts manually');
  }
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Go to http://localhost:5173/auth');
  console.log('3. Test Google sign-in');
  console.log('4. Check Firebase Console for user data');
  
  console.log('\n🔧 Don\'t forget to:');
  console.log('- Enable Google provider in Firebase Authentication');
  console.log('- Add localhost to authorized domains');
  console.log('- Set up Firestore security rules');
  console.log('- Configure OAuth consent screen');
  
  rl.close();
}

// Run the setup
setupFirebase().catch(error => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});
