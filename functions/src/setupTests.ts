import { createHash } from 'crypto';
import functionTest from 'firebase-functions-test';

global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

const test = functionTest();

export const confNotExist = { exists: false, id: 'conf' };
export const confData = {
  version: '1.0.0',
  seed: 'test seed',
  invitationExpirationTime: 3 * 24 * 3600 * 1000,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
export const confSnapshot = test.firestore.makeDocumentSnapshot(
  confData,
  'document/service/conf',
);

export const accountNotExist = { exists: false, id: 'dummy' };
export const invalidData = {
  valid: false,
  name: 'Invalid User',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
export const invalidSnapshot = test.firestore.makeDocumentSnapshot(
  invalidData,
  'document/accounts/invalid',
);
export const deletedData = {
  valid: true,
  name: 'Deleted User',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
  deletedAt: new Date('2022-01-01T00:11:22.333Z'),
};
export const deletedSnapshot = test.firestore.makeDocumentSnapshot(
  deletedData,
  'document/accounts/deleted',
);
export const user01Data = {
  valid: true,
  name: 'User 01',
  admin: false,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
export const user01Snapshot = test.firestore.makeDocumentSnapshot(
  user01Data,
  'document/accounts/user01',
);
export const adminData = {
  valid: true,
  name: 'User 01',
  admin: true,
  createdAt: new Date('2020-01-01T01:23:45.678Z'),
  updatedAt: new Date('2021-01-01T00:11:22.333Z'),
};
export const adminSnapshot = test.firestore.makeDocumentSnapshot(
  adminData,
  'document/accounts/admin',
);

export const testInvitation = (
  code: string,
  seed: string,
) => {
  const hash = createHash('sha256');
  hash.update(code);
  hash.update(seed);
  return hash.digest('hex');
};

export const mockGet = jest.fn();
export const mockAdd = jest.fn();
export const mockSet = jest.fn();
export const mockUpdate = jest.fn();

export const createUser = jest.fn();
export const updateUser = jest.fn();
export const deleteUser = jest.fn();
export const createCustomToken = jest.fn();

export const mockFirebase = () => {
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
      collection: (collection: string) => ({
        add: (data: any) => mockAdd({ collection, data }),
        doc: (id: string) => ({
          get: () => mockGet({ collection, id }),
          set: (data: any) => mockSet({ collection, id, data }),
          update: (data: any) => mockUpdate({ collection, id, data }),
        }),
        where: (op1: any, op2: any, op3: any) => ({
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
