import { storage, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Test Firebase Storage and Firestore connectivity
 */
export const testFirebaseConnection = async (): Promise<{
  storage: boolean;
  firestore: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];
  let storageWorking = false;
  let firestoreWorking = false;

  // Test Firestore
  try {
    console.log('🔍 Testing Firestore connection...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase test',
      timestamp: new Date()
    });
    console.log('✅ Firestore test successful:', testDoc.id);
    firestoreWorking = true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    errors.push(`Firestore: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test Storage
  try {
    console.log('🔍 Testing Firebase Storage...');
    
    // Create a small test file
    const testContent = 'Firebase Storage test file';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const testRef = ref(storage, `test/firebase-test-${Date.now()}.txt`);
    const uploadResult = await uploadBytes(testRef, testFile);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    console.log('✅ Firebase Storage test successful:', downloadURL);
    storageWorking = true;
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error);
    errors.push(`Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    storage: storageWorking,
    firestore: firestoreWorking,
    errors
  };
};

/**
 * Check Firebase Storage rules and configuration
 */
export const checkStorageRules = () => {
  console.log('📋 Firebase Storage Rules Check:');
  console.log('Make sure your Firebase Storage rules allow authenticated users to upload:');
  console.log(`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
  `);
  
  console.log('📋 CORS Configuration:');
  console.log('If you get CORS errors, run this command in your terminal:');
  console.log('gsutil cors set cors.json gs://your-bucket-name');
  console.log('Where cors.json contains:');
  console.log(`
[
  {
    "origin": ["http://localhost:5173", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
  `);
};

export default { testFirebaseConnection, checkStorageRules };
