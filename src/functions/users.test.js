const {
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  testInvitation,
  mockFirebase,
  mockInvitationCode,
  mockInvitationCodeNoHost,
  mockInvitationCodeNoTime,
  mockInvitationCodeExpired,
  mockDocAdd,
  mockDocSet,
  mockDocUpdate,
  mockConfData,
} = require('./testConfig');
const {
  createUser,
  setUserName,
  setUserEmail,
  setUserPassword,
  invite,
  getToken,
  onCreateAuthUser,
  onAccountUpdate,
} = require('./users');

afterEach(async () => {
  jest.clearAllMocks();
});

describe('createUser()', () => {
  const uid = 'id01';
  const name = 'User 01';
  const group = 'group01';
  const email = 'account01@example.com';
  const password = "account01's password";

  it('rejects name with length 0.', async () => {
    await expect(createUser(mockFirebase, '', false, false))
      .rejects.toThrow('Param name is missing.');
  });

  it('rejects email with length 0.', async () => {
    await expect(createUser(
      mockFirebase, 'name', false, false, 'group', '',
    )).rejects.toThrow('Param email is empty.');
  });

  it('rejects password with length 0.', async () => {
    await expect(createUser(
      mockFirebase, 'name', false, false, 'group', 'email', '',
    )).rejects.toThrow('Param password is empty.');
  });

  it('creates account with given properties,'
  + ' and returns uid.', async () => {
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));

    const ret = await createUser(
      mockFirebase, name, false, false,
    );

    expect(ret).toEqual(uid);
    expect(mockDocAdd.mock.calls.length).toEqual(1);
    expect(mockDocAdd.mock.calls[0][0]).toEqual('accounts');
    const addData = mockDocAdd.mock.calls[0][1];
    expect(addData.name).toEqual(name);
    expect(addData.admin).toBeFalsy();
    expect(addData.tester).toBeFalsy();
    expect(addData.valid).toBeTruthy();
    expect(addData.themeMode).toBeNull();
    expect(addData.invitation).toBeNull();
    expect(addData.invitedBy).toBeNull();
    expect(addData.invitedAt).toBeNull();
    expect(addData.createdAt).toBeDefined();
    expect(addData.updatedAt).toBeDefined();
    expect(addData.deletedAt).toBeDefined();

    expect(mockDocSet.mock.calls.length).toEqual(1);
    expect(mockDocSet.mock.calls[0][0]).toEqual('people');
    expect(mockDocSet.mock.calls[0][1]).toEqual(uid);
    const setData = mockDocSet.mock.calls[0][2];
    expect(setData.groups).toEqual([]);
    expect(setData.createdAt).toBeDefined();
    expect(setData.updatedAt).toBeDefined();
    expect(setData.deletedAt).toBeFalsy();

    expect(mockCreateUser.mock.calls.length).toEqual(1);
    expect(mockCreateUser.mock.calls[0][0]).toEqual({
      uid,
      displayName: name,
    });
  });

  it('creates account with given properties inclueds group,'
  + ' and returns uid.', async () => {
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));

    await createUser(
      mockFirebase, name, false, false, group,
    );

    expect(mockDocAdd.mock.calls.length).toEqual(1);

    expect(mockDocSet.mock.calls.length).toEqual(1);
    const setData = mockDocSet.mock.calls[0][2];
    expect(setData.groups).toEqual([group]);
    expect(setData.createdAt).toBeDefined();
    expect(setData.updatedAt).toBeDefined();
    expect(setData.deletedAt).toBeFalsy();

    expect(mockCreateUser.mock.calls.length).toEqual(1);
    expect(mockCreateUser.mock.calls[0][0]).toEqual({
      uid,
      displayName: name,
    });
  });

  it('creates account with given properties inclueds email,'
  + ' and returns uid.', async () => {
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));

    await createUser(
      mockFirebase, name, false, false, group, email,
    );

    expect(mockDocAdd.mock.calls.length).toEqual(1);
    expect(mockDocSet.mock.calls.length).toEqual(1);

    expect(mockCreateUser.mock.calls.length).toEqual(1);
    expect(mockCreateUser.mock.calls[0][0]).toEqual({
      uid,
      displayName: name,
      email,
    });
  });

  it('creates account with given properties inclueds password,'
  + ' and returns uid.', async () => {
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));

    await createUser(
      mockFirebase, name, false, false, group, email, password,
    );

    expect(mockDocAdd.mock.calls.length).toEqual(1);
    expect(mockDocSet.mock.calls.length).toEqual(1);

    expect(mockCreateUser.mock.calls.length).toEqual(1);
    expect(mockCreateUser.mock.calls[0][0]).toEqual({
      uid,
      displayName: name,
      email,
      password,
    });
  });
});

describe('setUserName()', () => {
  const uid = 'id01';
  const name = 'User 01';

  it('rejects name with length 0.', async () => {
    await expect(setUserName(mockFirebase, uid, ''))
      .rejects.toThrow('Param name is missing.');
  });

  it('updates name of doc and auth entry.', async () => {
    await setUserName(mockFirebase, uid, name);

    expect(mockUpdateUser.mock.calls.length).toEqual(1);
    expect(mockUpdateUser.mock.calls[0][0]).toEqual(uid);
    expect(mockUpdateUser.mock.calls[0][1]).toEqual({ displayName: name });

    expect(mockDocUpdate.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual(uid);
    const updateData = mockDocUpdate.mock.calls[0][2];
    expect(updateData.name).toEqual(name);
    expect(updateData.updatedAt).toBeDefined();
  });
});

describe('setUserEmail()', () => {
  const uid = 'id01';
  const email = 'account01@example.com';

  it('rejects email with length 0.', async () => {
    await expect(setUserEmail(mockFirebase, uid, ''))
      .rejects.toThrow('Param email is empty.');
  });

  it('updates email of auth entry.', async () => {
    await setUserEmail(mockFirebase, uid, email);

    expect(mockUpdateUser.mock.calls.length).toEqual(1);
    expect(mockUpdateUser.mock.calls[0][0]).toEqual(uid);
    expect(mockUpdateUser.mock.calls[0][1]).toEqual({ email });
  });
});

describe('setUserPassword()', () => {
  const uid = 'id01';
  const password = 'account01@example.com';

  it('rejects password with length 0.', async () => {
    await expect(setUserPassword(mockFirebase, uid, ''))
      .rejects.toThrow('Param password is empty.');
  });

  it('updates password of auth entry.', async () => {
    await setUserPassword(mockFirebase, uid, password);

    expect(mockUpdateUser.mock.calls.length).toEqual(1);
    expect(mockUpdateUser.mock.calls[0][0]).toEqual(uid);
    expect(mockUpdateUser.mock.calls[0][1]).toEqual({ password });
  });
});

describe('invite()', () => {
  const caller = { id: 'admin' };
  const uid = 'id01';

  it('creates invitation code and'
  + ' save hashed code, host account id and timestamp,'
  + ' and return invitation code.', async () => {
    const code = await invite(mockFirebase, caller, uid);

    const invitation = testInvitation(code, mockConfData().seed);
    expect(mockDocUpdate.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual(uid);
    const updateData = mockDocUpdate.mock.calls[0][2];
    expect(updateData.invitation).toEqual(invitation);
    expect(updateData.invitedBy).toEqual(caller.id);
    expect(updateData.invitedAt).toBeDefined();
    expect(updateData.updatedAt).toBeDefined();
  });
});

describe('getToken()', () => {
  it('rejects invitation without record.', async () => {
    await expect(getToken(mockFirebase, 'dummy code'))
      .rejects.toThrow('No record');
  });

  it('rejects invitation without host account id.', async () => {
    await expect(getToken(mockFirebase, mockInvitationCodeNoHost))
      .rejects.toThrow('Invitation for account: invitationNoHost has invalid status.');

    expect(mockDocUpdate.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual('invitationNoHost');
    expect(mockDocUpdate.mock.calls[0][2]).toEqual({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
    });
  });

  it('rejects invitation without timestamp.', async () => {
    await expect(getToken(mockFirebase, mockInvitationCodeNoTime))
      .rejects.toThrow('Invitation for account: invitationNoTime has invalid status.');
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual('invitationNoTime');
    expect(mockDocUpdate.mock.calls[0][2]).toEqual({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
    });
  });

  it('rejects invitation with expired timestamp.', async () => {
    await expect(getToken(mockFirebase, mockInvitationCodeExpired))
      .rejects.toThrow('Invitation for account: invitationExpired is expired.');
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('accounts');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual('invitationExpired');
    expect(mockDocUpdate.mock.calls[0][2]).toEqual({
      invitation: null,
      invitedBy: null,
      invitedAt: null,
    });
  });

  it('returns token.', async () => {
    const token = await expect(getToken(mockFirebase, mockInvitationCode));
    expect(token).toBeDefined();
  });
});

describe('onCreateAuthUser()', () => {
  it('delete user without its account doc.', async () => {
    await onCreateAuthUser(mockFirebase, { uid: 'dummy' });
    expect(mockDeleteUser.mock.calls.length).toEqual(1);
    expect(mockDeleteUser.mock.calls[0][0]).toEqual('dummy');
  });

  it('do nothing in all other cases.', async () => {
    await onCreateAuthUser(mockFirebase, { uid: 'account01' });
    expect(mockDeleteUser.mock.calls.length).toEqual(0);
  });
});

describe('onAccountUpdate()', () => {
  it('update displayName of its auth user '
  + 'on change the name of the account', async () => {
    const id = 'id01';
    const change = {
      before: {
        id,
        data: () => ({ name: 'Name before' }),
      },
      after: {
        id,
        data: () => ({ name: 'Name after' }),
      },
    };
    await onAccountUpdate(mockFirebase, change);
    expect(mockUpdateUser.mock.calls.length).toEqual(1);
    expect(mockUpdateUser.mock.calls[0][0]).toEqual(id);
    expect(mockUpdateUser.mock.calls[0][1]).toEqual({ displayName: 'Name after' });
  });

  it('do nothing in all other cases.', async () => {
    const id = 'id01';
    const change = {
      before: {
        id,
        data: () => ({ name: 'Name before' }),
      },
      after: {
        id,
        data: () => ({ name: 'Name before' }),
      },
    };
    await onAccountUpdate(mockFirebase, change);
    expect(mockUpdateUser.mock.calls.length).toEqual(0);
  });
});
