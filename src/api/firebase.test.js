import {
  mockUrl, resetMockService, mockService, mockAuth,
  mockSetConf, mockSetMe, mockSetAuthUser,
  mockDocPath, mockOnSnapshot,
  mockLocalStorage, mockWindow,
} from '../testConfig';

const mockSignInWithEmailLink = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => { throw new Error(); });
const mockIsSignInWithEmailLink = jest
  .fn(() => false)
  .mockImplementationOnce(() => true);
const mockOnAuthStateChanged = jest.fn();
const mockSendSignInLinkToEmail = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  signInWithEmailLink: mockSignInWithEmailLink,
  sendSignInLinkToEmail: mockSendSignInLinkToEmail,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  isSignInWithEmailLink: mockIsSignInWithEmailLink,
  onAuthStateChanged: mockOnAuthStateChanged,
}));

// work around for mocking problem.
const {
  unsubUserData,
  castDoc,
  handleSignInWithEmailLink,
  restoreAuthError,
  listenConf,
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
  onSignOut,
  handleSignOut,
  listenMe,
  listenFirebase,
  localKeyEmail,
  localKeyError,
} = require('./firebase');

beforeAll(() => {
  resetMockService();
});

afterEach(() => {
  jest.clearAllMocks();
  resetMockService();
});

describe('unsubUserData(service)', () => {
  it('exec each unsub functions and delete them all.', async () => {
    const unsub1 = jest.fn();
    const unsub2 = jest.fn();
    mockService.unsub = {
      unsub0: null,
      unsub1,
      unsub2,
      unsub4: 'dummy',
    };
    unsubUserData(mockService);
    expect(unsub1.mock.calls.length).toEqual(1);
    expect(unsub2.mock.calls.length).toEqual(1);
    expect(Object.keys(mockService.unsub).length).toEqual(0);
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
  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockLocalStorage[localKeyEmail] = email01;
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockService, mockWindow);

    expect(mockLocalStorage[localKeyEmail]).not.toBeDefined();
    expect(mockLocalStorage[localKeyError]).toEqual('check your email address');
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockLocalStorage[localKeyEmail] = email01;
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockService, mockWindow);

    expect(mockLocalStorage[localKeyEmail]).not.toBeDefined();
    expect(mockLocalStorage[localKeyError]).not.toBeDefined();
    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
    expect(mockSignInWithEmailLink.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSignInWithEmailLink.mock.calls[0][1]).toEqual(email01);
    expect(mockSignInWithEmailLink.mock.calls[0][2]).toEqual(url01);
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });

  it('set localKeyError: "failed to sign in" '
  + 'if no email address in localStorage.', async () => {
    const url01 = 'https://example.com/?name=value';
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockService, mockWindow);

    expect(mockLocalStorage[localKeyEmail]).not.toBeDefined();
    expect(mockLocalStorage[localKeyError]).toEqual('failed to sign in');
    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(0);
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });
});

describe('restoreAuthError(service, window)', () => {
  it('restore localKeyError to the service object.', async () => {
    mockLocalStorage[localKeyError] = 'test01';

    restoreAuthError(mockService, mockWindow);

    expect(mockService.authError).toEqual('test01');
    expect(mockLocalStorage[localKeyError]).not.toBeDefined();

    restoreAuthError(mockService, mockWindow);

    expect(mockService.authError).toBeFalsy();
    expect(mockLocalStorage[localKeyError]).not.toBeDefined();
  });
});

describe('listenConf(service)', () => {
  it('start listening realtime data of service.conf.', async () => {
    mockService.db = {
      collection: () => ({
        doc: () => ({
          onSnapshot: mockOnSnapshot,
        }),
      }),
    };

    listenConf(mockService);

    expect(mockService.unsubConf).toBeDefined();
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetConf.mock.calls.length).toEqual(0);
    const cb = mockOnSnapshot.mock.calls[0][0];

    cb({
      exists: true,
      id: 'id01',
      data: () => ({}),
    });

    expect(mockSetConf.mock.calls.length).toEqual(1);
    expect(mockSetConf.mock.calls[0][0]).toEqual({ id: 'id01' });

    cb({
      exists: false,
    });

    expect(mockSetConf.mock.calls.length).toEqual(2);
    expect(mockSetConf.mock.calls[1][0]).toEqual({ error: true });

    mockService.unsubConf = () => 'unsub conf';
    listenConf(mockService);
    expect(mockSetConf.mock.calls.length).toEqual(2);
  });
});

describe('handelSendSignInLinkToEmail(service, window, email)', () => {
  it('calls signInWithEmailAndPassword(auth, email, { url, handleCodeInApp })', async () => {
    const mockSetItem = jest.fn();
    mockWindow.localStorage.setItem = mockSetItem;
    const handleCodeInApp = true;
    mockService.conf = { url: mockUrl };
    const email = 'test01@example.com';
    const param2 = { url: mockUrl, handleCodeInApp };

    await handelSendSignInLinkToEmail(mockService, mockWindow, email);

    expect(mockSetItem.mock.calls.length).toEqual(1);
    expect(mockSetItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockSetItem.mock.calls[0][1]).toEqual(email);
    expect(mockSendSignInLinkToEmail.mock.calls.length).toEqual(1);
    expect(mockSendSignInLinkToEmail.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSendSignInLinkToEmail.mock.calls[0][1]).toEqual(email);
    expect(mockSendSignInLinkToEmail.mock.calls[0][2]).toEqual(param2);
  });
});

describe('handleSignInWithPassword(service, email, password)', () => {
  it('calls signInWithEmailAndPassword(auth, email, password)', async () => {
    const email = 'test01@example.com';
    const password = 'password01';

    await handleSignInWithPassword(mockService, email, password);

    expect(mockSignInWithEmailAndPassword.mock.calls.length).toEqual(1);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][1]).toEqual(email);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][2]).toEqual(password);
  });
});

describe('onSignOut(service)', () => {
  it('call unsubUserData(), call setMe with {}, call setAuthUser with {}.', async () => {
    const mockUnsub = jest.fn();
    mockService.unsub = {
      unsub01: mockUnsub,
    };
    onSignOut(mockService);

    expect(mockService.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
  });
});

describe('handleSignOut(service)', () => {
  it('call onSignOut(), call onSignOut(auth).', async () => {
    const mockUnsub = jest.fn();
    mockService.unsub = {
      unsub01: mockUnsub,
    };
    handleSignOut(mockService);

    expect(mockService.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls[0][0]).toEqual(mockAuth);
  });
});

describe('listenMe(service, uid)', () => {
  it('start listening realtime data of account of me '
  + 'if unsub is empty.', () => {
    mockService.unsub = {
      'doc path': () => 'unsub function 1',
    };
    const uid = 'id01';

    listenMe(mockService, uid);

    expect(mockService.unsub['doc path']()).toEqual('unsub function 1');
  });

  it('set the doc me if the snapshot is valid.', () => {
    const uid = 'id01';

    listenMe(mockService, uid);
    const cb = mockOnSnapshot.mock.calls[0][0];

    cb({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: true,
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({ id: 'id01', valid: true });

    cb({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: true,
        deletedAt: new Date(),
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(2);
    expect(mockSetMe.mock.calls[1][0]).toEqual({});
    expect(mockService.authError).toEqual('unregistered account');

    mockService.authError = '';
    cb({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: false,
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(3);
    expect(mockSetMe.mock.calls[2][0]).toEqual({});
    expect(mockService.authError).toEqual('unregistered account');

    mockService.authError = '';
    cb({
      exists: false,
    });

    expect(mockSetMe.mock.calls.length).toEqual(4);
    expect(mockSetMe.mock.calls[3][0]).toEqual({});
    expect(mockService.authError).toEqual('unregistered account');
  });

  it('do not start listening realtime data of account of me '
  + 'if unsub is not empty.', () => {
    mockService.unsub = {
      'doc path': () => 'unsub function 1',
    };
    const uid = 'id01';

    listenMe(mockService, uid);
    expect(mockService.unsub['doc path']()).toEqual('unsub function 1');
  });
});

describe('listenFirebase(service, windows)', () => {
  it('calls handleSignInWithEmailLink() '
  + 'if url is sign-in with emai link.', async () => {
    mockLocalStorage[localKeyEmail] = 'abc@example.com';

    await listenFirebase(mockService, mockWindow);

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls onAuthStateChanged() '
  + 'if url is not sign-in with emai link.', async () => {
    const mockGetItem = jest.fn(() => 'abc@example.com');
    const mockRemoveItem = jest.fn();
    mockService.unsubConf = () => {};
    mockService.unsub = {
      [mockDocPath]: () => {},
    };
    mockWindow.localStorage.getItem = mockGetItem;
    mockWindow.localStorage.removeItem = mockRemoveItem;

    await listenFirebase(mockService, mockWindow);

    expect(mockOnAuthStateChanged.mock.calls.length).toEqual(1);
    expect(mockOnAuthStateChanged.mock.calls[0][0]).toEqual(mockAuth);

    const cb = mockOnAuthStateChanged.mock.calls[0][1];
    const authUser01 = { uid: 'id01' };

    cb(authUser01);

    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual(authUser01);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    mockService.authUser = authUser01;
    const authUser02 = { uid: 'id02' };

    cb(authUser02);

    expect(mockSetAuthUser.mock.calls.length).toEqual(2);
    expect(mockSetAuthUser.mock.calls[1][0]).toEqual(authUser02);
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    mockService.authUser = authUser02;
    mockService.me = { id: authUser02.uid };

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockSetAuthUser.mock.calls[2][0]).toEqual({});
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});

    mockService.authUser = {};
    mockService.me = {};

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
  });
});
