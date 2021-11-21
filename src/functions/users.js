const { logger } = require('firebase-functions');
const { createHash } = require('crypto');
const { nanoid } = require('nanoid');

const createUser = async (firebase, name, admin, tester, group, email, password) => {
  logger.info({
    name, admin, tester, group, email, password: !!password,
  });
  const db = firebase.firestore();
  const auth = firebase.auth();

  if (name.length === 0) {
    throw new Error('Param name is missing.');
  }

  if (email?.length === 0) {
    throw new Error('Param email is empty.');
  }

  if (password?.length === 0) {
    throw new Error('Param password is empty.');
  }

  const ts = new Date();

  const account = await db.collection('accounts').add({
    name,
    valid: true,
    admin,
    tester,
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

  const profile = { uid, displayName };
  if (email) {
    profile.email = email;
    if (password) {
      profile.password = password;
    }
  }
  await auth.createUser(profile);

  await db.collection('people').doc(uid).set({
    groups: group ? [group] : [],
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
  });

  return uid;
};

const setUserName = async (firebase, uid, name) => {
  const db = firebase.firestore();
  const auth = firebase.auth();

  if (name.length === 0) {
    throw new Error('Param name is missing.');
  }

  await auth.updateUser(uid, { displayName: name });
  await db.collection('accounts').doc(uid).update({
    name,
    updatedAt: new Date(),
  });
};

const setUserEmail = async (firebase, uid, email) => {
  const auth = firebase.auth();

  if (email.length === 0) {
    throw new Error('Param email is empty.');
  }

  logger.info(`setUserEmail: ${uid}, ${email}`);
  await auth.updateUser(uid, { email });
};

const setUserPassword = async (firebase, uid, password) => {
  const auth = firebase.auth();

  if (password.length === 0) {
    throw new Error('Param password is empty.');
  }

  logger.info(`setUserPassword: ${uid}`);
  await auth.updateUser(uid, { password });
};

const calcInvitation = (
  code,
  seed,
) => {
  const hash = createHash('sha256');
  hash.update(code);
  hash.update(seed);
  return hash.digest('hex');
};

const invite = async (firebase, caller, uid) => {
  const db = firebase.firestore();
  const invitedBy = caller.id;

  logger.info(`setUserEmail ${JSON.stringify({ invitedBy, uid })}`);
  const conf = await db.collection('service').doc('conf').get();
  const code = nanoid();
  const ts = new Date();
  const invitation = calcInvitation(code, conf.get('seed'));
  await db.collection('accounts').doc(uid).update({
    invitation,
    invitedBy,
    invitedAt: ts,
    updatedAt: ts,
  });
  return code;
};

const getToken = async (firebase, code) => {
  const db = firebase.firestore();
  const auth = firebase.auth();

  logger.info(`getToken: ${code}`);
  const conf = await db.collection('service').doc('conf').get();
  const invitation = calcInvitation(code, conf.get('seed'));
  const accounts = await db.collection('accounts')
    .where('invitation', '==', invitation).get();
  if (accounts.docs.length !== 1) {
    throw new Error('No record');
  }
  const account = accounts.docs[0];
  if (!account.get('invitedAt') || !account.get('invitedBy')) {
    await account.ref.update({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
    });
    throw new Error(
      `Invitation for account: ${account.id} has invalid status.`,
    );
  }
  const expired = new Date().getTime() - conf.get('invitationExpirationTime');
  if (account.get('invitedAt').toDate().getTime() < expired) {
    await account.ref.update({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
    });
    throw new Error(`Invitation for account: ${account.id} is expired.`);
  }
  const token = await auth.createCustomToken(account.id);
  logger.info(`Invited account: ${account.id} get token: ${token}`);
  return token;
};

const onCreateAuthUser = async (firebase, user) => {
  const db = firebase.firestore();
  const account = await db.collection('accounts').doc(user.uid).get();
  if (account && account.exists) {
    return true;
  }

  const auth = firebase.auth();
  await auth.deleteUser(user.uid);
  logger.warn(`deleted: ${user.uid}`);
  return false;
};

const onAccountUpdate = async (firebase, change) => {
  const auth = firebase.auth();
  if (change.before.data().name !== change.after.data().name) {
    await auth.updateUser(change.after.id, { displayName: change.after.data().name });
  }
};

module.exports = {
  createUser,
  setUserName,
  setUserEmail,
  setUserPassword,
  invite,
  getToken,
  onCreateAuthUser,
  onAccountUpdate,
};
