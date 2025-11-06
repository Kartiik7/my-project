const admin = require('firebase-admin');

// TODO: Download your Service Account Key JSON from Firebase Project Settings
// and place it in the backend folder. Update the path.
const serviceAccountKeyPath = './serviceAccountKey.json'; 

try {
  const serviceAccount = require(serviceAccountKeyPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK initialized.');
  
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:');
  console.error('Have you downloaded your serviceAccountKey.json file and placed it in the /backend folder?');
  console.error(error.message);
}

module.exports = admin;

