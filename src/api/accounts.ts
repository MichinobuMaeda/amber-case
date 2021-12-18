import {
  onSnapshot, doc, collection, getDoc,
} from 'firebase/firestore';

import {
  CastedDoc, Account, themeModeList, defaultThemeMode,
} from './models';
import {
  castDoc, setDocProperties, mergeUpdatedDocs,
  HandleListenError,
} from './firebase';
import { Context } from './AppContext';
import { listenGroups } from './groups';

export const updateMe = (
  context: Context,
  handleListenError: HandleListenError,
  me?: Account,
) => {
  const { setMe, setThemeMode } = context;
  if (!me
    || !me.id
    || !me.valid
    || me.deletedAt
    || (context.me!.id && context.me!.id !== me.id)
    || (context.me!.id && context.me!.admin !== me.admin)
    || (context.me!.id && context.me!.tester !== me.tester)
  ) {
    throw Error();
  }
  setMe(me);
  setThemeMode(themeModeList[me.themeMode || defaultThemeMode]);
  listenGroups(context, handleListenError);
  return true;
};

export const listenAccounts = async (
  context: Context,
  uid: string,
  handleListenError: HandleListenError,
) => {
  const { db, setAccounts } = context;
  const meDoc = await getDoc(doc(db, 'accounts', uid));
  try {
    const me = castDoc(meDoc) as Account;
    updateMe(context, handleListenError, meDoc.exists() ? me : undefined);
    if (context.unsub.get('accounts')) {
      return true;
    }
    const isAdmin = me.admin;
    context.unsub.set('accounts', isAdmin
      ? onSnapshot(
        collection(db, 'accounts'),
        async (snapshot) => {
          try {
            const accounts = mergeUpdatedDocs(
              snapshot,
              context.accounts as CastedDoc[],
            ) as Account[];
            const updatedMe = accounts.find((item) => item.id === uid);
            updateMe(context, handleListenError, updatedMe);
            setAccounts(accounts);
          } catch (e) { await handleListenError(context); }
        },
        async () => { await handleListenError(context); },
      )
      : onSnapshot(
        doc(db, 'accounts', uid),
        async (snapshot) => {
          try {
            updateMe(
              context,
              handleListenError,
              snapshot.exists() ? castDoc(snapshot) as Account : undefined,
            );
          } catch (e) { await handleListenError(context); }
        },
        async () => { await handleListenError(context); },
      ));
    return true;
  } catch (e) {
    await handleListenError(context);
    return false;
  }
};

export const setAccountProperties = (
  context: Context,
  id: string,
  props: any,
) => setDocProperties(context, 'accounts', id, props);
