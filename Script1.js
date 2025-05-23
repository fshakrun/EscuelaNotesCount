const admin = require('firebase-admin');
const path = require('path');

// Load service account credentials
const serviceAccount = require(path.join(__dirname, 'teacher-escuela-firebase-adminsdk-35q2o-edebf7096d.json'));

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Firestore instance
const db = admin.firestore();

// Function to count individualPlans created in the last 30 days
async function countRecentIndividualPlans() {
    // Calculate date 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    try {
        // Query documents with createdAt >= 30 days ago
        const snapshot = await db.collection('individualPlans')
            .where('createdAt', '>=', thirtyDaysAgo)
            .get();

        const count = snapshot.size;

        // Display the result on the screen (console)
        console.log(`✅ Number of individualPlans created in the last 30 days: ${count}`);
    } catch (error) {
        console.error('❌ Error retrieving data:', error.message);
    }
}

// Run the function
countRecentIndividualPlans();

