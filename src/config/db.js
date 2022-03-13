const admin = require("firebase-admin");
const serviceAccount = require("../secrets/firebase-credentials.json");
require("firebase/firestore");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

module.exports = db;
