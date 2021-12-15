const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const guard = require('./guard');
const users = require('./users');
const { setup } = require('./api');

const REGION = 'asia-northeast1';

const firebase = admin.initializeApp();
const config = functions.config();

const httpApp = express();
httpApp.use(cors({ origin: true }));
httpApp.use(express.urlencoded({ extended: true }));
httpApp.get('/setup', setup(firebase, axios, config));

exports.api = functions.region(REGION).https.onRequest(httpApp);

exports.createAuthUser = functions.region(REGION)
  .https.onCall(async (data, context) => {
    await guard.admin(firebase, context.auth?.uid);
    await users.createAuthUser(
      firebase,
      data.name || '',
      data.admin || false,
      data.tester || false,
    );
  });

exports.setUserName = functions.region(REGION)
  .https.onCall(async (data, context) => {
    await guard.admin(firebase, context.auth?.uid);
    await users.setUserName(
      firebase,
      data.uid || '',
      data.name || '',
    );
  });

exports.setUserEmail = functions.region(REGION)
  .https.onCall(async (data, context) => {
    await guard.admin(firebase, context.auth?.uid);
    await users.setUserName(
      firebase,
      data.uid || '',
      data.email || '',
    );
  });

exports.setUserPassword = functions.region(REGION)
  .https.onCall(async (data, context) => {
    await guard.admin(firebase, context.auth?.uid);
    await users.setUserName(
      firebase,
      data.uid || '',
      data.password || '',
    );
  });

// Warning: Firebase Authentication triggers were beta at 2021-11-21.
exports.onCreateAuthUser = functions.region(REGION)
  .auth.user().onCreate((user) => users.onCreateAuthUser(firebase, user));

exports.onUpdateAccount = functions.region(REGION)
  .firestore.document('accounts/{accountId}')
  .onUpdate((change) => users.onAccountUpdate(firebase, change));
