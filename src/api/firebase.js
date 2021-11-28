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
  onSnapshot, doc, collection, where, query, updateDoc, getDoc,
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

export const setMyEmail = async (context, email) => {
  await updateEmail(context.auth.currentUser, email);
  await handleReloadAuthUser(context);
};

export const setMyPassword = async (context, password) => {
  await updatePassword(context.auth.currentUser, password);
};

// export for test
export const handleListenError = async (context) => {
  // eslint-disable-next-line no-param-reassign
  context.listenError = 'firestore listen error';
  await handleSignOut(context);
};

// export for test
export const mergeUpdatedDocs = (snapshot, old) => snapshot.docChanges().reduce(
  (ret, cur) => {
    const exclusives = ret.filter((item) => item.id !== cur.doc.id);
    if (['added', 'modified'].includes(cur.type)) {
      return [...exclusives, castDoc(cur.doc)];
    }
    if (cur.type === 'removed') {
      return exclusives;
    }
    return ret;
  },
  old,
);

export const listenConf = async (context) => {
  const { db, setConf } = context;
  if (!context.unsubConf) {
    try {
      const confRef = doc(db, 'service', 'conf');
      const conf = await getDoc(confRef);
      setConf(conf.exists ? castDoc(conf) : { error: true });
      // eslint-disable-next-line no-param-reassign
      context.unsubConf = onSnapshot(
        confRef,
        (snapshot) => {
          setConf(snapshot.exists ? castDoc(snapshot) : { error: true });
        },
      );
    } catch (e) {
      setConf({ error: true });
    }
  }
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
  if (!context.unsub.groups) {
    // eslint-disable-next-line no-param-reassign
    context.unsub.groups = onSnapshot(
      query(
        collection(db, 'groups'),
        where('accounts', 'array-contains', me.id),
      ),
      async (snapshot) => {
        const groups = mergeUpdatedDocs(snapshot, context.groups);
        setGroups(groups);
      },
      async () => { await handleListenError(context); },
    );
  }
};

export const setGroupProperties = (
  context, id, props,
) => setDocProperties(context, 'groups', id, props);

// export for test
export const updateMe = (context, me) => {
  const { setMe, setThemeMode } = context;
  if (!me
    || !me.id
    || !me.valid
    || me.deletedAt
    || (context.me.id && context.me.id !== me.id)
    || (context.me.id && context.me.admin !== me.admin)
    || (context.me.id && context.me.tester !== me.tester)
  ) {
    throw Error();
  }
  setMe(me);
  setThemeMode(me.themeMode || 'light');
  listenGroups(context);
  return true;
};

export const listenAccounts = async (context, uid) => {
  const { db, setAccounts } = context;
  const meDoc = await getDoc(doc(db, 'accounts', uid));
  try {
    updateMe(context, meDoc.exists ? castDoc(meDoc) : null);
    if (context.unsub.accounts) {
      return true;
    }
    const isAdmin = meDoc.data().admin;
    // eslint-disable-next-line no-param-reassign
    context.unsub.accounts = isAdmin
      ? onSnapshot(
        collection(db, 'accounts'),
        async (snapshot) => {
          try {
            const accounts = mergeUpdatedDocs(snapshot, context.accounts);
            const me = accounts.find((item) => item.id === uid);
            updateMe(context, me);
            setAccounts(accounts);
          } catch (e) { await handleListenError(context); }
        },
        async () => { await handleListenError(context); },
      )
      : onSnapshot(
        doc(db, 'accounts', uid),
        async (snapshot) => {
          try {
            updateMe(context, snapshot.exists ? castDoc(snapshot) : null);
          } catch (e) { await handleListenError(context); }
        },
        async () => { await handleListenError(context); },
      );
    return true;
  } catch (e) {
    await handleListenError(context);
    return false;
  }
};

export const setAccountProperties = (
  context, id, props,
) => setDocProperties(context, 'accounts', id, props);

export const listenFirebase = async (context, window) => {
  await listenConf(context);
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
        if (await listenAccounts(context, user.uid)) {
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
