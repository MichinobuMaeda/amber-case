const { createHash } = require('crypto');
const { firebase, db, auth } = require('./testConfig');
const {
  createUser,
  setUserName,
  setUserEmail,
  setUserPassword,
  invite,
  getToken,
} = require('./users');

const confRef = db.collection('service').doc('conf');
const ts = new Date('2020-01-01T00:00:00.000Z');
const seed = '0123456789';
const invitationExpirationTime = 3 * 24 * 3600 * 1000;

beforeEach(async () => {
  await confRef.set({
    url: 'http://example.com/version.json',
    seed,
    invitationExpirationTime,
    version: '1.0.0',
    createdAt: ts,
    updatedAt: ts,
  });
});

afterEach(async () => {
  await confRef.delete();
});

afterAll(async () => {
  await firebase.delete();
});

describe('createUser()', () => {
  it('rejects name with length 0.', async () => {
    await expect(createUser(firebase, '', false, false))
      .rejects.toThrow('Param name is missing.');
  });

  it('rejects email with length 0.', async () => {
    await expect(createUser(
      firebase, 'name', false, false, 'group', '',
    )).rejects.toThrow('Param email is empty.');
  });

  it('rejects password with length 0.', async () => {
    await expect(createUser(
      firebase, 'name', false, false, 'group', 'email', '',
    )).rejects.toThrow('Param password is empty.');
  });

  it('creates account with given properties,'
      + ' and returns uid.', async () => {
    const name = 'User 01';

    const uid = await createUser(firebase, name, false, false);

    expect(uid).toBeDefined();
    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('name')).toEqual(name);
    expect(doc.get('admin')).toBeFalsy();
    expect(doc.get('tester')).toBeFalsy();
    expect(doc.get('valid')).toBeTruthy();
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual(name);
    expect(account.email).not.toBeDefined();
    expect(account.passwordHash).not.toBeDefined();

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('creates account with given properties inclueds group,'
      + ' and returns uid.', async () => {
    const name = 'User 01';
    const group = 'group01';

    const uid = await createUser(firebase, name, true, false, group);

    expect(uid).toBeDefined();
    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('name')).toEqual(name);
    expect(doc.get('admin')).toBeTruthy();
    expect(doc.get('tester')).toBeFalsy();
    expect(doc.get('valid')).toBeTruthy();
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual(name);
    expect(account.email).not.toBeDefined();
    expect(account.passwordHash).not.toBeDefined();

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('creates account with given properties inclueds email,'
      + ' and returns uid.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';

    const uid = await createUser(
      firebase, name, false, true, group, email,
    );

    expect(uid).toBeDefined();
    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('name')).toEqual(name);
    expect(doc.get('admin')).toBeFalsy();
    expect(doc.get('tester')).toBeTruthy();
    expect(doc.get('valid')).toBeTruthy();
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual(name);
    expect(account.email).toEqual(email);
    expect(account.passwordHash).not.toBeDefined();

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('creates account with given properties inclueds password,'
      + ' and returns uid.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';
    const password = "account01's password";

    const uid = await createUser(
      firebase, name, false, true, group, email, password,
    );

    expect(uid).toBeDefined();
    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('name')).toEqual(name);
    expect(doc.get('admin')).toBeFalsy();
    expect(doc.get('tester')).toBeTruthy();
    expect(doc.get('valid')).toBeTruthy();
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual(name);
    expect(account.email).toEqual(email);
    expect(account.passwordHash).toBeDefined();

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});

describe('setUserName()', () => {
  it('rejects name with length 0.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const uid = await createUser(firebase, name, true, false, group);

    await expect(setUserName(firebase, uid, ''))
      .rejects.toThrow('Param name is missing.');

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('updates name of doc and auth entry.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const uid = await createUser(firebase, name, true, false, group);
    const newName = 'New name';

    await setUserName(firebase, uid, newName);

    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('name')).toEqual(newName);
    expect(doc.get('updatedAt')).not.toEqual(doc.get('createdAt'));
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual(newName);

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});

describe('setUserEmail()', () => {
  it('rejects email with length 0.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';
    const uid = await createUser(firebase, name, true, false, group, email);

    await expect(setUserEmail(firebase, uid, ''))
      .rejects.toThrow('Param email is empty.');

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('updates email of auth entry.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';
    const uid = await createUser(firebase, name, true, false, group, email);
    const newEmail = 'new@example.com';

    await setUserEmail(firebase, uid, newEmail);

    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('updatedAt')).toEqual(doc.get('createdAt'));
    const account = await auth.getUser(uid);
    await db.collection('accounts').doc(uid).delete();
    expect(account.email).toEqual(newEmail);

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});

describe('setUserPassword()', () => {
  it('rejects password with length 0.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';
    const uid = await createUser(firebase, name, true, false, group, email);

    await expect(setUserPassword(firebase, uid, ''))
      .rejects.toThrow('Param password is empty.');

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
  it('updates password of auth entry.', async () => {
    const name = 'User 01';
    const group = 'group01';
    const email = 'account01@example.com';
    const uid = await createUser(firebase, name, true, false, group, email);
    const password = 'new password';

    await setUserPassword(firebase, uid, password);

    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('updatedAt')).toEqual(doc.get('createdAt'));
    const account = await auth.getUser(uid);
    await db.collection('accounts').doc(uid).delete();
    expect(account.passwordHash).toBeDefined();

    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});

describe('invite()', () => {
  it('creates invitation code and'
      + ' save hashed code, host account id and timestamp,'
      + ' and return invitation code.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);

    const code = await invite(firebase, admin, uid);

    const doc = await db.collection('accounts').doc(uid).get();
    expect(doc.get('updatedAt')).not.toEqual(doc.get('createdAt'));
    const hash = createHash('sha256');
    hash.update(code);
    hash.update(seed);
    expect(doc.get('invitation')).toEqual(hash.digest('hex'));
    expect(doc.get('invitedBy')).toEqual(adminId);
    expect(doc.get('invitedAt')).toEqual(doc.get('updatedAt'));
    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});

describe('getToken()', () => {
  it('rejects invitation without record.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);
    const code = await invite(firebase, admin, uid);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);

    await expect(getToken(firebase, code))
      .rejects.toThrow('No record');

    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
  });

  it('rejects invitation without host account id.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);
    const code = await invite(firebase, admin, uid);
    await db.collection('accounts').doc(uid).update({
      invitedBy: null,
    });

    await expect(getToken(firebase, code))
      .rejects.toThrow(`Invitation for account: ${uid} has invalid status.`);

    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });

  it('rejects invitation without timestamp.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);
    const code = await invite(firebase, admin, uid);
    await db.collection('accounts').doc(uid).update({
      invitedAt: null,
    });

    await expect(getToken(firebase, code))
      .rejects.toThrow(`Invitation for account: ${uid} has invalid status.`);

    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });

  it('rejects invitation with expired timestamp.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);
    const code = await invite(firebase, admin, uid);
    await db.collection('accounts').doc(uid).update({
      invitedAt: new Date(
        new Date().getTime() - invitationExpirationTime - 1000,
      ),
    });

    await expect(getToken(firebase, code))
      .rejects.toThrow(`Invitation for account: ${uid} is expired.`);

    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });

  it('returns token.', async () => {
    const adminId = await createUser(firebase, 'Admin account', true, false);
    const admin = await db.collection('accounts').doc(adminId).get();
    const uid = await createUser(firebase, 'account 01', false, false);
    const code = await invite(firebase, admin, uid);
    await db.collection('accounts').doc(uid).update({
      invitedAt: new Date(
        new Date().getTime() - invitationExpirationTime + 1000,
      ),
    });

    const token = await getToken(firebase, code);

    expect(token).toBeDefined();
    await db.collection('accounts').doc(adminId).delete();
    await auth.deleteUser(adminId);
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});
