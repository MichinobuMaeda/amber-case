import {
  accountNotExist,
  invalidSnapshot,
  deletedSnapshot,
  user01Snapshot,
  adminSnapshot,
  mockGet,
  mockFirebase,
} from './setupTests';
import {
  validUser,
  adminUser,
} from './guard';

describe('validUser()', () => {
  it('rejects undefined uid.', async () => {
    await expect(validUser(mockFirebase(), ''))
      .rejects.toThrow('Param uid is missing.');

    expect(mockGet.mock.calls.length).toEqual(0);
  });

  it('rejects uid without doc.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(accountNotExist); }),
    );

    await expect(validUser(mockFirebase(), 'dummy'))
      .rejects.toThrow('User: dummy is not exists.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'dummy',
    }]);
  });

  it('rejects invalidUser account.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(invalidSnapshot); }),
    );

    await expect(validUser(mockFirebase(), 'invalid'))
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

    await expect(validUser(mockFirebase(), 'deleted'))
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

    const ret = await validUser(mockFirebase(), 'user01');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'user01',
    }]);
    expect(ret).toEqual(user01Snapshot);
  });
});

describe('adminUser()', () => {
  it('rejects undefined uid.', async () => {
    await expect(adminUser(mockFirebase(), ''))
      .rejects.toThrow('Param uid is missing.');

    expect(mockGet.mock.calls.length).toEqual(0);
  });

  it('rejects uid without doc.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(accountNotExist); }),
    );

    await expect(adminUser(mockFirebase(), 'dummy'))
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

    await expect(adminUser(mockFirebase(), 'invalid'))
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

    await expect(adminUser(mockFirebase(), 'deleted'))
      .rejects.toThrow('User: deleted has deleted.');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'deleted',
    }]);
  });

  it('rejects valid account without adminUser priv.', async () => {
    mockGet.mockImplementationOnce(
      () => new Promise((resolve) => { resolve(user01Snapshot); }),
    );

    await expect(adminUser(mockFirebase(), 'user01'))
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

    const ret = await adminUser(mockFirebase(), 'admin');

    expect(mockGet.mock.calls[0]).toEqual([{
      collection: 'accounts',
      id: 'admin',
    }]);
    expect(ret).toEqual(adminSnapshot);
  });
});
