import { config, region } from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { adminUser } from './guard';
import * as users from './users';
import {
  setup,
} from './api';

const REGION = 'asia-northeast1';

const firebase = admin.initializeApp();

const httpApp = express();
httpApp.use(cors({ origin: true }));
httpApp.use(express.urlencoded({ extended: true }));
httpApp.get('/setup', setup(firebase, axios, config()));

export const api = region(REGION).https.onRequest(httpApp);

export const createAuthUser = region(REGION)
  .https.onCall(async (data: any, context) => {
    await adminUser(firebase, context.auth?.uid ?? '');
    await users.createAuthUser(
      firebase,
      {
        name: data.name || '',
        admin: data.admin || false,
        tester: data.tester || false,
      },
    );
  });

export const setUserName = region(REGION)
  .https.onCall(async (data: any, context) => {
    await adminUser(firebase, context.auth?.uid ?? '');
    await users.setUserName(
      firebase,
      data.uid || '',
      data.name || '',
    );
  });

export const setUserEmail = region(REGION)
  .https.onCall(async (data: any, context) => {
    await adminUser(firebase, context.auth?.uid ?? '');
    await users.setUserEmail(
      firebase,
      data.uid || '',
      data.email || '',
    );
  });

export const setUserPassword = region(REGION)
  .https.onCall(async (data: any, context) => {
    await adminUser(firebase, context.auth?.uid ?? '');
    await users.setUserPassword(
      firebase,
      data.uid || '',
      data.password || '',
    );
  });

// Warning: Firebase Authentication triggers were beta at 2021-11-21.
export const onCreateAuthUser = region(REGION)
  .auth.user().onCreate((user) => users.onCreateAuthUser(firebase, user));

export const onUpdateAccount = region(REGION)
  .firestore.document('accounts/{accountId}')
  .onUpdate((change) => users.onAccountUpdate(firebase, change));
