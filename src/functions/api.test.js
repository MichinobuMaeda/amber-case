const axios = require('axios');
const {
  confSnapshot,
  mockFirebase,
} = require('./setupTests');
const {
  getConf,
  updateVersion,
  updateData,
  install,
} = require('./setup');
const {
  setup,
} = require('./api');

jest.mock('axios');

jest.mock('./setup', () => ({
  getConf: jest.fn(),
  updateVersion: jest.fn(),
  updateData: jest.fn(),
  install: jest.fn(),
}));

describe('setup()', () => {
  const config = {
    initial: {
      email: 'info@example.com',
      password: 'testpass',
      url: 'https://example.com',
    },
  };
  const req = {};
  const res = {
    send: jest.fn(),
  };

  it('calls only updateVersion() '
  + 'if conf.version is latest value.', async () => {
    getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    updateVersion
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(false); }));
    const sendOk = { body: 'OK' };
    res.send
      .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    const ret = await setup(firebase, axios, config)(req, res);

    expect(getConf.mock.calls).toEqual([[firebase]]);
    expect(updateVersion.mock.calls).toEqual([[firebase, confSnapshot, axios]]);
    expect(updateData.mock.calls).toEqual([]);
    expect(install.mock.calls).toEqual([]);
    expect(res.send.mock.calls).toEqual([['OK']]);
    expect(ret).toEqual(sendOk);
  });

  it('calls updateVersion() and updateData() '
  + 'if conf.version is not value.', async () => {
    getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    updateVersion
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(true); }));
    const sendOk = { body: 'OK' };
    res.send
      .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    const ret = await setup(firebase, axios, config)(req, res);

    expect(getConf.mock.calls).toEqual([[firebase]]);
    expect(updateVersion.mock.calls).toEqual([[firebase, confSnapshot, axios]]);
    expect(updateData.mock.calls).toEqual([[firebase, confSnapshot]]);
    expect(install.mock.calls).toEqual([]);
    expect(res.send.mock.calls).toEqual([['OK']]);
    expect(ret).toEqual(sendOk);
  });

  it('calls install() and updateData() '
  + 'if conf is not exists.', async () => {
    getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(null); }));
    install
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    const sendOk = { body: 'OK' };
    res.send
      .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    const ret = await setup(firebase, axios, config)(req, res);

    expect(getConf.mock.calls).toEqual([[firebase]]);
    expect(updateVersion.mock.calls).toEqual([]);
    expect(updateData.mock.calls).toEqual([[firebase, confSnapshot]]);
    expect(install.mock.calls).toEqual([[
      firebase,
      config.initial.email,
      config.initial.password,
      config.initial.url,
    ]]);
    expect(res.send.mock.calls).toEqual([['OK']]);
    expect(ret).toEqual(sendOk);
  });
});
