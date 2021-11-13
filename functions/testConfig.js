const admin = require('firebase-admin');

const firebase = admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  firebase,
  db,
  auth,
};
