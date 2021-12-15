import {
  onSnapshot, doc, getDoc, collection, updateDoc,
} from 'firebase/firestore';

import {
  initialieMock, mockContext,
} from '../setupTests';
import {
  updateMe,
  listenAccounts,
  setAccountProperties,
} from './accounts';

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
  query: jest.fn(),
}));

const handleListenError = jest.fn();

beforeEach(() => {
  onSnapshot.mockImplementation(() => jest.fn());
  initialieMock();
});

describe('updateMe(context, me)', () => {
  it('rejects invalid user.', () => {
    expect(() => updateMe(
      mockContext,
      null,
      handleListenError,
    )).toThrow();
    expect(() => updateMe(
      mockContext,
      { valid: true },
      handleListenError,
    )).toThrow();
    expect(() => updateMe(
      mockContext,
      { id: 'id01', valid: false },
      handleListenError,
    )).toThrow();
    expect(() => updateMe(
      mockContext,
      { id: 'id01', valid: true, deletedAt: new Date() },
      handleListenError,
    )).toThrow();
  });

  it('accepts only the same id and the same priv as saved.', () => {
    mockContext.me.id = 'id01';
    mockContext.me.tester = true;
    mockContext.me.admin = true;
    expect(() => updateMe(
      mockContext,
      {
        id: 'id02',
        valid: true,
        tester: true,
        admin: true,
      },
      handleListenError,
    )).toThrow();
    expect(() => updateMe(
      mockContext,
      {
        id: 'id01',
        valid: true,
        tester: false,
        admin: true,
      },
      handleListenError,
    )).toThrow();
    expect(() => updateMe(
      mockContext,
      {
        id: 'id01',
        valid: true,
        tester: true,
        admin: false,
      },
      handleListenError,
    )).toThrow();
  });
});

describe('listenAccounts(context, uid)', () => {
  it('call sing-out without valid me doc.', async () => {
    const uid = 'id01';
    doc.mockImplementationOnce(() => ({ id: uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({ id: uid })),
    );
    mockContext.unsub = {};

    await listenAccounts(mockContext, uid, handleListenError);

    expect(handleListenError.mock.calls).toEqual([[mockContext]]);
    expect(onSnapshot.mock.calls).toEqual([]);
  });

  it('call sing-out with exception from firestore api.', async () => {
    const uid = 'id01';
    doc.mockImplementationOnce(() => ({ id: uid }));
    mockContext.unsub = {};

    await listenAccounts(mockContext, uid, handleListenError);

    expect(handleListenError.mock.calls).toEqual([[mockContext]]);
    expect(onSnapshot.mock.calls).toEqual([]);
  });

  it('not starts listening realtime data of account of me '
  + 'if unsub is not empty.', async () => {
    const uid = 'id01';
    doc.mockImplementationOnce(() => ({ id: uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({
        id: uid,
        exists: true,
        data: () => ({ valid: true }),
      })),
    );
    mockContext.unsub.accounts = () => {};

    const ret = await listenAccounts(mockContext, uid, handleListenError);

    expect(ret).toBeTruthy();
    expect(onSnapshot.mock.calls.length).toEqual(1);
    expect(collection.mock.calls.length).toEqual(1);
    expect(collection.mock.calls[0][1]).toEqual('groups');
  });

  it('starts listening realtime data of account of me '
  + 'if unsub is empty.', async () => {
    const uid = 'id01';
    doc.mockImplementationOnce(() => ({ id: uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({
        id: uid,
        exists: true,
        data: () => ({ valid: true }),
      })),
    );
    onSnapshot
      .mockImplementationOnce(() => () => 'unsub function for groups')
      .mockImplementationOnce(() => () => 'unsub function for accounts');
    mockContext.unsub = {};

    const ret = await listenAccounts(mockContext, uid, handleListenError);

    expect(ret).toBeTruthy();
    expect(mockContext.unsub.accounts()).toEqual('unsub function for accounts');
    expect(mockContext.unsub.groups()).toEqual('unsub function for groups');
  });

  it('sets only the me doc if the snapshot is valid and not admin.', async () => {
    const uid = 'id01';
    const meDoc = {
      id: uid,
      exists: true,
      data: () => ({ valid: true }),
    };
    doc.mockImplementationOnce(() => ({ id: uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => (meDoc)),
    );
    onSnapshot
      .mockImplementationOnce(() => () => 'unsub function for groups')
      .mockImplementationOnce(() => () => 'unsub function for accounts');
    mockContext.unsub = {};

    await listenAccounts(mockContext, uid, handleListenError);

    const cb = onSnapshot.mock.calls[1][1];

    cb(meDoc);
    const cbError = onSnapshot.mock.calls[1][2];
    expect(handleListenError.mock.calls.length).toEqual(0);

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(mockContext.setMe.mock.calls[0][0]).toEqual({ id: 'id01', valid: true });

    cb({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: false,
      }),
    });

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(handleListenError.mock.calls.length).toEqual(1);

    cb({
      exists: false,
      id: 'id01',
    });

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(handleListenError.mock.calls.length).toEqual(2);

    await cbError();
    expect(handleListenError.mock.calls.length).toEqual(3);
  });

  it('sets docs of all accounts if the snapshot is valid admin.', async () => {
    const uid = 'id01';
    const meDoc = {
      id: uid,
      exists: true,
      data: () => ({ valid: true, admin: true }),
    };
    const user02Doc = {
      id: 'id02',
      exists: true,
      data: () => ({ valid: true }),
    };
    doc.mockImplementationOnce(() => ({ id: uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => (meDoc)),
    );
    onSnapshot
      .mockImplementationOnce(() => () => 'unsub function for groups')
      .mockImplementationOnce(() => () => 'unsub function for accounts');
    mockContext.unsub = {};

    await listenAccounts(mockContext, uid, handleListenError);

    const cb = onSnapshot.mock.calls[1][1];
    const cbError = onSnapshot.mock.calls[1][2];
    expect(handleListenError.mock.calls.length).toEqual(0);

    cb({
      docChanges: () => [
        {
          type: 'added',
          doc: meDoc,
        },
        {
          type: 'added',
          doc: user02Doc,
        },
      ],
    });

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(mockContext.setMe.mock.calls[0][0]).toEqual({ id: 'id01', valid: true, admin: true });
    expect(mockContext.setAccounts.mock.calls.length).toEqual(1);
    expect(mockContext.setAccounts.mock.calls[0][0]).toEqual([
      { id: 'id01', valid: true, admin: true },
      { id: 'id02', valid: true },
    ]);

    cb({
      docChanges: () => [
        {
          type: 'modified',
          doc: {
            exists: true,
            id: 'id01',
            data: () => ({
              valid: false,
            }),
          },
        },
      ],
    });

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(handleListenError.mock.calls.length).toEqual(1);

    cb({
      docChanges: () => [
        {
          type: 'removed',
          doc: {
            id: 'id01',
          },
        },
      ],
    });

    expect(mockContext.setMe.mock.calls.length).toEqual(2);
    expect(handleListenError.mock.calls.length).toEqual(2);

    await cbError();
    expect(handleListenError.mock.calls.length).toEqual(3);
  });

  it('do not start listening realtime data of account of me '
  + 'if unsub is not empty.', () => {
    doc.mockImplementationOnce(() => ({ path: 'doc path' }));
    onSnapshot.mockImplementationOnce(() => () => 'unsub function 1');
    mockContext.unsub = {
      'doc path': () => 'unsub function 0',
    };
    const uid = 'id01';

    listenAccounts(mockContext, uid, handleListenError);
    expect(mockContext.unsub['doc path']()).toEqual('unsub function 0');
  });
});

describe('setAccountProperties(context, id, props)', () => {
  it('call updateDoc() with updatedAt.', async () => {
    const meRef = { id: 'id01', name: 'doc ref of me' };
    doc.mockImplementationOnce(() => meRef);
    await setAccountProperties(mockContext, meRef.id, { key1: 'value1' });

    expect(updateDoc.mock.calls.length).toEqual(1);
    expect(updateDoc.mock.calls[0][0]).toEqual(meRef);
    expect(updateDoc.mock.calls[0][1].key1).toEqual('value1');
    expect(updateDoc.mock.calls[0][1].updatedAt).toBeDefined();
  });
});
