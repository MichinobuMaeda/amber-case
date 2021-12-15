import {
  onSnapshot, doc, collection, getDoc,
} from 'firebase/firestore';

import { castDoc, setDocProperties, mergeUpdatedDocs } from './firebase';
import { listenGroups } from './groups';

export const updateMe = (context, me, handleListenError) => {
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
  listenGroups(context, handleListenError);
  return true;
};

export const listenAccounts = async (context, uid, handleListenError) => {
  const { db, setAccounts } = context;
  const meDoc = await getDoc(doc(db, 'accounts', uid));
  try {
    updateMe(context, meDoc.exists ? castDoc(meDoc) : null, handleListenError);
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
            updateMe(context, me, handleListenError);
            setAccounts(accounts);
          } catch (e) { await handleListenError(context); }
        },
        async () => { await handleListenError(context); },
      )
      : onSnapshot(
        doc(db, 'accounts', uid),
        async (snapshot) => {
          try {
            updateMe(context, snapshot.exists ? castDoc(snapshot) : null, handleListenError);
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

export const setAccountProperties = (context, id, props) => setDocProperties(context, 'accounts', id, props);
