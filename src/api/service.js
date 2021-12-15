import { onSnapshot, doc, getDoc } from 'firebase/firestore';

import { castDoc, setDocProperties } from './firebase';

export const listenConf = async (context, handleListenError) => {
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
      await handleListenError(context);
      setConf({ error: true });
    }
  }
};

export const setConfProperties = async (context, props) => setDocProperties(context, 'service', 'conf', props);
