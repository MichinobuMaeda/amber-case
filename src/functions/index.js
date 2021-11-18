const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const guard = require('./guard');
const httpApi = require('./api');
const users = require('./users');

const REGION = 'asia-northeast1';

const firebase = admin.initializeApp();
const config = functions.config();

const httpApp = express();
httpApp.use(cors({ origin: true }));
httpApp.use(express.urlencoded({ extended: true }));

exports.api = functions.region(REGION)
  .https.onRequest(httpApi.init(firebase, config, httpApp, axios));

exports.createUser = functions.region(REGION)
  .https.onCall(async (data, context) => {
    await guard.admin(firebase, context.auth?.uid);
    await users.createUser(
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
