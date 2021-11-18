const {
  mockFirebase,
} = require('./testConfig');
const {
  valid,
  admin,
} = require('./guard');

afterEach(async () => {
  jest.clearAllMocks();
});

describe('valid()', () => {
  it('rejects undefined uid.', async () => {
    await expect(valid(mockFirebase))
      .rejects.toThrow('Param uid is missing.');
  });

  it('rejects uid without doc.', async () => {
    await expect(valid(mockFirebase, 'dummy'))
      .rejects.toThrow('User: dummy is not exists.');
  });

  it('rejects invalid account.', async () => {
    await expect(valid(mockFirebase, 'invalid'))
      .rejects.toThrow('User: invalid is not valid.');
  });

  it('rejects deleted account.', async () => {
    await expect(valid(mockFirebase, 'deleted'))
      .rejects.toThrow('User: deleted has deleted.');
  });

  it('returns valid account.', async () => {
    const ret = await valid(mockFirebase, 'account01');
    expect(ret.id).toEqual('account01');
  });

  it('returns valid admin account.', async () => {
    const ret = await valid(mockFirebase, 'admin');
    expect(ret.id).toEqual('admin');
  });
});

describe('admin()', () => {
  it('rejects undefined uid.', async () => {
    await expect(admin(mockFirebase))
      .rejects.toThrow('Param uid is missing.');
  });

  it('rejects uid without doc.', async () => {
    await expect(admin(mockFirebase, 'dummy'))
      .rejects.toThrow('User: dummy is not exists.');
  });

  it('rejects invalid account.', async () => {
    await expect(admin(mockFirebase, 'invalid'))
      .rejects.toThrow('User: invalid is not valid.');
  });

  it('rejects deleted account.', async () => {
    await expect(admin(mockFirebase, 'deleted'))
      .rejects.toThrow('User: deleted has deleted.');
  });

  it('rejects account without admin priv.', async () => {
    await expect(admin(mockFirebase, 'account01'))
      .rejects.toThrow('User: account01 is not admin.');
  });

  it('returns valid account with admin priv.', async () => {
    const ret = await admin(mockFirebase, 'admin');
    expect(ret.id).toEqual('admin');
  });
});
