import {
  reload, isSignInWithEmailLink, onAuthStateChanged,
  sendSignInLinkToEmail, signInWithEmailAndPassword,
  signInWithEmailLink, sendEmailVerification, signOut,
  reauthenticateWithCredential, updateEmail, updatePassword,
  EmailAuthProvider, User,
} from 'firebase/auth';

import { reauthentication } from '../conf';
import { Account } from './models';
import { Context } from './AppContext';
import { unsubUserData } from './firebase';
import { listenConf } from './service';
import { listenAccounts } from './accounts';

export const actionEmailVerification = '?action=emailverification';
export const actionReauthentication = '?action=reauthentication';

export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

export const handleSignInWithEmailLink = async (
  { auth }: Context,
  window: Window,
) => {
  const email = window.localStorage.getItem(localKeyEmail);
  window.localStorage.removeItem(localKeyEmail);
  window.localStorage.removeItem(localKeyError);
  if (email) {
    try {
      await signInWithEmailLink(auth, email, window.location.href);
    } catch (e) {
      window.localStorage.setItem(localKeyError, 'check your email address');
    }
  } else {
    window.localStorage.setItem(localKeyError, 'failed to sign in');
  }

  // eslint-disable-next-line no-param-reassign
  window.location.href = window.location.href.replace(/\?.*/, '');
};

export const restoreAuthError = (
  context: Context,
  window: Window,
) => {
  // eslint-disable-next-line no-param-reassign
  context.authError = window.localStorage.getItem(localKeyError);
  window.localStorage.removeItem(localKeyError);
};

export const handelSendSignInLinkToEmail = async (
  context: Context,
  window: Window,
  email: string,
) => {
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(context.auth, email, {
    url: context.conf!.url,
    handleCodeInApp: true,
  });
};

export const handleSignInWithPassword = async (
  context: Context,
  email: string,
  password: string,
) => {
  await signInWithEmailAndPassword(context.auth, email, password);
};

export const handleSendEmailVerification = async (
  context: Context,
) => {
  await sendEmailVerification(context.auth.currentUser, {
    url: `${window.location.href}${actionEmailVerification}`,
    handleCodeInApp: true,
  });
};

export const handelReauthenticateLinkToEmail = async (
  context: Context,
  window: Window,
) => {
  const { email } = context.auth.currentUser;
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(context.auth, email, {
    url: `${context.conf!.url}${actionReauthentication}`,
    handleCodeInApp: true,
  });
};

export const handleReauthenticateWithEmailLink = async (
  context: Context,
  window: Window,
) => {
  const email = window.localStorage.getItem(localKeyEmail);
  window.localStorage.removeItem(localKeyEmail);
  window.localStorage.removeItem(localKeyError);
  if (email) {
    try {
      await signInWithEmailLink(context.auth, email, window.location.href);
      window.location.replace(`${context.conf!.url}#/me`);
    } catch (e) {
      window.localStorage.setItem(localKeyError, 'check your email address');
      window.location.replace(window.location.href.replace(/\?.*#\//, '#/'));
    }
  } else {
    window.localStorage.setItem(localKeyError, 'failed to sign in');
    window.location.replace(window.location.href.replace(/\?.*#\//, '#/'));
  }
};

export const handleReauthenticateWithPassword = async (
  context: Context,
  password: string,
) => {
  await reauthenticateWithCredential(
    context.auth.currentUser,
    EmailAuthProvider.credential(
      context.auth.currentUser.email,
      password,
    ),
  );
  context.setReauthenticationTimeout(reauthentication.timeout);
};

export const handleReloadAuthUser = async (
  context: Context,
) => {
  await reload(context.authUser!);
  context.setAuthUser({} as User);
  context.setAuthUser(context.auth.currentUser);
};

export const onSignOut = (
  context: Context,
) => {
  unsubUserData(context);
  context.setGroups([]);
  context.setAccounts([]);
  context.setMe({} as Account);
  context.setAuthUser({} as User);
  context.setReauthenticationTimeout(0);
};

export const handleSignOut = async (
  context: Context,
) => {
  onSignOut(context);
  await signOut(context.auth);
};

export const handleListenError = async (
  context: Context,
) => {
  // eslint-disable-next-line no-param-reassign
  context.listenError = 'firestore listen error';
  await handleSignOut(context);
};

export const setMyEmail = async (
  context: Context,
  email: string,
) => {
  await updateEmail(context.auth.currentUser, email);
  await handleReloadAuthUser(context);
};

export const setMyPassword = async (
  context: Context,
  password: string,
) => {
  await updatePassword(context.auth.currentUser, password);
};

export const listenFirebase = async (
  context: Context,
  window: Window,
) => {
  await listenConf(context, handleListenError);
  if (window.location.href.includes(actionReauthentication)) {
    await handleReauthenticateWithEmailLink(context, window);
  } else if (window.location.href.includes(actionEmailVerification)) {
    window.location.replace(`${context.conf!.url}#/`);
  } else if (isSignInWithEmailLink(context.auth, window.location.href)) {
    await handleSignInWithEmailLink(context, window);
  } else {
    restoreAuthError(context, window);
    onAuthStateChanged(context.auth, async (user) => {
      const prevUid = context.authUser?.uid;
      if (user) {
        if (prevUid && prevUid !== user.uid) {
          unsubUserData(context);
        }
        if (await listenAccounts(context, user.uid, handleListenError)) {
          context.setReauthenticationTimeout(reauthentication.timeout);
          context.setAuthUser(user);
        }
      } else if (prevUid) {
        onSignOut(context);
      } else if (!context.authUser) {
        context.setAuthUser({} as User);
      }
    });
  }
};
