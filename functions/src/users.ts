import { logger, Change } from 'firebase-functions';
import { auth, firestore } from 'firebase-admin';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

export interface UserData {
  name: string,
  admin?: boolean,
  tester?: boolean,
  group?: string,
  email?: string,
  password?: string,
}

export interface UserProfile {
  uid: string,
  displayName: string,
  email: string,
  password: string,
}

export const createAuthUser = async (
  firebase: any,
  {
    name, admin, tester, group, email, password,
  }: UserData,
) => {
  logger.info({
    name, admin, tester, group, email, password: !!password,
  });

  if (name.trim().length === 0) {
    throw new Error('Param name is missing.');
  }

  if (email?.trim().length === 0) {
    throw new Error('Param email is empty.');
  }

  if (password?.length === 0) {
    throw new Error('Param password is empty.');
  }

  const db = firebase.firestore();
  const ts = new Date();

  const account = await db.collection('accounts').add({
    name,
    valid: true,
    admin,
    tester,
    group: group || null,
    themeMode: null, // added: dataVersion: 1
    invitation: null,
    invitedBy: null,
    invitedAt: null,
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
  });

  const uid = account.id;
  const displayName = name;

  const profile = { uid, displayName } as UserProfile;
  if (email) {
    profile.email = email;
    if (password) {
      profile.password = password;
    }
  }
  await firebase.auth().createUser(profile);

  await db.collection('people').doc(uid).set({
    groups: group ? [group] : [],
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
  });

  return uid;
};

export const setUserName = async (
  firebase: any,
  uid: string,
  name: string,
) => {
  if (name.length === 0) {
    throw new Error('Param name is missing.');
  }

  const db = firebase.firestore();

  await firebase.auth().updateUser(uid, { displayName: name });
  await db.collection('accounts').doc(uid).update({
    name,
    updatedAt: new Date(),
  });
};

export const setUserEmail = async (
  firebase: any,
  uid: string,
  email: string,
) => {
  if (email.length === 0) {
    throw new Error('Param email is empty.');
  }

  logger.info(`setUserEmail: ${uid}, ${email}`);
  await firebase.auth().updateUser(uid, { email });
};

export const setUserPassword = async (
  firebase: any,
  uid: string,
  password: string,
) => {
  if (password.length === 0) {
    throw new Error('Param password is empty.');
  }

  logger.info(`setUserPassword: ${uid}`);
  await firebase.auth().updateUser(uid, { password });
};

export const calcInvitation = (
  code: string,
  seed: string,
) => {
  const hash = createHash('sha256');
  hash.update(code);
  hash.update(seed);
  return hash.digest('hex');
};

export const invite = async (
  firebase: any,
  uid: string,
  invitee: string,
) => {
  const db = firebase.firestore();
  const invitedBy = uid;

  logger.info(`setUserEmail ${JSON.stringify({ invitedBy, invitee })}`);
  const conf = await db.collection('service').doc('conf').get();
  const code = nanoid();
  const ts = new Date();
  const invitation = calcInvitation(code, conf.get('seed'));
  await db.collection('accounts').doc(invitee).update({
    invitation,
    invitedBy,
    invitedAt: ts,
    updatedAt: ts,
  });
  return code;
};

export const getToken = async (
  firebase: any,
  code: string,
) => {
  const db = firebase.firestore();

  logger.info(`getToken: ${code}`);
  const conf = await db.collection('service').doc('conf').get();
  const invitation = calcInvitation(code, conf.get('seed'));
  const accounts = await db.collection('accounts')
    .where('invitation', '==', invitation).get();
  if (accounts.docs.length !== 1) {
    throw new Error('No record');
  }
  const account = accounts.docs[0];
  const accountRef = db.collection('accounts').doc(account.id);
  if (!account.get('invitedAt') || !account.get('invitedBy')) {
    await accountRef.update({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
      updatedAt: new Date(),
    });
    throw new Error(
      `Invitation for account: ${account.id} has invalid status.`,
    );
  }
  const expired = new Date().getTime() - conf.get('invitationExpirationTime');
  if (account.get('invitedAt').toDate().getTime() < expired) {
    await accountRef.update({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
      updatedAt: new Date(),
    });
    throw new Error(`Invitation for account: ${account.id} is expired.`);
  }
  const token = await firebase.auth().createCustomToken(account.id);
  logger.info(`Invited account: ${account.id} get token: ${token}`);
  return token;
};

export const onCreateAuthUser = async (
  firebase: any,
  user: auth.UserRecord,
) => {
  const db = firebase.firestore();
  const account = await db.collection('accounts').doc(user.uid).get();
  if (account.exists) {
    return true;
  }

  await firebase.auth().deleteUser(user.uid);
  logger.warn(`deleted: ${user.uid}`);
  return false;
};

export const onAccountUpdate = async (
  firebase: any,
  change: Change<firestore.DocumentSnapshot>,
) => {
  if (change.before.data()!.name !== change.after.data()!.name) {
    await firebase.auth().updateUser(change.after.id, { displayName: change.after.data()!.name });
  }
};
