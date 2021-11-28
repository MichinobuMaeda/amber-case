import {
  resetMockService, mockContext,
} from '../testConfig';
import {
  currentPriv,
  isAllowed,
} from './authorization';

beforeEach(() => {
  resetMockService();
});

describe('currentPriv(context)', () => {
  it('return "loading" before received conf and auth user.', async () => {
    mockContext.conf = { uninitialized: true };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = {};

    expect(currentPriv(mockContext)).toEqual('loading');

    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uninitialized: true };
    mockContext.me = {};

    expect(currentPriv(mockContext)).toEqual('loading');

    mockContext.conf = { id: 'conf' };
    mockContext.authUser = {};
    mockContext.me = {};

    expect(currentPriv(mockContext)).not.toEqual('loading');
  });

  it('return "guest" after loading before sign-in as valid user.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = {};

    expect(currentPriv(mockContext)).toEqual('guest');
  });

  it('return "pending" after sign-in before email validation.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi' };
    mockContext.me = { id: 'id01', valid: true };

    expect(currentPriv(mockContext)).toEqual('pending');
  });

  it('return "user" after sing in as user without admin priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi', emailVerified: true };
    mockContext.me = { id: 'id01', valid: true };

    expect(currentPriv(mockContext)).toEqual('user');

    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true };

    expect(currentPriv(mockContext)).toEqual('user');
  });

  it('return "admin" after sing in as user with admin priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi', emailVerified: true };
    mockContext.me = { id: 'id01', valid: true, admin: true };

    expect(currentPriv(mockContext)).toEqual('admin');

    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true, admin: true };

    expect(currentPriv(mockContext)).toEqual('admin');
  });
});

describe('isAllowed(context, require)', () => {
  it('authorized pages require "any", "loading" '
  + 'for "loading" priv.', async () => {
    mockContext.conf = { uninitialized: true };
    mockContext.authUser = { uid: 'id01' };
    expect(currentPriv(mockContext)).toEqual('loading');

    expect(isAllowed(mockContext, 'any')).toBeTruthy();
    expect(isAllowed(mockContext, 'loading')).toBeTruthy();

    expect(isAllowed(mockContext, 'loaded')).toBeFalsy();
    expect(isAllowed(mockContext, 'guest')).toBeFalsy();
    expect(isAllowed(mockContext, 'pending')).toBeFalsy();
    expect(isAllowed(mockContext, 'user')).toBeFalsy();
    expect(isAllowed(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "guest" '
  + 'for "guest" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = {};
    expect(currentPriv(mockContext)).toEqual('guest');

    expect(isAllowed(mockContext, 'any')).toBeTruthy();
    expect(isAllowed(mockContext, 'loaded')).toBeTruthy();
    expect(isAllowed(mockContext, 'guest')).toBeTruthy();

    expect(isAllowed(mockContext, 'loading')).toBeFalsy();
    expect(isAllowed(mockContext, 'pending')).toBeFalsy();
    expect(isAllowed(mockContext, 'user')).toBeFalsy();
    expect(isAllowed(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "pending" '
  + 'for "pending" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi' };
    mockContext.me = { id: 'id01', valid: true };
    expect(currentPriv(mockContext)).toEqual('pending');

    expect(isAllowed(mockContext, 'any')).toBeTruthy();
    expect(isAllowed(mockContext, 'loaded')).toBeTruthy();
    expect(isAllowed(mockContext, 'pending')).toBeTruthy();

    expect(isAllowed(mockContext, 'loading')).toBeFalsy();
    expect(isAllowed(mockContext, 'guest')).toBeFalsy();
    expect(isAllowed(mockContext, 'user')).toBeFalsy();
    expect(isAllowed(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "user" '
  + 'for "user" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true };
    expect(currentPriv(mockContext)).toEqual('user');

    expect(isAllowed(mockContext, 'any')).toBeTruthy();
    expect(isAllowed(mockContext, 'loaded')).toBeTruthy();
    expect(isAllowed(mockContext, 'user')).toBeTruthy();

    expect(isAllowed(mockContext, 'loading')).toBeFalsy();
    expect(isAllowed(mockContext, 'guest')).toBeFalsy();
    expect(isAllowed(mockContext, 'pending')).toBeFalsy();
    expect(isAllowed(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "user", "admin" '
  + 'for "admin" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true, admin: true };
    expect(currentPriv(mockContext)).toEqual('admin');

    expect(isAllowed(mockContext, 'any')).toBeTruthy();
    expect(isAllowed(mockContext, 'loaded')).toBeTruthy();
    expect(isAllowed(mockContext, 'user')).toBeTruthy();
    expect(isAllowed(mockContext, 'admin')).toBeTruthy();

    expect(isAllowed(mockContext, 'loading')).toBeFalsy();
    expect(isAllowed(mockContext, 'guest')).toBeFalsy();
    expect(isAllowed(mockContext, 'pending')).toBeFalsy();
  });
});
