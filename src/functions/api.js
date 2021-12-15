const {
  getConf,
  updateVersion,
  updateData,
  install,
} = require('./setup');

const setup = (firebase, axios, config) => async (req, res) => {
  const conf = await getConf(firebase);
  if (conf) {
    const verUp = await updateVersion(firebase, conf, axios);
    if (verUp) {
      await updateData(firebase, conf);
    }
  } else {
    const confNew = await install(
      firebase,
      config.initial.email,
      config.initial.password,
      config.initial.url,
    );
    await updateData(firebase, confNew);
  }
  return res.send('OK');
};

module.exports = {
  setup,
};
