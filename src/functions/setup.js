const { logger } = require('firebase-functions');
const { createHash } = require('crypto');
const { nanoid } = require('nanoid');
const { createUser } = require('./users');

const getConf = async (firebase) => {
  const db = firebase.firestore();
  const conf = await db.collection('service').doc('conf').get();
  return conf && conf.exists ? conf : null;
};

const updateVersion = async (conf, axios) => {
  const res = await axios.get(
    `${conf.get('url')}version.json?check=${new Date().getTime()}`,
  );
  const { version } = res.data;

  if (version !== conf.get('version')) {
    logger.info(version);

    await conf.ref.update({
      version,
      updatedAt: new Date(),
    });

    return true;
  }

  return false;
};

const updateData = async (firebase, conf) => {
  const db = firebase.firestore();
  const dataVersion = conf.get('dataVersion') || 0;

  if (dataVersion === 1) {
    return false;
  }

  // for data version 0
  const accounts = await db.collection('accounts').get();
  await Promise.all(accounts.docs.map(async (doc) => {
    await doc.ref.update({
      themeMode: doc.get('themeMode') || null,
    });
  }));

  // for data version 1
  // for data version 2
  //  ... ...
  // for data version n

  await conf.ref.update({
    dataVersion: 1,
    updatedAt: new Date(),
  });

  return true;
};

const install = async (firebase, email, password, url) => {
  const db = firebase.firestore();
  const name = 'Primary user';

  const ts = new Date();
  const hash = createHash('sha256');
  hash.update(nanoid());
  hash.update(ts.toISOString());
  hash.update(name);
  hash.update(email);
  hash.update(password);
  hash.update(url);
  const seed = hash.digest('hex');

  await db.collection('service').doc('conf').set({
    version: '1.0.0',
    url,
    seed,
    invitationExpirationTime: 3 * 24 * 3600 * 1000,
    policy: `## Heading 2

### Heading 3

The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

<https://flutter.dev/>

[Flutter](https://flutter.dev/)

- List item 1
- List item 2
- List item 3
    1. List item 3.1
    2. List item 3.2
    3. List item 3.3
- List item 4

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog. The quick brown fox  \
jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
`,
    createdAt: ts,
    updatedAt: ts,
  });

  const testers = 'testers';
  const uid = await createUser(
    firebase,
    name,
    true,
    true,
    testers,
    email,
    password,
  );

  await db.collection('groups').doc(testers).set({
    name: 'テスト',
    desc: 'テスト用のグループ',
    accounts: [uid],
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
  });

  return db.collection('service').doc('conf').get();
};

module.exports = {
  getConf,
  updateVersion,
  updateData,
  install,
};
