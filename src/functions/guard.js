const valid = async (firebase, uid) => {
  if (!uid) {
    throw new Error('Param uid is missing.');
  }
  const db = firebase.firestore();
  const account = await db.collection('accounts').doc(uid).get();
  if (!account.exists) {
    throw new Error(`User: ${uid} is not exists.`);
  }
  if (!account.get('valid')) {
    throw new Error(`User: ${uid} is not valid.`);
  }
  if (account.get('deletedAt')) {
    throw new Error(`User: ${uid} has deleted.`);
  }
  return account;
};

const admin = async (firebase, uid) => {
  const account = await valid(firebase, uid);
  if (!account.get('admin')) {
    throw new Error(`User: ${uid} is not admin.`);
  }
  return account;
};

module.exports = {
  valid,
  admin,
};
