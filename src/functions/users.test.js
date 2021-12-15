// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('firebase-functions-test')();
const {
  confData,
  confSnapshot,
  accountNotExist,
  user01Data,
  user01Snapshot,
  testInvitation,
  mockFirebase,
  mockGet,
  mockAdd,
  mockSet,
  mockUpdate,
  createUser,
  updateUser,
  deleteUser,
} = require('./setupTests');
const {
  createAuthUser,
  setUserName,
  setUserEmail,
  setUserPassword,
  invite,
  getToken,
  onCreateAuthUser,
  onAccountUpdate,
} = require('./users');

describe('createAuthUser()', () => {
  const name = 'User 01';
  const group = 'group01';
  const email = 'account01@example.com';
  const password = "account01's password";

  it('rejects name with length 0.', async () => {
    await expect(createAuthUser(
      {},
      { name: '', admin: false, tester: false },
    )).rejects.toThrow('Param name is missing.');
  });

  it('rejects email with length 0.', async () => {
    await expect(createAuthUser(
      {},
      {
        name: 'name', admin: false, tester: false, group: 'group', email: '',
      },
    )).rejects.toThrow('Param email is empty.');
  });

  it('rejects password with length 0.', async () => {
    await expect(createAuthUser(
      {},
      {
        name: 'name', admin: false, tester: false, group: 'group', email: 'email', password: '',
      },
    )).rejects.toThrow('Param password is empty.');
  });

  it('creates account with given properties'
  + ' and returns uid.', async () => {
    const ret = await createAuthUser(
      mockFirebase(),
      { name, admin: false, tester: false },
    );

    expect(ret).toEqual('created');
    expect(mockAdd.mock.calls).toEqual([[{
      collection: 'accounts',
      data: {
        name,
        valid: true,
        admin: false,
        tester: false,
        group: null,
        themeMode: null,
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(mockSet.mock.calls).toEqual([[{
      collection: 'people',
      id: 'created',
      data: {
        groups: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(createUser.mock.calls).toEqual([[{
      uid: 'created',
      displayName: name,
    }]]);
  });

  it('creates account with given properties inclueds group,'
  + ' and returns uid.', async () => {
    const ret = await createAuthUser(
      mockFirebase(),
      {
        name, admin: false, tester: false, group,
      },
    );

    expect(ret).toEqual('created');
    expect(mockAdd.mock.calls).toEqual([[{
      collection: 'accounts',
      data: {
        name,
        valid: true,
        admin: false,
        tester: false,
        group,
        themeMode: null,
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(mockSet.mock.calls).toEqual([[{
      collection: 'people',
      id: 'created',
      data: {
        groups: [group],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(createUser.mock.calls).toEqual([[{
      uid: 'created',
      displayName: name,
    }]]);
  });

  it('creates account with given properties inclueds email,'
  + ' and returns uid.', async () => {
    const ret = await createAuthUser(
      mockFirebase(),
      {
        name, admin: false, tester: false, group, email,
      },
    );

    expect(ret).toEqual('created');
    expect(mockAdd.mock.calls).toEqual([[{
      collection: 'accounts',
      data: {
        name,
        valid: true,
        admin: false,
        tester: false,
        group,
        themeMode: null,
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(mockSet.mock.calls).toEqual([[{
      collection: 'people',
      id: 'created',
      data: {
        groups: [group],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(createUser.mock.calls).toEqual([[{
      uid: 'created',
      displayName: name,
      email,
    }]]);
  });

  it('creates account with given properties inclueds password,'
  + ' and returns uid.', async () => {
    const ret = await createAuthUser(
      mockFirebase(),
      {
        name, admin: false, tester: false, group, email, password,
      },
    );

    expect(ret).toEqual('created');
    expect(mockAdd.mock.calls).toEqual([[{
      collection: 'accounts',
      data: {
        name,
        valid: true,
        admin: false,
        tester: false,
        group,
        themeMode: null,
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(mockSet.mock.calls).toEqual([[{
      collection: 'people',
      id: 'created',
      data: {
        groups: [group],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      },
    }]]);
    expect(createUser.mock.calls).toEqual([[{
      uid: 'created',
      displayName: name,
      email,
      password,
    }]]);
  });
});

describe('setUserName()', () => {
  const uid = 'id01';
  const name = 'User 01';

  it('rejects name with length 0.', async () => {
    await expect(setUserName({}, uid, ''))
      .rejects.toThrow('Param name is missing.');
  });

  it('updates name of doc and auth entry.', async () => {
    await setUserName(mockFirebase(), uid, name);

    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'accounts',
      id: 'id01',
      data: {
        name,
        updatedAt: expect.any(Date),
      },
    }]]);
    expect(updateUser.mock.calls).toEqual([[uid, { displayName: name }]]);
  });
});

describe('setUserEmail()', () => {
  const uid = 'id01';
  const email = 'account01@example.com';

  it('rejects email with length 0.', async () => {
    await expect(setUserEmail({}, uid, ''))
      .rejects.toThrow('Param email is empty.');
  });

  it('updates email of auth entry.', async () => {
    await setUserEmail(mockFirebase(), uid, email);

    expect(updateUser.mock.calls).toEqual([[uid, { email }]]);
  });
});

describe('setUserPassword()', () => {
  const uid = 'id01';
  const password = 'account01@example.com';

  it('rejects password with length 0.', async () => {
    await expect(setUserPassword({}, uid, ''))
      .rejects.toThrow('Param password is empty.');
  });

  it('updates password of auth entry.', async () => {
    await setUserPassword(mockFirebase(), uid, password);

    expect(updateUser.mock.calls).toEqual([[uid, { password }]]);
  });
});

describe('invite()', () => {
  const caller = { id: 'admin' };

  it('creates invitation code and'
  + ' save hashed code, host account id and timestamp,'
  + ' and return invitation code.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));

    const code = await invite(mockFirebase(), caller, 'id01');

    expect(code.length).toBeGreaterThan(0);
    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'accounts',
      id: 'id01',
      data: {
        invitation: testInvitation(code, 'test seed'),
        invitedBy: caller.id,
        invitedAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    }]]);
  });
});

describe('getToken()', () => {
  it('rejects invitation without record.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolve({ docs: [] }); }));

    await expect(getToken(mockFirebase(), 'dummy code'))
      .rejects.toThrow('No record');

    expect(mockGet.mock.calls).toEqual([
      [{
        collection: 'service',
        id: 'conf',
      }],
      [{
        collection: 'accounts',
        op1: 'invitation',
        op2: '==',
        op3: testInvitation('dummy code', confData.seed),
      }],
    ]);
    expect(mockUpdate.mock.calls).toEqual([]);
  });

  it('rejects invitation without invitedBy.', async () => {
    const invitation = testInvitation('test code', 'test seed');
    const invited = test.firestore.makeDocumentSnapshot(
      { ...user01Data, invitation, invitedAt: new Date() },
      'document/accounts/user01',
    );
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolve({ docs: [invited] }); }));

    await expect(getToken(mockFirebase(), 'test code'))
      .rejects.toThrow('Invitation for account: user01 has invalid status.');

    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'accounts',
      id: 'user01',
      data: {
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        updatedAt: expect.any(Date),
      },
    }]]);
  });

  it('rejects invitation without invitedAt.', async () => {
    const invitation = testInvitation('test code', 'test seed');
    const invited = test.firestore.makeDocumentSnapshot(
      { ...user01Data, invitation, invitedBy: 'admin' },
      'document/accounts/user01',
    );
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolve({ docs: [invited] }); }));

    await expect(getToken(mockFirebase(), 'test code'))
      .rejects.toThrow('Invitation for account: user01 has invalid status.');

    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'accounts',
      id: 'user01',
      data: {
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        updatedAt: expect.any(Date),
      },
    }]]);
  });

  it('rejects invitation with expired timestamp.', async () => {
    const invitation = testInvitation('test code', 'test seed');
    const invited = test.firestore.makeDocumentSnapshot(
      {
        ...user01Data,
        invitation,
        invitedBy: 'admin',
        invitedAt: new Date(new Date().getTime() - confData.invitationExpirationTime - 1),
      },
      'document/accounts/user01',
    );
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolve({ docs: [invited] }); }));

    await expect(getToken(mockFirebase(), 'test code'))
      .rejects.toThrow('Invitation for account: user01 is expired.');

    expect(mockUpdate.mock.calls).toEqual([[{
      collection: 'accounts',
      id: 'user01',
      data: {
        invitation: null,
        invitedBy: null,
        invitedAt: null,
        updatedAt: expect.any(Date),
      },
    }]]);
  });

  it('returns token.', async () => {
    const invitation = testInvitation('test code', 'test seed');
    const invited = test.firestore.makeDocumentSnapshot(
      {
        ...user01Data,
        invitation,
        invitedBy: 'admin',
        invitedAt: new Date(new Date().getTime() - confData.invitationExpirationTime + 10000),
      },
      'document/accounts/user01',
    );
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolve({ docs: [invited] }); }));

    const token = await getToken(mockFirebase(), 'test code');

    expect(token).toEqual('test token');
  });
});

describe('onCreateAuthUser()', () => {
  it('delete user without its account doc.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(accountNotExist); }));

    await onCreateAuthUser(mockFirebase(), { uid: accountNotExist.id });

    expect(deleteUser.mock.calls).toEqual([[accountNotExist.id]]);
  });

  it('do nothing in all other cases.', async () => {
    mockGet
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(user01Snapshot); }));

    await onCreateAuthUser(mockFirebase(), { uid: 'user01' });

    expect(deleteUser.mock.calls).toEqual([]);
  });
});

describe('onAccountUpdate()', () => {
  it('update displayName of its auth user '
  + 'on change the name of the account', async () => {
    await onAccountUpdate(
      mockFirebase(),
      {
        before: test.firestore.makeDocumentSnapshot(
          { name: 'Name before' },
          'document/accounts/user01',
        ),
        after: test.firestore.makeDocumentSnapshot(
          { name: 'Name after' },
          'document/accounts/user01',
        ),
      },
    );

    expect(updateUser.mock.calls).toEqual([[
      'user01',
      { displayName: 'Name after' },
    ]]);
  });

  it('do nothing in all other cases.', async () => {
    await onAccountUpdate(
      mockFirebase(),
      {
        before: test.firestore.makeDocumentSnapshot(
          { group: 'Group before' },
          'document/accounts/user01',
        ),
        after: test.firestore.makeDocumentSnapshot(
          { group: 'Group after' },
          'document/accounts/user01',
        ),
      },
    );

    expect(updateUser.mock.calls).toEqual([]);
  });
});
