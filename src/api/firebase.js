import {
  isSignInWithEmailLink, onAuthStateChanged,
  sendSignInLinkToEmail, signInWithEmailAndPassword,
  signInWithEmailLink, signOut,
} from 'firebase/auth';

export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

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
    service.unsubConf = db.collection('service').doc('conf').onSnapshot(
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

export const onSignOut = (service) => {
  unsubUserData(service);
  service.setMe({});
  service.setAuthUser({});
};

export const handleSignOut = async (service) => {
  onSignOut(service);
  await signOut(service.auth);
};

export const listenMe = (service, uid) => {
  const { db, setMe } = service;
  const meRef = db.collection('accounts').doc(uid);
  if (!service.unsub[meRef.path]) {
    // eslint-disable-next-line no-param-reassign
    service.unsub[meRef.path] = meRef.onSnapshot(
      async (snapshot) => {
        if (
          snapshot.exists
          && snapshot.data().valid
          && !snapshot.data().deletedAt
        ) {
          setMe(castDoc(snapshot));
        } else {
          // eslint-disable-next-line no-param-reassign
          service.authError = 'unregistered account';
          await handleSignOut(service);
        }
      },
    );
  }
};

export const listenFirebase = async (service, window) => {
  if (isSignInWithEmailLink(service.auth, window.location.href)) {
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
      } else if (prevUid) {
        onSignOut(service);
      }
    });
  }
};
