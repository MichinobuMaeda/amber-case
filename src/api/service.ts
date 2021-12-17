import { onSnapshot, doc, getDoc } from 'firebase/firestore';

import { Conf } from './models';
import { Context } from './AppContext';
import { castDoc, setDocProperties, HandleListenError } from './firebase';

export const listenConf = async (
  context: Context,
  handleListenError: HandleListenError,
) => {
  const { db, setConf } = context;
  if (!context.unsubConf) {
    try {
      const confRef = doc(db, 'service', 'conf');
      const conf = await getDoc(confRef);
      setConf(conf.exists() ? castDoc(conf) : { error: true } as Conf);
      // eslint-disable-next-line no-param-reassign
      context.unsubConf = onSnapshot(
        confRef,
        (snapshot) => {
          setConf(snapshot.exists() ? castDoc(snapshot) : { error: true } as Conf);
        },
      );
    } catch (e) {
      await handleListenError(context);
      setConf({ error: true } as Conf);
    }
  }
};

export const setConfProperties = async (
  context: Context,
  props: any,
) => setDocProperties(context, 'service', 'conf', props);
