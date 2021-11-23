import { initializeApp } from 'firebase/app';
import {
  getAuth, connectAuthEmulator, reload,
  isSignInWithEmailLink, onAuthStateChanged,
  sendSignInLinkToEmail, signInWithEmailAndPassword,
  signInWithEmailLink, sendEmailVerification, signOut,
  reauthenticateWithCredential, updateEmail, updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  getFirestore, connectFirestoreEmulator,
  onSnapshot, doc, collection, where, query, updateDoc,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { region, reauthentication } from '../conf';

export const actionEmailVerification = '?action=emailverification';
export const actionReauthentication = '?action=reauthentication';

export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

export const initializeFirebase = (firebaseConfig) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const functions = getFunctions(firebaseApp, region);

  auth.languageCode = 'ja';

  if (firebaseConfig.apiKey === 'FIREBASE_API_KEY') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  return {
    auth, db, storage, functions,
  };
};

export const unsubUserData = ({ unsub }) => {
  Object.keys(unsub).forEach((key) => {
    if (typeof unsub[key] === 'function') {
      unsub[key]();
    }
    // eslint-disable-next-line no-param-reassign
    delete unsub[key];
  });
};

export const castDoc = (snapshot) => {
  if (snapshot && snapshot.exists) {
    const castData = (data) => {
      if (data === null) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map((item) => castData(item));
      }
      if (data.toDate && typeof data.toDate === 'function') {
        return data.toDate();
      }
      if (typeof data !== 'object') {
        return data;
      }
      return Object.keys(data).reduce(
        (ret, cur) => ({
          ...ret,
          [cur]: castData(data[cur]),
        }),
        {},
      );
    };
    return castData({ id: snapshot.id, ...snapshot.data() });
  }
  return {};
};

export const updateApp = async (navigator, window) => {
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  window.location.reload();
};

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
    url: `${window.location.href}${actionReauthentication}`,
    handleCodeInApp: true,
  });
};

export const handleReauthenticateWithEmailLink = async (context, window) => {
  const url = window.location.href.replace(actionReauthentication, '');
  const email = window.localStorage.getItem(localKeyEmail);
  window.localStorage.removeItem(localKeyEmail);
  window.localStorage.removeItem(localKeyError);
  if (email) {
    try {
      await signInWithEmailLink(context.auth, email, url);
    } catch (e) {
      window.localStorage.setItem(localKeyError, 'check your email address');
    }
  } else {
    window.localStorage.setItem(localKeyError, 'failed to sign in');
  }

  window.location.replace(url.replace(/\?.*#\//, '#/'));
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
  context.setMe({});
  context.setAuthUser({});
  context.setReauthenticationTimeout(0);
};

export const handleSignOut = async (context) => {
  onSignOut(context);
  await signOut(context.auth);
};

export const listenConf = (context) => {
  const { db, setConf } = context;
  if (!context.unsubConf) {
    // eslint-disable-next-line no-param-reassign
    context.unsubConf = onSnapshot(
      doc(db, 'service', 'conf'),
      (snapshot) => {
        setConf(snapshot.exists ? castDoc(snapshot) : { error: true });
      },
    );
  }
};

export const setMyEmail = async (context, email) => {
  await updateEmail(context.auth.currentUser, email);
  await handleReloadAuthUser(context);
};

export const setMyPassword = async (context, password) => {
  await updatePassword(context.auth.currentUser, password);
};

const setDocProperties = async (context, collectionName, id, props) => {
  const { db } = context;
  await updateDoc(doc(db, collectionName, id), {
    ...props,
    updatedAt: new Date(),
  });
};

export const setConfProperties = async (
  context, props,
) => setDocProperties(context, 'service', 'conf', props);

export const listenGroups = (context) => {
  const { db, me, setGroups } = context;
  if (context.unsub.groups) {
    context.unsub.groups();
  }
  // eslint-disable-next-line no-param-reassign
  context.unsub.groups = onSnapshot(
    query(
      collection(db, 'groups'),
      where('accounts', 'array-contains', me.id),
    ),
    async (snapshot) => {
      setGroups(snapshot.docs.map(castDoc));
    },
  );
};

export const setGroupProperties = (
  context, id, props,
) => setDocProperties(context, 'groups', id, props);

export const listenMe = (context, uid) => {
  const { db, setMe, setThemeMode } = context;
  const meRef = doc(db, 'accounts', uid);
  if (!context.unsub[meRef.path]) {
    // eslint-disable-next-line no-param-reassign
    context.unsub[meRef.path] = onSnapshot(
      meRef,
      async (snapshot) => {
        if (
          snapshot.exists
          && snapshot.data().valid
          && !snapshot.data().deletedAt
        ) {
          const me = castDoc(snapshot);
          setMe(me);
          setThemeMode(me.themeMode || 'light');
          listenGroups(context);
        } else {
          // eslint-disable-next-line no-param-reassign
          context.authError = 'unregistered account';
          await handleSignOut(context);
        }
      },
    );
  }
};

export const setAccountProperties = (
  context, id, props,
) => setDocProperties(context, 'accounts', id, props);

export const listenFirebase = async (context, window) => {
  if (window.location.href.includes(actionReauthentication)) {
    await handleReauthenticateWithEmailLink(context, window);
  } else if (window.location.href.includes(actionEmailVerification)) {
    window.location.replace(
      window.location.href.replace(actionEmailVerification, ''),
    );
  } else if (isSignInWithEmailLink(context.auth, window.location.href)) {
    await handleSignInWithEmailLink(context, window);
  } else {
    restoreAuthError(context, window);
    listenConf(context);
    onAuthStateChanged(context.auth, (user) => {
      const prevUid = context.authUser.uid;
      if (user) {
        if (prevUid && prevUid !== user.uid) {
          unsubUserData(context);
        }
        context.setAuthUser(user);
        listenMe(context, user.uid);
        context.setReauthenticationTimeout(reauthentication.timeout);
      } else if (prevUid) {
        onSignOut(context);
      }
    });
  }
};

export const isSignedIn = (context) => context.me.id && context.authUser.emailVerified;
