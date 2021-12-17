import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Unsubscribe } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import {
  initializeMock, mockContext,
} from '../setupTests';
import {
  initializeFirebase,
  unsubUserData,
  castDoc,
  mergeUpdatedDocs,
} from './firebase';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  connectAuthEmulator: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  connectStorageEmulator: jest.fn(),
}));

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  connectFunctionsEmulator: jest.fn(),
}));

beforeEach(() => {
  getAuth.mockImplementation(() => ({}));
  getFirestore.mockImplementation(() => ({}));
  getStorage.mockImplementation(() => ({}));
  getFunctions.mockImplementation(() => ({}));
  initializeMock();
});

describe('initializeFirebase(firebaseConfig)', () => {
  it('not use emulator if firebase api key is production.', () => {
    initializeFirebase({ apiKey: 'production api key' });
    expect(connectAuthEmulator.mock.calls.length).toEqual(0);
    expect(connectFirestoreEmulator.mock.calls.length).toEqual(0);
    expect(connectStorageEmulator.mock.calls.length).toEqual(0);
    expect(connectFunctionsEmulator.mock.calls.length).toEqual(0);
  });

  it('use emulator if firebase api key is not production.', () => {
    initializeFirebase({ apiKey: 'FIREBASE_API_KEY' });
    expect(connectAuthEmulator.mock.calls.length).toEqual(1);
    expect(connectFirestoreEmulator.mock.calls.length).toEqual(1);
    expect(connectStorageEmulator.mock.calls.length).toEqual(1);
    expect(connectFunctionsEmulator.mock.calls.length).toEqual(1);
  });
});

describe('unsubUserData(context)', () => {
  it('exec each unsub functions and delete them all.', async () => {
    const unsub1 = jest.fn();
    const unsub2 = jest.fn();
    mockContext.unsub = new Map<string, Unsubscribe>(Object.entries({
      unsub1,
      unsub2,
    }));
    unsubUserData(mockContext);
    expect(unsub1.mock.calls.length).toEqual(1);
    expect(unsub2.mock.calls.length).toEqual(1);
    expect(Object.keys(mockContext.unsub).length).toEqual(0);
  });
});

describe('castDoc(doc)', () => {
  it('return {} if doc is null or doc is not exists.', async () => {
    expect(castDoc(null)).toEqual({});
    expect(castDoc({ exists: () => false })).toEqual({});
  });

  it('return an object with id and members of doc.data().', async () => {
    expect(castDoc({
      exists: () => true,
      id: 'id01',
      data: () => ({}),
    })).toEqual({
      id: 'id01',
    });
    expect(castDoc({
      exists: () => true,
      id: 'id02',
      data: () => ({
        test1: null,
        test2: 1,
        test3: 'a',
        test4: ['1'],
        test5: { a: 1, b: 2 },
      }),
    })).toEqual({
      id: 'id02',
      test1: null,
      test2: 1,
      test3: 'a',
      test4: ['1'],
      test5: { a: 1, b: 2 },
    });
  });

  it('replace member with .toDate() to Date object.', async () => {
    const ts1 = new Date('2020-01-01T00:00:00.001Z');
    const ts2 = new Date('2020-01-01T00:00:00.002Z');
    const ts3 = new Date('2020-01-01T00:00:00.003Z');
    const ts4 = new Date('2020-01-01T00:00:00.004Z');
    const ts5 = new Date('2020-01-01T00:00:00.005Z');
    const ts6 = new Date('2020-01-01T00:00:00.006Z');
    const ts7 = new Date('2020-01-01T00:00:00.007Z');
    expect(castDoc({
      exists: () => true,
      id: 'id03',
      data: () => ({
        test1: { toDate: () => ts1 },
        test2: [
          { toDate: () => ts2 },
          [{ toDate: () => ts3 }],
          {
            a: { toDate: () => ts4 },
          },
        ],
        test3: {
          a: { toDate: () => ts5 },
          b: [{ toDate: () => ts6 }],
          c: {
            a: { toDate: () => ts7 },
          },
        },
      }),
    })).toEqual({
      id: 'id03',
      test1: ts1,
      test2: [
        ts2,
        [ts3],
        {
          a: ts4,
        },
      ],
      test3: {
        a: ts5,
        b: [ts6],
        c: {
          a: ts7,
        },
      },
    });
  });
});

describe('mergeUpdatedDocs(snapshot, old)', () => {
  it('merges added docs and modified docs and delete removed docs from old.', () => {
    const old = [
      {
        id: 'id01',
        key01: 'value01',
      },
      {
        id: 'id02',
        key02: 'value02',
      },
      {
        id: 'id03',
        key03: 'value03',
      },
      {
        id: 'id04',
        key04: 'value04',
      },
    ];
    const snapshot = {
      docChanges: () => [
        {
          type: 'added',
          doc: {
            id: 'id01',
            exists: () => true,
            data: () => ({
              key011: 'value011',
            }),
          },
        },
        {
          type: 'modified',
          doc: {
            id: 'id02',
            exists: () => true,
            data: () => ({
              key022: 'value022',
            }),
          },
        },
        {
          type: 'removed',
          doc: {
            id: 'id03',
            exists: () => false,
          },
        },
        {
          type: 'dummy',
          doc: {
            id: 'id04',
            exists: () => true,
            data: () => ({
              key044: 'value044',
            }),
          },
        },
      ],
    };
    const ret = mergeUpdatedDocs(snapshot, old);
    expect(ret).toEqual([
      {
        id: 'id04',
        key04: 'value04',
      },
      {
        id: 'id01',
        key011: 'value011',
      },
      {
        id: 'id02',
        key022: 'value022',
      },
    ]);
  });
});
