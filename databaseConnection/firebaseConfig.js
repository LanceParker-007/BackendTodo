import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('databaseConnection/serviceAccountKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add other Firebase configuration options if needed
});

// Export the initialized Firebase Admin SDK instance
export default admin;
