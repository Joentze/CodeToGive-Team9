const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
 
});

const db = admin.firestore();

module.exports = { admin, db };
