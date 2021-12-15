import {
  onSnapshot, collection, where, query,
} from 'firebase/firestore';

import { setDocProperties, mergeUpdatedDocs } from './firebase';

export const listenGroups = (context, handleListenError) => {
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

export const setGroupProperties = (context, id, props) => setDocProperties(context, 'groups', id, props);
