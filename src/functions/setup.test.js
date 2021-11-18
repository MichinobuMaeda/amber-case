const axios = require('axios');
const {
  mockFirebase,
  mockConfExists,
  mockDocAdd,
  mockDocSet,
  mockDocUpdate,
  mockConfData,
  mockData,
} = require('./testConfig');
const {
  getConf,
  updateVersion,
  updateData,
  install,
} = require('./setup');

jest.mock('axios');

afterEach(async () => {
  jest.clearAllMocks();
});

describe('getConf()', () => {
  mockConfExists.mockImplementationOnce(() => false);
  it('returns null if document "conf" is not exists.', async () => {
    const conf = await getConf(mockFirebase);
    expect(conf).toBeNull();
  });

  it('returns document "conf" if document "conf" is exists.', async () => {
    const conf = await getConf(mockFirebase);
    expect(conf.id).toEqual('conf');
  });
});

describe('updateVersion()', () => {
  it('returns false and not modifies conf has same version.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });
    const confRef = mockFirebase.firestore().collection('service').doc('conf');
    const ret = await updateVersion(await confRef.get(), axios);
    expect(ret).toBeFalsy();
    expect(mockDocUpdate.mock.calls.length).toEqual(0);
  });

  it('returns true and update conf has old version.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.1',
      },
    });
    const confRef = mockFirebase.firestore().collection('service').doc('conf');
    const ret = await updateVersion(await confRef.get(), axios);
    expect(ret).toBeTruthy();
    expect(mockDocUpdate.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('service');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual('conf');
    expect(mockDocUpdate.mock.calls[0][2].version).toEqual('1.0.1');
    expect(mockDocUpdate.mock.calls[0][2].updatedAt).toBeDefined();
  });
});

describe('updateData()', () => {
  const latestDataVersion = 1;

  it('proc data update from the current data version to the latest data version '
  + 'and set dataVsersion.', async () => {
    const confRef = mockFirebase.firestore().collection('service').doc('conf');
    const ret = await updateData(mockFirebase, await confRef.get());
    expect(ret).toBeTruthy();
    expect(mockDocUpdate.mock.calls.length).toEqual(
      Object.keys(mockData().accounts).length + 1,
    );
    const seqConuUpdate = Object.keys(mockData().accounts).length;
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][2].themeMode).toEqual(null);
    expect(mockDocUpdate.mock.calls[0][2].updatedAt).not.toBeDefined();
    expect(mockDocUpdate.mock.calls[seqConuUpdate - 1][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[seqConuUpdate - 1][2].themeMode).toEqual('dark');
    expect(mockDocUpdate.mock.calls[seqConuUpdate - 1][2].updatedAt).not.toBeDefined();
    expect(mockDocUpdate.mock.calls[seqConuUpdate][0]).toEqual('service');
    expect(mockDocUpdate.mock.calls[seqConuUpdate][1]).toEqual('conf');
    expect(mockDocUpdate.mock.calls[seqConuUpdate][2].dataVersion).toEqual(latestDataVersion);
    expect(mockDocUpdate.mock.calls[seqConuUpdate][2].updatedAt).toBeDefined();
  });

  it('do nothing if the current data version id the latest data version.', async () => {
    mockConfData.mockImplementationOnce(() => ({
      invitationExpirationTime: 3 * 24 * 3600 * 1000,
      seed: 'seed value',
      version: '1.0.0',
      dataVersion: 1,
    }));
    const confRef = mockFirebase.firestore().collection('service').doc('conf');
    const ret = await updateData(mockFirebase, await confRef.get());
    expect(ret).toBeFalsy();
    expect(mockDocUpdate.mock.calls.length).toEqual(0);
  });
});

describe('install()', () => {
  it('create conf, primary account in testers group,'
  + ' and testers group with primary account,'
  + " and returns document 'conf'.", async () => {
    const email = 'primary@example.com';
    const password = "primary's password";
    const url = 'https://example.com';
    const uid = 'id01';
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));

    const ret = await install(mockFirebase, email, password, url);

    expect(mockDocSet.mock.calls.length).toEqual(3);
    expect(mockDocSet.mock.calls[0][0]).toEqual('service');
    expect(mockDocSet.mock.calls[0][1]).toEqual('conf');
    expect(mockDocSet.mock.calls[0][2].version).toEqual('1.0.0');
    expect(mockDocSet.mock.calls[0][2].url).toEqual(url);
    expect(mockDocSet.mock.calls[0][2].seed).toBeDefined();
    expect(mockDocSet.mock.calls[0][2].invitationExpirationTime).toBeGreaterThan(0);
    expect(mockDocSet.mock.calls[0][2].policy).toBeDefined();
    expect(mockDocSet.mock.calls[0][2].createdAt).toBeDefined();
    expect(mockDocSet.mock.calls[0][2].updatedAt).toBeDefined();

    expect(mockDocAdd.mock.calls.length).toEqual(1);
    expect(mockDocAdd.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocAdd.mock.calls[0][1].name).toEqual('Primary user');

    expect(mockDocSet.mock.calls[1][0]).toEqual('people');
    expect(mockDocSet.mock.calls[1][1]).toEqual(uid);

    expect(mockDocSet.mock.calls[2][0]).toEqual('groups');
    expect(mockDocSet.mock.calls[2][1]).toEqual('testers');
    expect(mockDocSet.mock.calls[2][2].name).toEqual('テスト');
    expect(mockDocSet.mock.calls[2][2].desc).toEqual('テスト用のグループ');
    expect(mockDocSet.mock.calls[2][2].accounts).toEqual([uid]);
    expect(mockDocSet.mock.calls[2][2].createdAt).toBeDefined();
    expect(mockDocSet.mock.calls[2][2].updatedAt).toBeDefined();

    expect(ret.id).toEqual('conf');
  });
});
