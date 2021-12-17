import {
  onSnapshot, collection, where, query,
} from 'firebase/firestore';

import { Context } from './AppContext';
import { setDocProperties, mergeUpdatedDocs, HandleListenError } from './firebase';
import { CastedDoc, Group } from './models';

export const listenGroups = (
  context: Context,
  handleListenError: HandleListenError,
) => {
  const { db, me, setGroups } = context;
  if (!context.unsub.get('groups')) {
    // eslint-disable-next-line no-param-reassign
    context.unsub.set('groups', onSnapshot(
      query(
        collection(db, 'groups'),
        where('accounts', 'array-contains', me?.id),
      ),
      async (snapshot) => {
        const groups = mergeUpdatedDocs(snapshot, context.groups as CastedDoc[]) as Group[];
        setGroups(groups);
      },
      async () => { await handleListenError(context); },
    ));
  }
};

export const setGroupProperties = (
  context: Context,
  id: string,
  props: any,
) => setDocProperties(context, 'groups', id, props);
