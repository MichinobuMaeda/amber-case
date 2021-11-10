const axios = require('axios');
const { firebase, db, auth } = require('./testConfig');
const {
  getConf,
  updateVersion,
  updateData,
  install,
} = require('./setup');

jest.mock('axios');

const confRef = db.collection('service').doc('conf');
const ts = new Date('2020-01-01T00:00:00.000Z');

beforeEach(async () => {
  await confRef.set({
    version: '1.0.0',
    url: 'http://example.com/version.json',
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

describe('getConf()', () => {
  it('returns null if document "conf" is not exists.', async () => {
    await confRef.delete();
    const conf = await getConf(firebase);
    expect(conf).toBeNull();
  });
  it('returns document "conf" if document "conf" is not exists.', async () => {
    const conf = await getConf(firebase);
    expect(conf.id).toEqual('conf');
  });
});

describe('updateVersion()', () => {
  it('returns false and not modifies conf'
      + ' has same version and build_number.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });
    const ret = await updateVersion(await confRef.get(), axios);
    expect(ret).toBeFalsy();
    const conf = await confRef.get();
    expect(conf.get('version')).toEqual('1.0.0');
    expect(conf.get('updatedAt').toDate()).toEqual(ts);
  });
  it('returns true and update conf has old version.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.1',
      },
    });
    const ret = await updateVersion(await confRef.get(), axios);
    expect(ret).toBeTruthy();
    const conf = await confRef.get();
    expect(conf.get('version')).toEqual('1.0.1');
    expect(conf.get('updatedAt').toDate()).not.toEqual(ts);
  });
});

describe('updateData()', () => {
  const latestDataVersion = 1;
  it('set dataVsersion.', async () => {
    const ret = await updateData(firebase, await confRef.get());
    expect(ret).toBeTruthy();
    const conf = await confRef.get();
    expect(conf.get('dataVersion')).toEqual(latestDataVersion);
  });
  it('do nothing for latest dataVersion.', async () => {
    await updateData(firebase, await confRef.get());
    const ret0 = await updateData(firebase, await confRef.get());
    expect(ret0).toBeTruthy();
    const conf0 = await confRef.get();
    expect(conf0.get('dataVersion')).toEqual(latestDataVersion);
  });
  // for dataVersion: latest - 1
  // for dataVersion: latest - 2
  // ...
  // for dataVersion: 2
  // for dataVersion: 1
  it("add accounts 'themeMode' for dataVersion: 0.", async () => {
    await confRef.update({
      dataVersion: 0,
    });
    const account01Ref = db.collection('accounts').doc('account01');
    const account02Ref = db.collection('accounts').doc('account02');
    await account01Ref.set({
      valid: true,
      name: 'Account 1',
      admin: true,
      tester: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await account02Ref.set({
      valid: true,
      name: 'Account 2',
      admin: true,
      tester: true,
      themeMode: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ret = await updateData(firebase, await confRef.get());

    expect(ret).toBeTruthy();
    const conf = await confRef.get();
    expect(conf.get('dataVersion')).toEqual(1);
    const account01 = await account01Ref.get();
    const account02 = await account02Ref.get();
    expect(account01.get('themeMode')).toBeNull();
    expect(account02.get('themeMode')).toEqual('dark');

    await account01Ref.delete();
    await account02Ref.delete();
  });
});

describe('install()', () => {
  it('create conf, primary account in testers group,'
      + ' and testers group with primary account,'
      + " and returns document 'conf'.", async () => {
    const email = 'primary@example.com';
    const password = "primary's password";
    const url = 'https://example.com';
    await confRef.delete();
    const conf = await install(firebase, email, password, url);
    expect(conf.id).toEqual('conf');
    expect(conf.get('url')).toEqual(url);
    expect(conf.get('seed')).toBeDefined();
    const testers = await db.collection('groups').doc('testers').get();
    expect(testers.get('accounts')).toHaveLength(1);
    const uid = testers.get('accounts')[0];
    const primary = await db.collection('accounts').doc(uid).get();
    expect(primary.get('name')).toEqual('Primary user');
    expect(primary.get('admin')).toBeTruthy();
    expect(primary.get('tester')).toBeTruthy();
    expect(primary.get('valid')).toBeTruthy();
    const account = await auth.getUser(uid);
    expect(account.displayName).toEqual('Primary user');
    expect(account.email).toEqual(email);
    expect(account.passwordHash).toBeDefined();
    await db.collection('accounts').doc(uid).delete();
    await auth.deleteUser(uid);
  });
});
