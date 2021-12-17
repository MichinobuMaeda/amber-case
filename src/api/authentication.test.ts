import {
  signInWithEmailLink,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  sendEmailVerification,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  signOut,
  reload,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import {
  doc, getDoc, Unsubscribe, onSnapshot,
} from 'firebase/firestore';

import { Conf, Account } from './models';
import {
  initializeMock, mockContext, mockWindow, mockUrl,
} from '../setupTests';
import {
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
  handleListenError,
  setMyEmail,
  setMyPassword,
  listenFirebase,
  localKeyEmail,
  localKeyError,
  actionEmailVerification,
  actionReauthentication,
} from './authentication';

jest.mock('firebase/auth', () => ({
  signInWithEmailLink: jest.fn(),
  sendSignInLinkToEmail: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  signOut: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  reload: jest.fn(),
  EmailAuthProvider: { credential: jest.fn() },
}));

const docPath = 'docPath';
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  updateDoc: jest.fn(),
}));

beforeEach(() => {
  signInWithEmailLink.mockImplementation(() => 'default');
  sendSignInLinkToEmail.mockImplementation(() => false);
  initializeMock();
});

describe('handleSignInWithEmailLink(context, window)', () => {
  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockWindow.localStorage.getItem.mockImplementationOnce(() => email01);
    mockWindow.location.href = url01;
    signInWithEmailLink.mockImplementationOnce(() => { throw Error(); });
    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);

    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(2);
    expect(mockWindow.localStorage.removeItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.removeItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual('check your email address');

    expect(mockWindow.location.href).toEqual('https://example.com/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value';
    mockWindow.localStorage.getItem.mockImplementationOnce(() => email01);
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);

    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(2);
    expect(mockWindow.localStorage.removeItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.removeItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(signInWithEmailLink.mock.calls.length).toEqual(1);
    expect(signInWithEmailLink.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(signInWithEmailLink.mock.calls[0][1]).toEqual(email01);
    expect(signInWithEmailLink.mock.calls[0][2]).toEqual(url01);
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });

  it('set localKeyError: "failed to sign in" '
  + 'if no email address in localStorage.', async () => {
    const url01 = 'https://example.com/?name=value';
    mockWindow.location.href = url01;

    await handleSignInWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual('failed to sign in');

    expect(signInWithEmailLink.mock.calls.length).toEqual(0);
    expect(mockWindow.location.href).toEqual('https://example.com/');
  });
});

describe('restoreAuthError(context, window)', () => {
  it('restore localKeyError to the service object.', async () => {
    mockWindow.localStorage.getItem.mockImplementationOnce(() => 'test01');

    restoreAuthError(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyError);

    expect(mockContext.authError).toEqual('test01');
    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.removeItem.mock.calls[0][0]).toEqual(localKeyError);

    restoreAuthError(mockContext, mockWindow);

    expect(mockContext.authError).toBeFalsy();
    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(2);
    expect(mockWindow.localStorage.removeItem.mock.calls[1][0]).toEqual(localKeyError);
  });
});

describe('handelSendSignInLinkToEmail(context, window, email)', () => {
  it('calls signInWithEmailAndPassword(auth, email, { url, handleCodeInApp })', async () => {
    const handleCodeInApp = true;
    mockContext.conf = { url: mockUrl } as Conf;
    const email = 'test01@example.com';
    const param2 = { url: mockUrl, handleCodeInApp };

    await handelSendSignInLinkToEmail(mockContext, mockWindow, email);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual(email);
    expect(sendSignInLinkToEmail.mock.calls.length).toEqual(1);
    expect(sendSignInLinkToEmail.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(sendSignInLinkToEmail.mock.calls[0][1]).toEqual(email);
    expect(sendSignInLinkToEmail.mock.calls[0][2]).toEqual(param2);
  });
});

describe('handleSignInWithPassword(context, email, password)', () => {
  it('calls signInWithEmailAndPassword(auth, email, password)', async () => {
    const email = 'test01@example.com';
    const password = 'password01';

    await handleSignInWithPassword(mockContext, email, password);

    expect(signInWithEmailAndPassword.mock.calls.length).toEqual(1);
    expect(signInWithEmailAndPassword.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(signInWithEmailAndPassword.mock.calls[0][1]).toEqual(email);
    expect(signInWithEmailAndPassword.mock.calls[0][2]).toEqual(password);
  });
});

describe('handleSendEmailVerification(context)', () => {
  it('calls sendEmailVerification(auth.currentUser)', async () => {
    const mockUser = { uid: 'id01' };
    mockContext.auth = { currentUser: mockUser };

    await handleSendEmailVerification(mockContext);

    expect(sendEmailVerification.mock.calls.length).toEqual(1);
    expect(sendEmailVerification.mock.calls[0][0]).toEqual(mockUser);
  });
});

describe('handelReauthenticateLinkToEmail(context, window)', () => {
  it('sets email to localStrage and call sendSignInLinkToEmail() with reauth param.', async () => {
    const mockUser = { uid: 'id01', email: 'id01@example.com' };
    mockContext.auth = { currentUser: mockUser };
    mockContext.conf!.url = mockUrl;
    await handelReauthenticateLinkToEmail(mockContext, mockWindow);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual('id01@example.com');

    expect(sendSignInLinkToEmail.mock.calls.length).toEqual(1);
    expect(sendSignInLinkToEmail.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(sendSignInLinkToEmail.mock.calls[0][1]).toEqual('id01@example.com');
    expect(sendSignInLinkToEmail.mock.calls[0][2]).toEqual({
      url: `${mockUrl}${actionReauthentication}`,
      handleCodeInApp: true,
    });
  });
});

describe('handleReauthenticateWithEmailLink(context, window)', () => {
  it('set localKeyError: "check your email address" '
  + 'if failed to sign in.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value#/';
    mockWindow.localStorage.getItem.mockImplementationOnce(() => email01);
    mockWindow.location.href = url01;
    mockContext.conf!.url = 'https://example.com/';
    signInWithEmailLink.mockImplementationOnce(() => { throw Error(); });

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);

    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(2);
    expect(mockWindow.localStorage.removeItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.removeItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual('check your email address');

    expect(mockWindow.location.replace.mock.calls.length).toEqual(1);
    expect(mockWindow.location.replace.mock.calls[0][0]).toEqual('https://example.com/#/');
  });

  it('call signInWithEmailLink() '
  + 'if an email address in localStorage.', async () => {
    const email01 = 'abc@example.com';
    const url01 = 'https://example.com/?name=value#/';
    mockWindow.localStorage.getItem.mockImplementationOnce(() => email01);
    mockWindow.location.href = url01;
    mockContext.conf!.url = 'https://example.com/';

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);

    expect(mockWindow.localStorage.removeItem.mock.calls.length).toEqual(2);
    expect(mockWindow.localStorage.removeItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(mockWindow.localStorage.removeItem.mock.calls[1][0]).toEqual(localKeyError);

    expect(signInWithEmailLink.mock.calls.length).toEqual(1);
    expect(signInWithEmailLink.mock.calls[0][0]).toEqual(mockContext.auth);
    expect(signInWithEmailLink.mock.calls[0][1]).toEqual(email01);
    expect(signInWithEmailLink.mock.calls[0][2]).toEqual(url01);

    expect(mockWindow.location.replace.mock.calls.length).toEqual(1);
    expect(mockWindow.location.replace.mock.calls[0][0]).toEqual('https://example.com/#/me');
  });

  it('set localKeyError: "failed to sign in" '
  + 'if no email address in localStorage.', async () => {
    const url01 = 'https://example.com/?name=value#/';
    mockWindow.location.href = url01;
    mockContext.conf!.url = 'https://example.com/';

    await handleReauthenticateWithEmailLink(mockContext, mockWindow);

    expect(mockWindow.localStorage.setItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.setItem.mock.calls[0][0]).toEqual(localKeyError);
    expect(mockWindow.localStorage.setItem.mock.calls[0][1]).toEqual('failed to sign in');

    expect(signInWithEmailLink.mock.calls.length).toEqual(0);

    expect(mockWindow.location.replace.mock.calls.length).toEqual(1);
    expect(mockWindow.location.replace.mock.calls[0][0]).toEqual('https://example.com/#/');
  });
});

describe('handleReauthenticateWithPassword(context, password)', () => {
  it('calls reauthenticateWithCredential()', async () => {
    const mockCredential = { name: 'credential object' };
    const mockPassword = 'id01password';
    const mockUser = { uid: 'id01', email: 'id01@example.com' };
    EmailAuthProvider.credential.mockImplementationOnce(() => mockCredential);
    mockContext.auth = { currentUser: mockUser };

    await handleReauthenticateWithPassword(mockContext, mockPassword);

    expect(EmailAuthProvider.credential.mock.calls.length).toEqual(1);
    expect(EmailAuthProvider.credential.mock.calls[0][0]).toEqual(mockUser.email);
    expect(EmailAuthProvider.credential.mock.calls[0][1]).toEqual(mockPassword);

    expect(reauthenticateWithCredential.mock.calls.length).toEqual(1);
    expect(reauthenticateWithCredential.mock.calls[0][0]).toEqual(mockUser);
    expect(reauthenticateWithCredential.mock.calls[0][1]).toEqual(mockCredential);
  });
});

describe('handleReloadAuthUser(context)', () => {
  it('call reload(user), call setAuthUser({}) and call setAuthUser(user)', async () => {
    mockContext.authUser = { uid: 'id01' } as User;

    await handleReloadAuthUser(mockContext);

    expect(reload.mock.calls.length).toEqual(1);
    expect(reload.mock.calls[0][0]).toEqual(mockContext.authUser);
    expect(mockContext.setAuthUser.mock.calls.length).toEqual(2);
    expect(mockContext.setAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockContext.setAuthUser.mock.calls[1][0]).toEqual(mockContext.auth.currentUser);
  });
});

describe('onSignOut(context)', () => {
  it('call unsubUserData(), call setMe with {}, call setAuthUser with {}.', async () => {
    const mockUnsub = jest.fn();
    mockContext.unsub = new Map<string, Unsubscribe>(Object.entries({
      unsub01: mockUnsub,
    }));
    onSignOut(mockContext);

    expect(mockContext.unsub.size).toEqual(0);
    expect(mockContext.setMe.mock.calls.length).toEqual(1);
    expect(mockContext.setMe.mock.calls[0][0]).toEqual({});
    expect(mockContext.setAccounts.mock.calls.length).toEqual(1);
    expect(mockContext.setAccounts.mock.calls[0][0]).toEqual([]);
    expect(mockContext.setGroups.mock.calls.length).toEqual(1);
    expect(mockContext.setGroups.mock.calls[0][0]).toEqual([]);
    expect(mockContext.setAuthUser.mock.calls.length).toEqual(1);
    expect(mockContext.setAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
  });
});

describe('handleSignOut(context)', () => {
  it('call onSignOut(), call onSignOut(auth).', async () => {
    const mockUnsub = jest.fn();
    mockContext.unsub = new Map<string, Unsubscribe>(Object.entries({
      unsub01: mockUnsub,
    }));
    handleSignOut(mockContext);

    expect(mockContext.unsub.size).toEqual(0);
    expect(mockContext.setMe.mock.calls.length).toEqual(1);
    expect(mockContext.setMe.mock.calls[0][0]).toEqual({});
    expect(mockContext.setAuthUser.mock.calls.length).toEqual(1);
    expect(mockContext.setAuthUser.mock.calls[0][0]).toEqual({});
    expect(mockUnsub.mock.calls.length).toEqual(1);
    expect(signOut.mock.calls.length).toEqual(1);
    expect(signOut.mock.calls[0][0]).toEqual(mockContext.auth);
  });
});

describe('handleListenError(context)', () => {
  it('calls handleSignOut(context)', async () => {
    await handleListenError(mockContext);
    expect(signOut.mock.calls.length).toEqual(1);
  });
});

describe('setMyEmail(context, email)', () => {
  it('call updateEmail(user, email).', async () => {
    const email = 'test01@example.com';
    const user = { uid: 'id01' };
    mockContext.auth = { currentUser: user };
    await setMyEmail(mockContext, email);

    expect(updateEmail.mock.calls.length).toEqual(1);
    expect(updateEmail.mock.calls[0][0]).toEqual(user);
    expect(updateEmail.mock.calls[0][1]).toEqual(email);
  });
});

describe('setMyPassword(context, password)', () => {
  it('call updatePassword(user, password).', async () => {
    const password = 'password01';
    const user = { uid: 'id01' };
    mockContext.auth = { currentUser: user };
    await setMyPassword(mockContext, password);

    expect(updatePassword.mock.calls.length).toEqual(1);
    expect(updatePassword.mock.calls[0][0]).toEqual(user);
    expect(updatePassword.mock.calls[0][1]).toEqual(password);
  });
});

describe('listenFirebase(context, windows)', () => {
  it('calls handleReauthenticateWithEmailLink() '
  + 'if has param of actionReauthentication.', async () => {
    mockWindow.location.href += actionReauthentication;
    mockWindow.localStorage.getItem.mockImplementationOnce(() => 'abc@example.com');

    await listenFirebase(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(signInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls window.location.replace() '
  + 'if has param of actionEmailVerification.', async () => {
    mockContext.conf!.url = 'https://example.com/';
    mockWindow.location.href += actionEmailVerification;

    await listenFirebase(mockContext, mockWindow);

    expect(mockWindow.location.replace.mock.calls.length).toEqual(1);
    expect(mockWindow.location.replace.mock.calls[0][0]).toEqual(`${mockContext.conf!.url}#/`);
  });

  it('calls handleSignInWithEmailLink() '
  + 'if url is sign-in with emai link.', async () => {
    mockWindow.localStorage.getItem.mockImplementationOnce(() => 'abc@example.com');
    isSignInWithEmailLink.mockImplementationOnce(() => true);

    await listenFirebase(mockContext, mockWindow);

    expect(mockWindow.localStorage.getItem.mock.calls.length).toEqual(1);
    expect(mockWindow.localStorage.getItem.mock.calls[0][0]).toEqual(localKeyEmail);
    expect(signInWithEmailLink.mock.calls.length).toEqual(1);
  });

  it('calls onAuthStateChanged() '
  + 'if url is not sign-in with emai link.', async () => {
    doc.mockImplementation(() => ({ path: docPath }));
    const mockGetItem = jest.fn(() => 'abc@example.com');
    const mockRemoveItem = jest.fn();
    mockContext.unsubConf = () => {};
    onSnapshot.mockImplementation(() => () => {});
    mockWindow.localStorage.getItem = mockGetItem;
    mockWindow.localStorage.removeItem = mockRemoveItem;

    await listenFirebase(mockContext, mockWindow);

    expect(onAuthStateChanged.mock.calls.length).toEqual(1);
    expect(onAuthStateChanged.mock.calls[0][0]).toEqual(mockContext.auth);

    const cb = onAuthStateChanged.mock.calls[0][1];
    const authUser01 = { uid: 'id01' } as User;
    doc.mockImplementationOnce(() => ({ id: authUser01.uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({
        id: authUser01.uid,
        exists: () => true,
        data: () => ({ valid: true }),
      })),
    );

    await cb(authUser01);

    expect(mockContext.setAuthUser.mock.calls.length).toEqual(1);
    expect(mockContext.setAuthUser.mock.calls[0][0]).toEqual(authUser01);
    expect(signOut.mock.calls.length).toEqual(0);

    mockContext.authUser = authUser01;
    const authUser02 = { uid: 'id02' } as User;
    doc.mockImplementationOnce(() => ({ id: authUser02.uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({
        id: authUser02.uid,
        exists: () => true,
        data: () => ({ valid: true }),
      })),
    );

    await cb(authUser02);

    expect(mockContext.setAuthUser.mock.calls.length).toEqual(2);
    expect(mockContext.setAuthUser.mock.calls[1][0]).toEqual(authUser02);
    expect(signOut.mock.calls.length).toEqual(0);

    mockContext.authUser = authUser02;
    mockContext.me = { id: authUser02.uid } as Account;
    const count01 = mockContext.setMe.mock.calls.length;

    await cb(null);

    expect(mockContext.setAuthUser.mock.calls.length).toEqual(3);
    expect(mockContext.setAuthUser.mock.calls[2][0]).toEqual({});
    expect(mockContext.setMe.mock.calls.length).toEqual(count01 + 1);
    expect(mockContext.setMe.mock.calls[count01][0]).toEqual({});
    expect(signOut.mock.calls.length).toEqual(0);

    mockContext.authUser = {} as User;
    mockContext.me = {} as Account;
    mockContext.authUser = null;

    await cb(null);

    expect(mockContext.setAuthUser.mock.calls.length).toEqual(4);
    expect(mockContext.setAuthUser.mock.calls[3][0]).toEqual({});
    expect(signOut.mock.calls.length).toEqual(0);

    mockContext.authUser = {} as User;
    mockContext.me = {} as Account;

    await cb(null);

    expect(mockContext.setAuthUser.mock.calls.length).toEqual(4);
    expect(signOut.mock.calls.length).toEqual(0);

    mockContext.authUser = authUser02;
    const authUser03 = { uid: 'id03' };
    doc.mockImplementationOnce(() => ({ id: authUser03.uid }));
    getDoc.mockImplementationOnce(
      () => Promise.resolve(true).then(() => ({
        id: authUser02.uid,
        exists: () => false,
      })),
    );

    await cb(authUser03);

    expect(signOut.mock.calls.length).toEqual(1);
  });
});
