import { User } from 'firebase/auth';

import { Conf, Account } from './models';
import {
  initializeMock, mockContext,
} from '../setupTests';
import {
  Priv,
  MenuItem,
  currentPriv,
  hasPriv,
  currentPage,
} from './authorization';

beforeEach(() => {
  initializeMock();
});

describe('currentPriv(context)', () => {
  it('return "loading" before received conf and auth user.', async () => {
    mockContext.conf = null;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = {} as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.LOADING);

    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = null;
    mockContext.me = {} as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.LOADING);

    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = {} as User;
    mockContext.me = {} as Account;

    expect(currentPriv(mockContext)).not.toEqual(Priv.LOADING);
  });

  it('return "guest" after loading before sign-in as valid user.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = {} as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.GUEST);
  });

  it('return "pending" after sign-in before email validation.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.PENDING);
  });

  it('return "user" after sing in as user without admin priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi', emailVerified: true } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.USER);

    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.USER);
  });

  it('return "admin" after sing in as user with admin priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi', emailVerified: true } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.ADMIN);

    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;

    expect(currentPriv(mockContext)).toEqual(Priv.ADMIN);
  });
});

describe('hasPriv(context, require)', () => {
  it('authorized pages require "loading" '
  + 'for "loading" priv.', async () => {
    mockContext.conf = null;
    mockContext.authUser = { uid: 'id01' } as User;
    expect(currentPriv(mockContext)).toEqual(Priv.LOADING);

    expect(hasPriv(mockContext, Priv.LOADING)).toBeTruthy();

    expect(hasPriv(mockContext, Priv.LOADED)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.GUEST)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.PENDING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.USER)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.ADMIN)).toBeFalsy();
  });

  it('authorized pages require "loaded", "guest" '
  + 'for "guest" priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = {} as Account;
    expect(currentPriv(mockContext)).toEqual(Priv.GUEST);

    expect(hasPriv(mockContext, Priv.LOADED)).toBeTruthy();
    expect(hasPriv(mockContext, Priv.GUEST)).toBeTruthy();

    expect(hasPriv(mockContext, Priv.LOADING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.PENDING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.USER)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.ADMIN)).toBeFalsy();
  });

  it('authorized pages require "loaded", "pending" '
  + 'for "pending" priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;
    expect(currentPriv(mockContext)).toEqual(Priv.PENDING);

    expect(hasPriv(mockContext, Priv.LOADED)).toBeTruthy();
    expect(hasPriv(mockContext, Priv.PENDING)).toBeTruthy();

    expect(hasPriv(mockContext, Priv.LOADING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.GUEST)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.USER)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.ADMIN)).toBeFalsy();
  });

  it('authorized pages require "loaded", "user" '
  + 'for "user" priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;
    expect(currentPriv(mockContext)).toEqual(Priv.USER);

    expect(hasPriv(mockContext, Priv.LOADED)).toBeTruthy();
    expect(hasPriv(mockContext, Priv.USER)).toBeTruthy();

    expect(hasPriv(mockContext, Priv.LOADING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.GUEST)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.PENDING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.ADMIN)).toBeFalsy();
  });

  it('authorized pages require "loaded", "user", "admin" '
  + 'for "admin" priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;
    expect(currentPriv(mockContext)).toEqual(Priv.ADMIN);

    expect(hasPriv(mockContext, Priv.LOADED)).toBeTruthy();
    expect(hasPriv(mockContext, Priv.USER)).toBeTruthy();
    expect(hasPriv(mockContext, Priv.ADMIN)).toBeTruthy();

    expect(hasPriv(mockContext, Priv.LOADING)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.GUEST)).toBeFalsy();
    expect(hasPriv(mockContext, Priv.PENDING)).toBeFalsy();
  });
});

describe('currentPage(location, pages)', () => {
  const pages = [
    { path: '' } as MenuItem,
    { path: 'test1' } as MenuItem,
    { path: 'test2' } as MenuItem,
    { path: 'test3' } as MenuItem,
    { path: '*' } as MenuItem,
  ];

  it('returns then item of pages with path matches given location', () => {
    expect(
      currentPage({ pathname: '/' }, pages),
    ).toEqual({ path: '' });
    expect(
      currentPage({ pathname: '/test2' }, pages),
    ).toEqual({ path: 'test2' });
  });

  it('returns then item with path: * if no route', () => {
    expect(
      currentPage({ pathname: '/test0' }, pages),
    ).toEqual({ path: '*' });
  });
});

describe('MenuItem', () => {
  it('is initialized with default values.', () => {
    expect(new MenuItem()).toEqual({
      path: '',
      require: Priv.NOROUTE,
      title: '',
    });
  });
});
