const { createHash } = require('crypto');
// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('firebase-functions-test')();

const confNotExist = { exists: false, id: 'conf' };
const confData = {
  version: '1.0.0',
  seed: 'test seed',
  invitationExpirationTime: 3 * 24 * 3600 * 1000,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
const confSnapshot = test.firestore.makeDocumentSnapshot(
  confData,
  'document/service/conf',
);

const accountNotExist = { exists: false, id: 'dummy' };
const invalidData = {
  valid: false,
  name: 'Invalid User',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
const invalidSnapshot = test.firestore.makeDocumentSnapshot(
  invalidData,
  'document/accounts/invalid',
);
const deletedData = {
  valid: true,
  name: 'Deleted User',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
  deletedAt: new Date('2022-01-01T00:11:22.333Z'),
};
const deletedSnapshot = test.firestore.makeDocumentSnapshot(
  deletedData,
  'document/accounts/deleted',
);
const user01Data = {
  valid: true,
  name: 'User 01',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
const user01Snapshot = test.firestore.makeDocumentSnapshot(
  user01Data,
  'document/accounts/user01',
);
const adminData = {
  valid: true,
  name: 'User 01',
  admin: true,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
const adminSnapshot = test.firestore.makeDocumentSnapshot(
  adminData,
  'document/accounts/admin',
);

const testInvitation = (
  code,
  seed,
) => {
  const hash = createHash('sha256');
  hash.update(code);
  hash.update(seed);
  return hash.digest('hex');
};

const mockGet = jest.fn();
const mockAdd = jest.fn();
const mockSet = jest.fn();
const mockUpdate = jest.fn();

const createUser = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();
const createCustomToken = jest.fn();

const mockFirebase = () => {
  mockAdd.mockImplementation(() => new Promise((resolve) => {
    resolve({ id: 'created' });
  }));
  mockSet.mockImplementation(() => new Promise((resolve) => {
    resolve({});
  }));
  mockUpdate.mockImplementation(() => new Promise((resolve) => {
    resolve({});
  }));
  createUser.mockImplementation(() => new Promise((resolve) => {
    resolve({ uid: 'created' });
  }));
  updateUser.mockImplementation(() => new Promise((resolve) => {
    resolve({});
  }));
  deleteUser.mockImplementation(() => new Promise((resolve) => {
    resolve({});
  }));
  createCustomToken.mockImplementation(() => new Promise((resolve) => {
    resolve('test token');
  }));

  return {
    firestore: () => ({
      collection: (collection) => ({
        add: (data) => mockAdd({ collection, data }),
        doc: (id) => ({
          get: () => mockGet({ collection, id }),
          set: (data) => mockSet({ collection, id, data }),
          update: (data) => mockUpdate({ collection, id, data }),
        }),
        where: (op1, op2, op3) => ({
          get: () => mockGet({
            collection, op1, op2, op3,
          }),
        }),
        get: () => mockGet({ collection }),
      }),
    }),
    auth: () => ({
      createUser,
      updateUser,
      deleteUser,
      createCustomToken,
    }),
  };
};

module.exports = {
  confNotExist,
  confData,
  confSnapshot,
  accountNotExist,
  invalidData,
  invalidSnapshot,
  deletedData,
  deletedSnapshot,
  user01Data,
  user01Snapshot,
  adminData,
  adminSnapshot,
  testInvitation,
  mockFirebase,
  mockGet,
  mockAdd,
  mockSet,
  mockUpdate,
  createUser,
  updateUser,
  deleteUser,
  createCustomToken,
};
