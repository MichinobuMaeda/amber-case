const mockSignInWithEmailLink = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => { throw new Error(); });
const mockIsSignInWithEmailLink = jest
  .fn(() => false)
  .mockImplementationOnce(() => true);
const mockOnAuthStateChanged = jest.fn();
const mockSignOut = jest.fn();
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  signInWithEmailLink: mockSignInWithEmailLink,
  signOut: mockSignOut,
  isSignInWithEmailLink: mockIsSignInWithEmailLink,
  onAuthStateChanged: mockOnAuthStateChanged,
}));

const {
  unsubUserData,
  castDoc,
  handleSignInWithEmailLink,
  restoreAuthError,
  listenConf,
  onSignOut,
  handleSignOut,
  listenMe,
  listenFirebase,
  localKeyEmail,
  localKeyError,
} = require('./firebase');

afterEach(() => {
  jest.clearAllMocks();
});

describe('unsubUserData(service)', () => {
  it('exec each unsub functions and delete them all.', async () => {
    const unsub1 = jest.fn();
    const unsub2 = jest.fn();
    const service = {
      unsub: {
        unsub0: null,
        unsub1,
        unsub2,
        unsub4: 'dummy',
      },
    };
    unsubUserData(service);
    expect(unsub1.mock.calls.length).toEqual(1);
    expect(unsub2.mock.calls.length).toEqual(1);
    expect(Object.keys(service.unsub).length).toEqual(0);
  });
});

describe('castDoc(doc)', () => {
  it('return {} if doc is null or doc is not exists.', async () => {
    expect(castDoc(null)).toEqual({});
    expect(castDoc({ exists: false })).toEqual({});
  });

  it('return an object with id and members of doc.data().', async () => {
    expect(castDoc({
      exists: true,
      id: 'id01',
      data: () => ({}),
    })).toEqual({
      id: 'id01',
    });
    expect(castDoc({
      exists: true,
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
      exists: true,
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

describe('handleSignInWithEmailLink(service, window)', () => {
  const service = { auth: { name: 'Test auth object' } };

  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    const localStorageData = {
      [localKeyEmail]: email01,
      [localKeyError]: 'dummy',
    };
    const window = {
      localStorage: {
        getItem: (key) => localStorageData[key],
        setItem: (key, value) => { localStorageData[key] = value; },
        removeItem: (key) => { delete localStorageData[key]; },
      },
      location: {
        href: url01,
      },
    };

    await handleSignInWithEmailLink(service, window);

    expect(localStorageData[localKeyEmail]).not.toBeDefined();
    expect(localStorageData[localKeyError]).toEqual('check your email address');
    expect(window.location.href).toEqual('https://example.com/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    const localStorageData = {
      [localKeyEmail]: email01,
      [localKeyError]: 'dummy',
    };
    const window = {
      localStorage: {
        getItem: (key) => localStorageData[key],
        setItem: (key, value) => { localStorageData[key] = value; },
        removeItem: (key) => { delete localStorageData[key]; },
      },
      location: {
        href: url01,
      },
    };

    await handleSignInWithEmailLink(service, window);

    expect(localStorageData[localKeyEmail]).not.toBeDefined();
    expect(localStorageData[localKeyError]).not.toBeDefined();
    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
    expect(mockSignInWithEmailLink.mock.calls[0][0]).toEqual(service.auth);
    expect(mockSignInWithEmailLink.mock.calls[0][1]).toEqual(email01);
    expect(mockSignInWithEmailLink.mock.calls[0][2]).toEqual(url01);
    expect(window.location.href).toEqual('https://example.com/');
  });

  it('set localKeyError: "failed to sign in" '
  + 'if no email address in localStorage.', async () => {
    const url01 = 'https://example.com/?name=value';
    const localStorageData = {
      [localKeyError]: 'dummy',
    };
    const window = {
      localStorage: {
        getItem: (key) => localStorageData[key],
        setItem: (key, value) => { localStorageData[key] = value; },
        removeItem: (key) => { delete localStorageData[key]; },
      },
      location: {
        href: url01,
      },
    };

    await handleSignInWithEmailLink(service, window);

    expect(localStorageData[localKeyEmail]).not.toBeDefined();
    expect(localStorageData[localKeyError]).toEqual('failed to sign in');
    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(0);
    expect(window.location.href).toEqual('https://example.com/');
  });
});

describe('restoreAuthError(service, window)', () => {
  const service = {};

  it('restore localKeyError to the service object.', async () => {
    const localStorageData = {
      [localKeyError]: 'test01',
    };
    const window = {
      localStorage: {
        getItem: (key) => localStorageData[key],
        setItem: (key, value) => { localStorageData[key] = value; },
        removeItem: (key) => { delete localStorageData[key]; },
      },
    };

    restoreAuthError(service, window);

    expect(service.authError).toEqual('test01');
    expect(localStorageData[localKeyError]).not.toBeDefined();

    restoreAuthError(service, window);

    expect(service.authError).toBeFalsy();
    expect(localStorageData[localKeyError]).not.toBeDefined();
  });
});

describe('listenConf(service)', () => {
  let handelSnapshotCallBack = null;
  const mockSetConf = jest.fn();
  const mockOnSnapshot = jest.fn((cb) => {
    handelSnapshotCallBack = cb;
    return () => {};
  });
  const service = {
    setConf: mockSetConf,
    db: {
      collection: () => ({
        doc: () => ({
          onSnapshot: mockOnSnapshot,
        }),
      }),
    },
  };

  it('start listening realtime data of service.conf.', async () => {
    listenConf(service);

    expect(service.unsubConf).toBeDefined();
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetConf.mock.calls.length).toEqual(0);

    handelSnapshotCallBack({
      exists: true,
      id: 'id01',
      data: () => ({}),
    });

    expect(mockSetConf.mock.calls.length).toEqual(1);
    expect(mockSetConf.mock.calls[0][0]).toEqual({ id: 'id01' });

    handelSnapshotCallBack({
      exists: false,
    });

    expect(mockSetConf.mock.calls.length).toEqual(2);
    expect(mockSetConf.mock.calls[1][0]).toEqual({ error: true });

    service.unsubConf = () => 'unsub conf';
    listenConf(service);
    expect(mockSetConf.mock.calls.length).toEqual(2);
  });
});

describe('onSignOut(service)', () => {
  const mockSetMe = jest.fn();
  const mockSetAuthUser = jest.fn();
  const mockUnsub01 = jest.fn();
  const service = {
    setMe: mockSetMe,
    setAuthUser: mockSetAuthUser,
    unsub: {
      unsub01: mockUnsub01,
    },
  };

  it('call unsubUserData(), call setMe with {}, call setAuthUser with {}.', async () => {
    onSignOut(service);

    expect(service.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub01.mock.calls.length).toEqual(1);
  });
});

describe('handleSignOut(service)', () => {
  const auth = { name: 'auth object' };
  const mockSetMe = jest.fn();
  const mockSetAuthUser = jest.fn();
  const mockUnsub01 = jest.fn();
  const service = {
    auth,
    setMe: mockSetMe,
    setAuthUser: mockSetAuthUser,
    unsub: {
      unsub01: mockUnsub01,
    },
  };

  it('call onSignOut(), call onSignOut(auth).', async () => {
    handleSignOut(service);

    expect(service.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub01.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls[0][0]).toEqual(auth);
  });
});

describe('listenMe(service, uid)', () => {
  it('start listening realtime data of account of me '
  + 'if unsub is empty.', () => {
    const service = {
      unsub: {},
      db: {
        collection: () => ({
          doc: () => ({
            path: 'doc path',
            onSnapshot: () => () => 'unsub function',
          }),
        }),
      },
    };
    const uid = 'id01';

    listenMe(service, uid);

    expect(service.unsub['doc path']()).toEqual('unsub function');
  });

  it('set the doc me if the snapshot is valid.', () => {
    let callBackOfSnapshot = null;
    const mockSetMe = jest.fn();
    const service = {
      unsub: {},
      db: {
        collection: () => ({
          doc: () => ({
            path: 'doc path',
            onSnapshot: (cb) => {
              callBackOfSnapshot = cb;
              return () => 'unsub function';
            },
          }),
        }),
      },
      setMe: mockSetMe,
    };
    const uid = 'id01';

    listenMe(service, uid);
    callBackOfSnapshot({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: true,
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({ id: 'id01', valid: true });

    callBackOfSnapshot({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: true,
        deletedAt: new Date(),
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(2);
    expect(mockSetMe.mock.calls[1][0]).toEqual({});
    expect(service.authError).toEqual('unregistered account');

    service.authError = '';
    callBackOfSnapshot({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: false,
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(3);
    expect(mockSetMe.mock.calls[2][0]).toEqual({});
    expect(service.authError).toEqual('unregistered account');

    service.authError = '';
    callBackOfSnapshot({
      exists: false,
    });

    expect(mockSetMe.mock.calls.length).toEqual(4);
    expect(mockSetMe.mock.calls[3][0]).toEqual({});
    expect(service.authError).toEqual('unregistered account');
  });

  it('do not start listening realtime data of account of me '
  + 'if unsub is not empty.', () => {
    const service = {
      unsub: { 'doc path': () => 'unsub function 1' },
      db: {
        collection: () => ({
          doc: () => ({
            path: 'doc path',
            onSnapshot: () => () => 'unsub function 2',
          }),
        }),
      },
    };
    const uid = 'id01';

    listenMe(service, uid);
    expect(service.unsub['doc path']()).toEqual('unsub function 1');
  });
});

describe('listenFirebase(service, windows)', () => {
  it('calls handleSignInWithEmailLink() '
  + 'if url is sign-in with emai link.', async () => {
    const service = { name: 'service object' };
    const window = {
      location: { href: 'https://example.com/' },
      localStorage: {
        getItem: () => 'abc@example.com',
        removeItem: () => {},
      },
    };

    await listenFirebase(service, window);

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls onAuthStateChanged() '
  + 'if url is not sign-in with emai link.', async () => {
    const mockSetAuthUser = jest.fn();
    const mockGetItem = jest.fn(() => 'abc@example.com');
    const mockRemoveItem = jest.fn();
    const mockMeOnSnapshot = jest.fn();
    const mockSetMe = jest.fn();
    const service = {
      db: {
        collection: () => ({
          doc: () => ({
            path: 'path of id01',
            onSnapshot: mockMeOnSnapshot,
          }),
        }),
      },
      auth: { name: 'auth object' },
      authUser: {},
      setAuthUser: mockSetAuthUser,
      unsubConf: () => {},
      unsub: {
        'path of id01': () => {},
      },
      setMe: mockSetMe,
    };
    const window = {
      location: { href: 'https://example.com/' },
      localStorage: {
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
      },
    };

    await listenFirebase(service, window);

    expect(mockOnAuthStateChanged.mock.calls.length).toEqual(1);
    expect(mockOnAuthStateChanged.mock.calls[0][0]).toEqual(service.auth);

    const cb = mockOnAuthStateChanged.mock.calls[0][1];
    const authUser01 = { uid: 'id01' };

    cb(authUser01);

    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual(authUser01);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    service.authUser = authUser01;
    const authUser02 = { uid: 'id02' };

    cb(authUser02);

    expect(mockSetAuthUser.mock.calls.length).toEqual(2);
    expect(mockSetAuthUser.mock.calls[1][0]).toEqual(authUser02);
    expect(mockMeOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    service.authUser = authUser02;
    service.me = { id: authUser02.uid };

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockSetAuthUser.mock.calls[2][0]).toEqual({});
    expect(mockMeOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});

    service.authUser = {};
    service.me = {};

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockMeOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
  });
});
