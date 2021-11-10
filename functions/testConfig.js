const admin = require('firebase-admin');

// const firebaseConfig = {
//   databaseURL: 'http://localhost:8080',
//   storageBucket: 'amber-case.appspot.com',
//   projectId: 'amber-case',
// };

const firebase = admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  firebase,
  db,
  auth,
};
