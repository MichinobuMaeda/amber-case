// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('firebase-functions-test')();
const axios = require('axios');
const {
  confNotExist,
  confData,
  confSnapshot,
  user01Snapshot,
  adminSnapshot,
  mockGet,
  mockSet,
  mockUpdate,
  mockFirebase,
} = require('./setupTests');
const { createAuthUser } = require('./users');
const {
  getConf,
  updateVersion,
  updateData,
  install,
} = require('./setup');

jest.mock('axios');

jest.mock('./users', () => ({
  ...jest.requireActual('./users'),
  createAuthUser: jest.fn(),
}));

describe('getConf()', () => {
  it('returns null if document "conf" is not exists.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confNotExist); }));
    const conf = await getConf(mockFirebase());
    expect(conf).toBeNull();
  });

  it('returns document "conf" if document "conf" is exists.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    const conf = await getConf(mockFirebase());
    expect(conf).toEqual(confSnapshot);
  });
});

describe('updateVersion()', () => {
  it('returns false and not modifies conf has same version.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: confData.version,
      },
    });

    const ret = await updateVersion(mockFirebase(), confSnapshot, axios);
    expect(ret).toBeFalsy();
    expect(mockUpdate.mock.calls).toEqual([]);
  });

  it('returns true and update conf has old version.', async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.1',
      },
    });
    const ret = await updateVersion(mockFirebase(), confSnapshot, axios);
    expect(ret).toBeTruthy();
    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'service',
      id: 'conf',
      data: {
        version: '1.0.1',
        updatedAt: expect.any(Date),
      },
    }]]);
  });
});

describe('updateData()', () => {
  const latestDataVersion = 1;

  it('proc data update from the current data version to the latest data version '
  + 'and set dataVsersion.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => {
        resolve({ docs: [user01Snapshot, adminSnapshot] });
      }));

    const ret = await updateData(mockFirebase(), confSnapshot);

    expect(ret).toBeTruthy();
    expect(mockUpdate.mock.calls).toEqual([
      [
        {
          collection: 'accounts',
          id: 'user01',
          data: {
            themeMode: null,
            updatedAt: expect.any(Date),
          },
        },
      ],
      [
        {
          collection: 'accounts',
          id: 'admin',
          data: {
            themeMode: null,
            updatedAt: expect.any(Date),
          },
        },
      ],
      [
        {
          collection: 'service',
          id: 'conf',
          data: {
            dataVersion: latestDataVersion,
            updatedAt: expect.any(Date),
          },
        },
      ],
    ]);
  });

  it('do nothing if the current data version id the latest data version.', async () => {
    const testConfSnapshot = test.firestore.makeDocumentSnapshot(
      { ...confData, dataVersion: latestDataVersion },
      'document/service/conf',
    );

    const ret = await updateData(mockFirebase(), testConfSnapshot);

    expect(ret).toBeFalsy();
    expect(mockUpdate.mock.calls).toEqual([]);
  });
});

describe('install()', () => {
  it('create conf, primary account in testers group,'
  + ' and testers group with primary account,'
  + " and returns document 'conf'.", async () => {
    const email = 'primary@example.com';
    const password = "primary's password";
    const url = 'https://example.com';
    createAuthUser
      .mockImplementationOnce(() => new Promise((resolve) => { resolve('id01'); }));
    const testConfData = {
      version: '1.0.0',
      url,
      seed: 'text 1',
      invitationExpirationTime: 3 * 24 * 3600 * 1000,
      copyright: 'text 2',
      policy: 'text 3',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const testConfSnapshot = test.firestore.makeDocumentSnapshot(
      testConfData,
      'document/service/conf',
    );
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(testConfSnapshot); }));

    const ret = await install(mockFirebase(), email, password, url);

    expect(ret.id).toEqual('conf');
    expect(createAuthUser.mock.calls[0][1]).toEqual({
      name: 'Primary user',
      admin: true,
      tester: true,
      group: 'testers',
      email,
      password,
    });
    expect(mockSet.mock.calls).toEqual([
      [
        {
          collection: 'service',
          id: 'conf',
          data: {
            version: '1.0.0',
            url,
            seed: expect.any(String),
            invitationExpirationTime: 3 * 24 * 3600 * 1000,
            copyright: expect.any(String),
            policy: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        },
      ],
      [
        {
          collection: 'groups',
          id: 'testers',
          data: {
            name: 'テスト',
            desc: 'テスト用のグループ',
            accounts: ['id01'],
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
          },
        },
      ],
    ]);
  });
});
