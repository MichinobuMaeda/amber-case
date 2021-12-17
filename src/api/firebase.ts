import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore, connectFirestoreEmulator,
  QuerySnapshot, DocumentSnapshot,
  doc, updateDoc,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { region } from '../conf';
import { CastedDoc } from './models';
import { Context } from './AppContext';

export const initializeFirebase = (
  firebaseConfig: FirebaseOptions,
) => {
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

export const unsubUserData = (
  { unsub }: Context,
) => {
  unsub.forEach((value) => {
    value!();
  });
  unsub.clear();
};

export const castDoc = <Type>(
  snapshot: DocumentSnapshot,
): Type => {
  if (snapshot?.exists() ?? false) {
    const castData = (data: any): any => {
      if (data === null) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map((item: any) => castData(item));
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
  return {} as Type;
};

export const mergeUpdatedDocs = (
  snapshot: QuerySnapshot,
  old: CastedDoc[],
): CastedDoc[] => snapshot.docChanges().reduce<CastedDoc[]>(
  (ret: CastedDoc[], cur) => {
    const exclusives: CastedDoc[] = ret.filter((item) => item.id !== cur.doc.id);
    if (['added', 'modified'].includes(cur.type)) {
      return [...exclusives, castDoc(cur.doc) as CastedDoc];
    }
    if (cur.type === 'removed') {
      return exclusives;
    }
    return ret;
  },
  old,
);

export const setDocProperties = async (
  context: Context,
  collectionName: string,
  id: string,
  props: Object,
) => {
  const { db } = context;
  await updateDoc(doc(db, collectionName, id), {
    ...props,
    updatedAt: new Date(),
  });
};

export type HandleListenError = (context: Context) => Promise<void>;
