const { createHash } = require('crypto');
// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');

const testInvitation = (
  code,
  seed,
) => {
  const hash = createHash('sha256');
  hash.update(code);
  hash.update(seed);
  return hash.digest('hex');
};

const mockDocGet = jest.fn();
const mockDocAdd = jest.fn();
const mockDocUpdate = jest.fn();
const mockDocSet = jest.fn();
const mockDocDelete = jest.fn();
const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockCreateCustomToken = jest.fn();
const mockConfExists = jest.fn(() => true);
const mockConfData = jest.fn(() => ({
  invitationExpirationTime: 3 * 24 * 3600 * 1000,
  seed: 'seed value',
  version: '1.0.0',
}));
const mockTs = new Date(new Date().getTime() - 24 * 3600 * 1000);
const mockInvitationCode = nanoid();
const mockInvitationCodeExpired = nanoid();
const mockInvitationCodeNoHost = nanoid();
const mockInvitationCodeNoTime = nanoid();
const mockData = () => ({
  service: mockConfExists() ? { conf: mockConfData() } : {},
  accounts: {
    invalid: {
      valid: false,
      name: 'User invalid',
    },
    deleted: {
      valid: true,
      deletedAt: mockTs,
      name: 'User deleted',
    },
    account01: {
      valid: true,
      name: 'User 01',
    },
    admin: {
      valid: true,
      name: 'Admin',
      admin: true,
    },
    invited: {
      valid: true,
      name: 'User invited',
      invitation: testInvitation(mockInvitationCode, mockConfData().seed),
      invitedBy: 'admin',
      invitedAt: { toDate: () => mockTs },
    },
    invitationNoHost: {
      valid: true,
      name: 'User invititation windout host',
      invitation: testInvitation(mockInvitationCodeNoHost, mockConfData().seed),
      invitedBy: null,
      invitedAt: {
        toDate: () => new Date(mockTs.getTime() - mockConfData().invitationExpirationTime - 1000),
      },
    },
    invitationNoTime: {
      valid: true,
      name: 'User invititation windout invitedAt',
      invitation: testInvitation(mockInvitationCodeNoTime, mockConfData().seed),
      invitedBy: null,
      invitedAt: null,
    },
    invitationExpired: {
      valid: true,
      name: 'User invititation expired',
      invitation: testInvitation(mockInvitationCodeExpired, mockConfData().seed),
      invitedBy: 'admin',
      invitedAt: {
        toDate: () => new Date(mockTs.getTime() - mockConfData().invitationExpirationTime - 1000),
      },
      themeMode: 'dark',
    },
  },
});

const mockGetDocSnapshot = (collection, id) => {
  const col = mockData()[collection];
  if (!col) {
    return null;
  }
  const doc = col[id];
  if (!doc) {
    return { exists: false };
  }
  return {
    exists: true,
    ref: {
      update: (data) => mockDocUpdate(collection, id, data),
    },
    id,
    get: jest.fn((key) => doc[key]),
    data: () => doc,
  };
};

const mockCollectionGet = (collection) => ({
  docs: Object.keys(mockData()[collection]).map(
    (id) => mockGetDocSnapshot(collection, id, mockData()[collection][id]),
  ),
});

const mockWhereGet = (collection, op1, op2, op3) => {
  if (collection === 'accounts') {
    if (op1 === 'invitation' && op2 === '==') {
      const id = Object.keys(mockData()[collection]).find(
        (key) => mockData()[collection][key].invitation === op3,
      );
      return {
        docs: id
          ? [mockGetDocSnapshot(collection, id, mockData()[collection][id])]
          : [],
      };
    }
    return { docs: [] };
  }
  return { docs: [] };
};

const mockFirebase = {
  firestore: () => ({
    collection: (collection) => ({
      add: ({
        accounts: (data) => Promise.resolve().then(() => mockDocAdd(collection, data)),
      })[collection],
      doc: (id) => ({
        get: () => {
          const doc = mockGetDocSnapshot(collection, id);
          return doc
            ? Promise.resolve().then(() => doc)
            : Promise.resolve().then(mockDocGet);
        },
        update: (data) => Promise.resolve().then(() => mockDocUpdate(collection, id, data)),
        set: (data) => Promise.resolve().then(() => mockDocSet(collection, id, data)),
        delete: () => Promise.resolve().then(() => mockDocDelete(collection, id)),
      }),
      get: () => Promise.resolve().then(() => mockCollectionGet(collection)),
      where: (op1, op2, op3) => ({
        get: () => Promise.resolve().then(() => mockWhereGet(collection, op1, op2, op3)),
      }),
    }),
  }),
  auth: () => ({
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    createCustomToken: mockCreateCustomToken,
  }),
};

module.exports = {
  testInvitation,
  mockFirebase,
  mockConfData,
  mockInvitationCode,
  mockInvitationCodeNoHost,
  mockInvitationCodeNoTime,
  mockInvitationCodeExpired,
  mockConfExists,
  mockData,
  mockDocGet,
  mockDocAdd,
  mockDocUpdate,
  mockDocSet,
  mockDocDelete,
  mockCreateUser,
  mockUpdateUser,
  mockCreateCustomToken,
  // firebase,
  // db,
  // auth,
};
