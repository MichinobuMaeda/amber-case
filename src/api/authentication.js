import {
  reload, isSignInWithEmailLink, onAuthStateChanged,
  sendSignInLinkToEmail, signInWithEmailAndPassword,
  signInWithEmailLink, sendEmailVerification, signOut,
  reauthenticateWithCredential, updateEmail, updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';

import { reauthentication } from '../conf';
import { unsubUserData } from './firebase';
import { listenConf } from './service';
import { listenAccounts } from './accounts';

export const actionEmailVerification = '?action=emailverification';
export const actionReauthentication = '?action=reauthentication';

export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

export const handleSignInWithEmailLink = async ({ auth }, window) => {
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

export const restoreAuthError = (context, window) => {
  // eslint-disable-next-line no-param-reassign
  context.authError = window.localStorage.getItem(localKeyError);
  window.localStorage.removeItem(localKeyError);
};

export const handelSendSignInLinkToEmail = async (context, window, email) => {
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(context.auth, email, {
    url: context.conf.url,
    handleCodeInApp: true,
  });
};

export const handleSignInWithPassword = async (context, email, password) => {
  await signInWithEmailAndPassword(context.auth, email, password);
};

export const handleSendEmailVerification = async (context) => {
  await sendEmailVerification(context.auth.currentUser, {
    url: `${window.location.href}${actionEmailVerification}`,
    handleCodeInApp: true,
  });
};

export const handelReauthenticateLinkToEmail = async (context, window) => {
  const { email } = context.auth.currentUser;
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(context.auth, email, {
    url: `${context.conf.url}${actionReauthentication}`,
    handleCodeInApp: true,
  });
};

export const handleReauthenticateWithEmailLink = async (context, window) => {
  const email = window.localStorage.getItem(localKeyEmail);
  window.localStorage.removeItem(localKeyEmail);
  window.localStorage.removeItem(localKeyError);
  if (email) {
    try {
      await signInWithEmailLink(context.auth, email, window.location.href);
      window.location.replace(`${context.conf.url}#/me`);
    } catch (e) {
      window.localStorage.setItem(localKeyError, 'check your email address');
      window.location.replace(window.location.href.replace(/\?.*#\//, '#/'));
    }
  } else {
    window.localStorage.setItem(localKeyError, 'failed to sign in');
    window.location.replace(window.location.href.replace(/\?.*#\//, '#/'));
  }
};

export const handleReauthenticateWithPassword = async (context, password) => {
  await reauthenticateWithCredential(
    context.auth.currentUser,
    EmailAuthProvider.credential(
      context.auth.currentUser.email,
      password,
    ),
  );
  context.setReauthenticationTimeout(reauthentication.timeout);
};

export const handleReloadAuthUser = async (context) => {
  await reload(context.authUser);
  context.setAuthUser({});
  context.setAuthUser(context.auth.currentUser);
};

export const onSignOut = (context) => {
  unsubUserData(context);
  context.setGroups([]);
  context.setAccounts([]);
  context.setMe({});
  context.setAuthUser({});
  context.setReauthenticationTimeout(0);
};

export const handleSignOut = async (context) => {
  onSignOut(context);
  await signOut(context.auth);
};

export const handleListenError = async (context) => {
  // eslint-disable-next-line no-param-reassign
  context.listenError = 'firestore listen error';
  await handleSignOut(context);
};

export const setMyEmail = async (context, email) => {
  await updateEmail(context.auth.currentUser, email);
  await handleReloadAuthUser(context);
};

export const setMyPassword = async (context, password) => {
  await updatePassword(context.auth.currentUser, password);
};

export const listenFirebase = async (context, window) => {
  await listenConf(context, handleListenError);
  if (window.location.href.includes(actionReauthentication)) {
    await handleReauthenticateWithEmailLink(context, window);
  } else if (window.location.href.includes(actionEmailVerification)) {
    window.location.replace(`${context.conf.url}#/`);
  } else if (isSignInWithEmailLink(context.auth, window.location.href)) {
    await handleSignInWithEmailLink(context, window);
  } else {
    restoreAuthError(context, window);
    onAuthStateChanged(context.auth, async (user) => {
      const prevUid = context.authUser.uid;
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
      } else if (context.authUser.uninitialized) {
        context.setAuthUser({});
      }
    });
  }
};
