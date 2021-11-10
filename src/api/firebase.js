export const localKeyEmail = 'AmberBowlEmail';
export const localKeyError = 'AmberBowlError';

export const unsubUserData = ({ db, unsub }) => {
  const refConf = db.collection('service').doc('conf');
  Object.keys(unsub).forEach((key) => {
    if (key !== refConf.path) {
      if (unsub[key]) {
        unsub[key]();
      }
      // eslint-disable-next-line no-param-reassign
      unsub[key] = null;
    }
  });
};

export const castDoc = (doc) => {
  if (doc && doc.exists) {
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
    return castData({ id: doc.id, ...doc.data() });
  }
  return {};
};
