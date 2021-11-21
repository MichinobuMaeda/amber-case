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
  onSnapshot, doc, updateDoc,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { reauthentication } from '../conf';

export const actionEmailVerification = '?action=emailverification';
export const actionReauthentication = '?action=reauthentication';

export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

export const initializeFirebase = (firebaseConfig) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const functions = getFunctions(firebaseApp);

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

export const restoreAuthError = (service, window) => {
  // eslint-disable-next-line no-param-reassign
  service.authError = window.localStorage.getItem(localKeyError);
  window.localStorage.removeItem(localKeyError);
};

export const listenConf = (service) => {
  const { db, setConf } = service;
  if (!service.unsubConf) {
    // eslint-disable-next-line no-param-reassign
    service.unsubConf = onSnapshot(
      doc(db, 'service', 'conf'),
      (snapshot) => {
        setConf(snapshot.exists ? castDoc(snapshot) : { error: true });
      },
    );
  }
};

export const handelSendSignInLinkToEmail = async (service, window, email) => {
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(service.auth, email, {
    url: service.conf.url,
    handleCodeInApp: true,
  });
};

export const handleSignInWithPassword = async (service, email, password) => {
  await signInWithEmailAndPassword(service.auth, email, password);
};

export const handleSendEmailVerification = async (service) => {
  await sendEmailVerification(service.auth.currentUser, {
    url: `${window.location.href}${actionEmailVerification}`,
    handleCodeInApp: true,
  });
};

export const handelReauthenticateLinkToEmail = async (service, window) => {
  const { email } = service.auth.currentUser;
  window.localStorage.setItem(localKeyEmail, email);
  await sendSignInLinkToEmail(service.auth, email, {
    url: `${window.location.href}${actionReauthentication}`,
    handleCodeInApp: true,
  });
};

export const handleReauthenticateWithEmailLink = async (service, window) => {
  const url = window.location.href.replace(actionReauthentication, '');
  const email = window.localStorage.getItem(localKeyEmail);
  window.localStorage.removeItem(localKeyEmail);
  window.localStorage.removeItem(localKeyError);
  if (email) {
    try {
      await signInWithEmailLink(service.auth, email, url);
    } catch (e) {
      window.localStorage.setItem(localKeyError, 'check your email address');
    }
  } else {
    window.localStorage.setItem(localKeyError, 'failed to sign in');
  }

  window.location.replace(url.replace(/\?.*#\//, '#/'));
};

export const handleReauthenticateWithPassword = async (service, password) => {
  await reauthenticateWithCredential(
    service.auth.currentUser,
    EmailAuthProvider.credential(
      service.auth.currentUser.email,
      password,
    ),
  );
  service.setReauthenticationTimeout(reauthentication.timeout);
};

export const handleReloadAuthUser = async (service) => {
  await reload(service.authUser);
  service.setAuthUser({});
  service.setAuthUser(service.auth.currentUser);
};

export const onSignOut = (service) => {
  unsubUserData(service);
  service.setMe({});
  service.setAuthUser({});
  service.setReauthenticationTimeout(0);
};

export const handleSignOut = async (service) => {
  onSignOut(service);
  await signOut(service.auth);
};

export const listenMe = (service, uid) => {
  const { db, setMe, setThemeMode } = service;
  const meRef = doc(db, 'accounts', uid);
  if (!service.unsub[meRef.path]) {
    // eslint-disable-next-line no-param-reassign
    service.unsub[meRef.path] = onSnapshot(
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
        } else {
          // eslint-disable-next-line no-param-reassign
          service.authError = 'unregistered account';
          await handleSignOut(service);
        }
      },
    );
  }
};

export const setAccountProperties = async (service, id, props) => {
  const { db } = service;
  await updateDoc(doc(db, 'accounts', id), {
    ...props,
    updatedAt: new Date(),
  });
};

export const setMyEmail = async (service, email) => {
  await updateEmail(service.auth.currentUser, email);
};

export const setMyPassword = async (service, password) => {
  await updatePassword(service.auth.currentUser, password);
};

export const listenFirebase = async (service, window) => {
  if (window.location.href.includes(actionReauthentication)) {
    await handleReauthenticateWithEmailLink(service, window);
  } else if (window.location.href.includes(actionEmailVerification)) {
    window.location.replace(
      window.location.href.replace(actionEmailVerification, ''),
    );
  } else if (isSignInWithEmailLink(service.auth, window.location.href)) {
    await handleSignInWithEmailLink(service, window);
  } else {
    restoreAuthError(service, window);
    listenConf(service);
    onAuthStateChanged(service.auth, (user) => {
      const prevUid = service.authUser.uid;
      if (user) {
        if (prevUid && prevUid !== user.uid) {
          unsubUserData(service);
        }
        service.setAuthUser(user);
        listenMe(service, user.uid);
        service.setReauthenticationTimeout(reauthentication.timeout);
      } else if (prevUid) {
        onSignOut(service);
      }
    });
  }
};

export const isSignedIn = (service) => service.me.id && service.authUser.emailVerified;
