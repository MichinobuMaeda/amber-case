const {
  accountNotExist,
  invalidSnapshot,
  deletedSnapshot,
  user01Snapshot,
  adminSnapshot,
  mockGet,
  mockFirebase,
} = require('./setupTests');
const {
  valid,
  admin,
} = require('./guard');

describe('valid()', () => {
  it('rejects undefined uid.', async () => {
    await expect(valid(mockFirebase()))
      .rejects.toThrow('Param uid is missing.');

    expect(mockGet.mock.calls.length).toEqual(0);
  });

  it('rejects uid without doc.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(accountNotExist); }),
    );

    await expect(valid(mockFirebase(), 'dummy'))
      .rejects.toThrow('User: dummy is not exists.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'dummy',
    }]);
  });

  it('rejects invalid account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(invalidSnapshot); }),
    );

    await expect(valid(mockFirebase(), 'invalid'))
      .rejects.toThrow('User: invalid is not valid.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'invalid',
    }]);
  });

  it('rejects deleted account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(deletedSnapshot); }),
    );

    await expect(valid(mockFirebase(), 'deleted'))
      .rejects.toThrow('User: deleted has deleted.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'deleted',
    }]);
  });

  it('returns valid account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(user01Snapshot); }),
    );

    const ret = await valid(mockFirebase(), 'user01');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'user01',
    }]);
    expect(ret).toEqual(user01Snapshot);
  });
});

describe('admin()', () => {
  it('rejects undefined uid.', async () => {
    await expect(admin(mockFirebase()))
      .rejects.toThrow('Param uid is missing.');

    expect(mockGet.mock.calls.length).toEqual(0);
  });

  it('rejects uid without doc.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(accountNotExist); }),
    );

    await expect(admin(mockFirebase(), 'dummy'))
      .rejects.toThrow('User: dummy is not exists.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'dummy',
    }]);
  });

  it('rejects invalid account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(invalidSnapshot); }),
    );

    await expect(admin(mockFirebase(), 'invalid'))
      .rejects.toThrow('User: invalid is not valid.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'invalid',
    }]);
  });

  it('rejects deleted account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(deletedSnapshot); }),
    );

    await expect(admin(mockFirebase(), 'deleted'))
      .rejects.toThrow('User: deleted has deleted.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'deleted',
    }]);
  });

  it('rejects valid account without admin priv.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(user01Snapshot); }),
    );

    await expect(admin(mockFirebase(), 'user01'))
      .rejects.toThrow('User: user01 is not admin.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'user01',
    }]);
  });

  it('returns valid account with admin priv.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(adminSnapshot); }),
    );

    const ret = await admin(mockFirebase(), 'admin');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'admin',
    }]);
    expect(ret).toEqual(adminSnapshot);
  });
});
