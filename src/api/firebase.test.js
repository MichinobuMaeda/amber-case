import {
  mockUrl, resetMockService, mockContext, mockCurrentUser, mockAuth,
  mockSetConf, mockSetMe, mockSetAuthUser,
  mockDocPath, mockOnSnapshot, mockDoc, mockConnectFirestoreEmulator, mockUpdateDoc,
  mockLocalStorage, mockLocalStorageSetItem, mockLocalStorageRemoveItem,
  mockWindow, mockLocationReload, mockLocationReplace,
} from '../testConfig';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

const mockSignInWithEmailLink = jest.fn(() => 'default');
const mockIsSignInWithEmailLink = jest.fn(() => false);
const mockConnectAuthEmulator = jest.fn();
const mockOnAuthStateChanged = jest.fn();
const mockSendSignInLinkToEmail = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSendEmailVerification = jest.fn();
const mockReauthenticateWithCredential = jest.fn();
const mockEmailAuthProviderCredential = jest.fn();
const mockUpdateEmail = jest.fn();
const mockUpdatePassword = jest.fn();
const mockSignOut = jest.fn();
const mockReload = jest.fn();
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  connectAuthEmulator: mockConnectAuthEmulator,
  signInWithEmailLink: mockSignInWithEmailLink,
  sendSignInLinkToEmail: mockSendSignInLinkToEmail,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  sendEmailVerification: mockSendEmailVerification,
  reauthenticateWithCredential: mockReauthenticateWithCredential,
  signOut: mockSignOut,
  isSignInWithEmailLink: mockIsSignInWithEmailLink,
  updateEmail: mockUpdateEmail,
  updatePassword: mockUpdatePassword,
  onAuthStateChanged: mockOnAuthStateChanged,
  reload: mockReload,
  EmailAuthProvider: { credential: mockEmailAuthProviderCredential },
}));

const mockConnectStorageEmulator = jest.fn();
jest.mock('firebase/storage', () => ({
  ...jest.requireActual('firebase/storage'),
  getStorage: jest.fn(() => ({})),
  connectStorageEmulator: mockConnectStorageEmulator,
}));

const mockConnectFunctionsEmulator = jest.fn();
jest.mock('firebase/functions', () => ({
  ...jest.requireActual('firebase/functions'),
  getFunctions: jest.fn(() => ({})),
  connectFunctionsEmulator: mockConnectFunctionsEmulator,
}));

// work around for mocking problem.
const {
  updateApp,
  initializeFirebase,
  unsubUserData,
  castDoc,
  handleSignInWithEmailLink,
  restoreAuthError,
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
  handleSendEmailVerification,
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithEmailLink,
  handleReauthenticateWithPassword,
  handleReloadAuthUser,
  onSignOut,
  handleSignOut,
  setMyEmail,
  setMyPassword,
  listenConf,
  setConfProperties,
  listenMe,
  setAccountProperties,
  listenFirebase,
  localKeyEmail,
  localKeyError,
  actionEmailVerification,
  actionReauthentication,
} = require('./firebase');

beforeEach(() => {
  resetMockService();
});

describe('updateApp(navigator, window)', () => {
  it('unregister the service worker and reload web app.', async () => {
    const mockUnregister = jest.fn();
    const navigator = {
      serviceWorker: {
        ready: {
          unregister: mockUnregister,
        },
      },
    };
    await updateApp(navigator, mockWindow);
    expect(mockUnregister.mock.calls.length).toEqual(1);
    expect(mockLocationReload.mock.calls.length).toEqual(1);
  });
});

describe('initializeFirebase(firebaseConfig)', () => {
  it('not use emulator if firebase api key is production.', () => {
    initializeFirebase({ apiKey: 'production api key' });
    expect(mockConnectAuthEmulator.mock.calls.length).toEqual(0);
    expect(mockConnectFirestoreEmulator.mock.calls.length).toEqual(0);
    expect(mockConnectStorageEmulator.mock.calls.length).toEqual(0);
    expect(mockConnectFunctionsEmulator.mock.calls.length).toEqual(0);
  });

  it('use emulator if firebase api key is not production.', () => {
    initializeFirebase({ apiKey: 'FIREBASE_API_KEY' });
    expect(mockConnectAuthEmulator.mock.calls.length).toEqual(1);
    expect(mockConnectFirestoreEmulator.mock.calls.length).toEqual(1);
    expect(mockConnectStorageEmulator.mock.calls.length).toEqual(1);
    expect(mockConnectFunctionsEmulator.mock.calls.length).toEqual(1);
  });
});

describe('unsubUserData(context)', () => {
  it('exec each unsub functions and delete them all.', async () => {
    const unsub1 = jest.fn();
    const unsub2 = jest.fn();
    mockContext.unsub = {
      unsub0: null,
      unsub1,
      unsub2,
      unsub4: 'dummy',
    };
    unsubUserData(mockContext);
    expect(unsub1.mock.calls.length).toEqual(1);
    expect(unsub2.mock.calls.length).toEqual(1);
    expect(Object.keys(mockContext.unsub).length).toEqual(0);
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

describe('handleSignInWithEmailLink(context, window)', () => {
  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockLocalStorage[localKeyEmail] = email01;
    mockWindow.location.href = url01;
    mockSignInWithEmailLink.mockImplementationOnce(() => { throw new Error(); });
    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(2);
    expect(mockLocalStorageRemoveItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageRemoveItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual('check your email address');

    expect(mockWindow.location.href).toEqual('https://example.com/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockLocalStorage[localKeyEmail] = email01;
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(2);
    expect(mockLocalStorageRemoveItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageRemoveItem.mock.calls[1][0]).toEqual(localKeyError);

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

    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual('failed to sign in');

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(0);
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });
});

describe('restoreAuthError(context, window)', () => {
  it('restore localKeyError to the service object.', async () => {
    mockLocalStorage[localKeyError] = 'test01';

    restoreAuthError(mockContext, mockWindow);

    expect(mockContext.authError).toEqual('test01');
    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageRemoveItem.mock.calls[0][0]).toEqual(localKeyError);

    delete mockLocalStorage[localKeyError];
    restoreAuthError(mockContext, mockWindow);

    expect(mockContext.authError).toBeFalsy();
    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(2);
    expect(mockLocalStorageRemoveItem.mock.calls[1][0]).toEqual(localKeyError);
  });
});

describe('handelSendSignInLinkToEmail(context, window, email)', () => {
  it('calls signInWithEmailAndPassword(auth, email, { url, handleCodeInApp })', async () => {
    const handleCodeInApp = true;
    mockContext.conf = { url: mockUrl };
    const email = 'test01@example.com';
    const param2 = { url: mockUrl, handleCodeInApp };

    await handelSendSignInLinkToEmail(mockContext, mockWindow, email);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual(email);
    expect(mockSendSignInLinkToEmail.mock.calls.length).toEqual(1);
    expect(mockSendSignInLinkToEmail.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSendSignInLinkToEmail.mock.calls[0][1]).toEqual(email);
    expect(mockSendSignInLinkToEmail.mock.calls[0][2]).toEqual(param2);
  });
});

describe('handleSignInWithPassword(context, email, password)', () => {
  it('calls signInWithEmailAndPassword(auth, email, password)', async () => {
    const email = 'test01@example.com';
    const password = 'password01';

    await handleSignInWithPassword(mockContext, email, password);

    expect(mockSignInWithEmailAndPassword.mock.calls.length).toEqual(1);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][1]).toEqual(email);
    expect(mockSignInWithEmailAndPassword.mock.calls[0][2]).toEqual(password);
  });
});

describe('handleSendEmailVerification(context)', () => {
  it('calls sendEmailVerification(auth.currentUser)', async () => {
    const mockUser = { uid: 'id01' };
    mockContext.auth = { currentUser: mockUser };

    await handleSendEmailVerification(mockContext);

    expect(mockSendEmailVerification.mock.calls.length).toEqual(1);
    expect(mockSendEmailVerification.mock.calls[0][0]).toEqual(mockUser);
  });
});

describe('handelReauthenticateLinkToEmail(context, window)', () => {
  it('sets email to localStrage and call sendSignInLinkToEmail() with reauth param.', async () => {
    const mockUser = { uid: 'id01', email: 'id01@example.com' };
    mockContext.auth = { currentUser: mockUser };
    await handelReauthenticateLinkToEmail(mockContext, mockWindow);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual('id01@example.com');

    expect(mockSendSignInLinkToEmail.mock.calls.length).toEqual(1);
    expect(mockSendSignInLinkToEmail.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(mockSendSignInLinkToEmail.mock.calls[0][1]).toEqual('id01@example.com');
    expect(mockSendSignInLinkToEmail.mock.calls[0][2]).toEqual({
      url: `${mockWindow.location.href}${actionReauthentication}`,
      handleCodeInApp: true,
    });
  });
});

describe('handleReauthenticateWithEmailLink(context, window)', () => {
  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value#/';
    mockLocalStorage[localKeyEmail] = email01;
    mockWindow.location.href = url01;
    mockSignInWithEmailLink.mockImplementationOnce(() => { throw new Error(); });

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(2);
    expect(mockLocalStorageRemoveItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageRemoveItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual('check your email address');

    expect(mockLocationReplace.mock.calls.length).toEqual(1);
    expect(mockLocationReplace.mock.calls[0][0]).toEqual('https://example.com/#/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value#/';
    mockLocalStorage[localKeyEmail] = email01;
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageRemoveItem.mock.calls.length).toEqual(2);
    expect(mockLocalStorageRemoveItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockLocalStorageRemoveItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
    expect(mockSignInWithEmailLink.mock.calls[0][0]).toEqual(mockAuth);
    expect(mockSignInWithEmailLink.mock.calls[0][1]).toEqual(email01);
    expect(mockSignInWithEmailLink.mock.calls[0][2]).toEqual(url01);

    expect(mockLocationReplace.mock.calls.length).toEqual(1);
    expect(mockLocationReplace.mock.calls[0][0]).toEqual('https://example.com/#/');
  });

  it('set localKeyError: "failed to sign in" '
  + 'if no email address in localStorage.', async () => {
    const url01 = 'https://example.com/?name=value#/';
    mockLocalStorage[localKeyError] = 'dummy';
    mockWindow.location.href = url01;

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockLocalStorageSetItem.mock.calls.length).toEqual(1);
    expect(mockLocalStorageSetItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockLocalStorageSetItem.mock.calls[0][1]).toEqual('failed to sign in');

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(0);

    expect(mockLocationReplace.mock.calls.length).toEqual(1);
    expect(mockLocationReplace.mock.calls[0][0]).toEqual('https://example.com/#/');
  });
});

describe('handleReauthenticateWithPassword(context, password)', () => {
  it('calls reauthenticateWithCredential()', async () => {
    const mockCredential = { name: 'credential object' };
    const mockPassword = 'id01password';
    const mockUser = { uid: 'id01', email: 'id01@example.com' };
    mockEmailAuthProviderCredential.mockImplementationOnce(() => mockCredential);
    mockContext.auth = { currentUser: mockUser };

    await handleReauthenticateWithPassword(mockContext, mockPassword);

    expect(mockEmailAuthProviderCredential.mock.calls.length).toEqual(1);
    expect(mockEmailAuthProviderCredential.mock.calls[0][0]).toEqual(mockUser.email);
    expect(mockEmailAuthProviderCredential.mock.calls[0][1]).toEqual(mockPassword);

    expect(mockReauthenticateWithCredential.mock.calls.length).toEqual(1);
    expect(mockReauthenticateWithCredential.mock.calls[0][0]).toEqual(mockUser);
    expect(mockReauthenticateWithCredential.mock.calls[0][1]).toEqual(mockCredential);
  });
});

describe('handleReloadAuthUser(context)', () => {
  it('call reload(user), call setAuthUser({}) and call setAuthUser(user)', async () => {
    const mockAuthUser = { uid: 'id01' };
    mockContext.authUser = mockAuthUser;

    await handleReloadAuthUser(mockContext);

    expect(mockReload.mock.calls.length).toEqual(1);
    expect(mockReload.mock.calls[0][0]).toEqual(mockAuthUser);
    expect(mockSetAuthUser.mock.calls.length).toEqual(2);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls[1][0]).toEqual(mockCurrentUser);
  });
});

describe('onSignOut(context)', () => {
  it('call unsubUserData(), call setMe with {}, call setAuthUser with {}.', async () => {
    const mockUnsub = jest.fn();
    mockContext.unsub = {
      unsub01: mockUnsub,
    };
    onSignOut(mockContext);

    expect(mockContext.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
  });
});

describe('handleSignOut(context)', () => {
  it('call onSignOut(), call onSignOut(auth).', async () => {
    const mockUnsub = jest.fn();
    mockContext.unsub = {
      unsub01: mockUnsub,
    };
    handleSignOut(mockContext);

    expect(mockContext.unsub).toEqual({});
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});
    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls[0][0]).toEqual(mockAuth);
  });
});

describe('setMyEmail(context, email)', () => {
  it('call updateEmail(user, email).', async () => {
    const email = 'test01@example.com';
    const user = { uid: 'id01' };
    mockContext.auth = { currentUser: user };
    await setMyEmail(mockContext, email);

    expect(mockUpdateEmail.mock.calls.length).toEqual(1);
    expect(mockUpdateEmail.mock.calls[0][0]).toEqual(user);
    expect(mockUpdateEmail.mock.calls[0][1]).toEqual(email);
  });
});

describe('setMyPassword(context, password)', () => {
  it('call updatePassword(user, password).', async () => {
    const password = 'password01';
    const user = { uid: 'id01' };
    mockContext.auth = { currentUser: user };
    await setMyPassword(mockContext, password);

    expect(mockUpdatePassword.mock.calls.length).toEqual(1);
    expect(mockUpdatePassword.mock.calls[0][0]).toEqual(user);
    expect(mockUpdatePassword.mock.calls[0][1]).toEqual(password);
  });
});

describe('listenConf(context)', () => {
  it('start listening realtime data of service.conf.', async () => {
    listenConf(mockContext);

    expect(mockContext.unsubConf).toBeDefined();
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetConf.mock.calls.length).toEqual(0);
    const cb = mockOnSnapshot.mock.calls[0][1];

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

    mockContext.unsubConf = () => 'unsub conf';
    listenConf(mockContext);
    expect(mockSetConf.mock.calls.length).toEqual(2);
  });
});

describe('setConfProperties(context, props)', () => {
  it('call updateDoc() with updatedAt.', async () => {
    const confRef = { id: 'conf' };
    mockDoc.mockImplementationOnce(() => confRef);
    await setConfProperties(mockContext, { key1: 'value1' });

    expect(mockUpdateDoc.mock.calls.length).toEqual(1);
    expect(mockUpdateDoc.mock.calls[0][0]).toEqual(confRef);
    expect(mockUpdateDoc.mock.calls[0][1].key1).toEqual('value1');
    expect(mockUpdateDoc.mock.calls[0][1].updatedAt).toBeDefined();
  });
});

describe('listenMe(context, uid)', () => {
  it('start listening realtime data of account of me '
  + 'if unsub is empty.', () => {
    mockDoc.mockImplementationOnce(() => ({ path: 'doc path' }));
    mockOnSnapshot.mockImplementationOnce(() => () => 'unsub function 1');
    mockContext.unsub = {};
    const uid = 'id01';

    listenMe(mockContext, uid);

    expect(mockContext.unsub['doc path']()).toEqual('unsub function 1');
  });

  it('set the doc me if the snapshot is valid.', () => {
    mockDoc.mockImplementationOnce(() => ({ path: 'doc path' }));
    mockOnSnapshot.mockImplementationOnce(() => () => 'unsub function 1');
    const uid = 'id01';

    listenMe(mockContext, uid);
    const cb = mockOnSnapshot.mock.calls[0][1];

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
    expect(mockContext.authError).toEqual('unregistered account');

    mockContext.authError = '';
    cb({
      exists: true,
      id: 'id01',
      data: () => ({
        valid: false,
      }),
    });

    expect(mockSetMe.mock.calls.length).toEqual(3);
    expect(mockSetMe.mock.calls[2][0]).toEqual({});
    expect(mockContext.authError).toEqual('unregistered account');

    mockContext.authError = '';
    cb({
      exists: false,
    });

    expect(mockSetMe.mock.calls.length).toEqual(4);
    expect(mockSetMe.mock.calls[3][0]).toEqual({});
    expect(mockContext.authError).toEqual('unregistered account');
  });

  it('do not start listening realtime data of account of me '
  + 'if unsub is not empty.', () => {
    mockDoc.mockImplementationOnce(() => ({ path: 'doc path' }));
    mockOnSnapshot.mockImplementationOnce(() => () => 'unsub function 1');
    mockContext.unsub = {
      'doc path': () => 'unsub function 0',
    };
    const uid = 'id01';

    listenMe(mockContext, uid);
    expect(mockContext.unsub['doc path']()).toEqual('unsub function 0');
  });
});

describe('setAccountProperties(context, id, props)', () => {
  it('call updateDoc() with updatedAt.', async () => {
    const meRef = { id: 'id01', name: 'doc ref of me' };
    mockDoc.mockImplementationOnce(() => meRef);
    await setAccountProperties(mockContext, meRef.id, { key1: 'value1' });

    expect(mockUpdateDoc.mock.calls.length).toEqual(1);
    expect(mockUpdateDoc.mock.calls[0][0]).toEqual(meRef);
    expect(mockUpdateDoc.mock.calls[0][1].key1).toEqual('value1');
    expect(mockUpdateDoc.mock.calls[0][1].updatedAt).toBeDefined();
  });
});

describe('listenFirebase(context, windows)', () => {
  it('calls handleReauthenticateWithEmailLink() '
  + 'if has param of actionReauthentication.', async () => {
    mockWindow.location.href += actionReauthentication;
    mockLocalStorage[localKeyEmail] = 'abc@example.com';

    await listenFirebase(mockContext, mockWindow);

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls window.location.replace() '
  + 'if has param of actionEmailVerification.', async () => {
    mockWindow.location.href += actionEmailVerification;

    await listenFirebase(mockContext, mockWindow);

    expect(mockLocationReplace.mock.calls.length).toEqual(1);
    expect(mockLocationReplace.mock.calls[0][0]).toEqual(mockUrl);
  });

  it('calls handleSignInWithEmailLink() '
  + 'if url is sign-in with emai link.', async () => {
    mockLocalStorage[localKeyEmail] = 'abc@example.com';
    mockIsSignInWithEmailLink.mockImplementationOnce(() => true);

    await listenFirebase(mockContext, mockWindow);

    expect(mockSignInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls onAuthStateChanged() '
  + 'if url is not sign-in with emai link.', async () => {
    mockDoc.mockImplementation(() => ({ path: mockDocPath }));
    const mockGetItem = jest.fn(() => 'abc@example.com');
    const mockRemoveItem = jest.fn();
    mockContext.unsubConf = () => {};
    mockContext.unsub = {
      [mockDocPath]: () => {},
    };
    mockWindow.localStorage.getItem = mockGetItem;
    mockWindow.localStorage.removeItem = mockRemoveItem;

    await listenFirebase(mockContext, mockWindow);

    expect(mockOnAuthStateChanged.mock.calls.length).toEqual(1);
    expect(mockOnAuthStateChanged.mock.calls[0][0]).toEqual(mockAuth);

    const cb = mockOnAuthStateChanged.mock.calls[0][1];
    const authUser01 = { uid: 'id01' };

    cb(authUser01);

    expect(mockSetAuthUser.mock.calls.length).toEqual(1);
    expect(mockSetAuthUser.mock.calls[0][0]).toEqual(authUser01);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    mockContext.authUser = authUser01;
    const authUser02 = { uid: 'id02' };

    cb(authUser02);

    expect(mockSetAuthUser.mock.calls.length).toEqual(2);
    expect(mockSetAuthUser.mock.calls[1][0]).toEqual(authUser02);
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSignOut.mock.calls.length).toEqual(0);

    mockContext.authUser = authUser02;
    mockContext.me = { id: authUser02.uid };

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockSetAuthUser.mock.calls[2][0]).toEqual({});
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls[0][0]).toEqual({});

    mockContext.authUser = {};
    mockContext.me = {};

    cb(null);

    expect(mockSetAuthUser.mock.calls.length).toEqual(3);
    expect(mockOnSnapshot.mock.calls.length).toEqual(1);
    expect(mockSetMe.mock.calls.length).toEqual(1);
  });
});
