import React from 'react';
import HomeIcon from '@mui/icons-material/Home';

import {
  initialieMock, mockContext,
} from '../setupTests';
import {
  currentPriv,
  hasPriv,
  currentPage,
  MenuItem,
} from './authorization';

beforeEach(() => {
  initialieMock();
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

describe('hasPriv(context, require)', () => {
  it('authorized pages require "any", "loading" '
  + 'for "loading" priv.', async () => {
    mockContext.conf = { uninitialized: true };
    mockContext.authUser = { uid: 'id01' };
    expect(currentPriv(mockContext)).toEqual('loading');

    expect(hasPriv(mockContext, 'any')).toBeTruthy();
    expect(hasPriv(mockContext, 'loading')).toBeTruthy();

    expect(hasPriv(mockContext, 'loaded')).toBeFalsy();
    expect(hasPriv(mockContext, 'guest')).toBeFalsy();
    expect(hasPriv(mockContext, 'pending')).toBeFalsy();
    expect(hasPriv(mockContext, 'user')).toBeFalsy();
    expect(hasPriv(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "guest" '
  + 'for "guest" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = {};
    expect(currentPriv(mockContext)).toEqual('guest');

    expect(hasPriv(mockContext, 'any')).toBeTruthy();
    expect(hasPriv(mockContext, 'loaded')).toBeTruthy();
    expect(hasPriv(mockContext, 'guest')).toBeTruthy();

    expect(hasPriv(mockContext, 'loading')).toBeFalsy();
    expect(hasPriv(mockContext, 'pending')).toBeFalsy();
    expect(hasPriv(mockContext, 'user')).toBeFalsy();
    expect(hasPriv(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "pending" '
  + 'for "pending" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'abc@def.ghi' };
    mockContext.me = { id: 'id01', valid: true };
    expect(currentPriv(mockContext)).toEqual('pending');

    expect(hasPriv(mockContext, 'any')).toBeTruthy();
    expect(hasPriv(mockContext, 'loaded')).toBeTruthy();
    expect(hasPriv(mockContext, 'pending')).toBeTruthy();

    expect(hasPriv(mockContext, 'loading')).toBeFalsy();
    expect(hasPriv(mockContext, 'guest')).toBeFalsy();
    expect(hasPriv(mockContext, 'user')).toBeFalsy();
    expect(hasPriv(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "user" '
  + 'for "user" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true };
    expect(currentPriv(mockContext)).toEqual('user');

    expect(hasPriv(mockContext, 'any')).toBeTruthy();
    expect(hasPriv(mockContext, 'loaded')).toBeTruthy();
    expect(hasPriv(mockContext, 'user')).toBeTruthy();

    expect(hasPriv(mockContext, 'loading')).toBeFalsy();
    expect(hasPriv(mockContext, 'guest')).toBeFalsy();
    expect(hasPriv(mockContext, 'pending')).toBeFalsy();
    expect(hasPriv(mockContext, 'admin')).toBeFalsy();
  });

  it('authorized pages require "any", "loaded", "user", "admin" '
  + 'for "admin" priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01' };
    mockContext.me = { id: 'id01', valid: true, admin: true };
    expect(currentPriv(mockContext)).toEqual('admin');

    expect(hasPriv(mockContext, 'any')).toBeTruthy();
    expect(hasPriv(mockContext, 'loaded')).toBeTruthy();
    expect(hasPriv(mockContext, 'user')).toBeTruthy();
    expect(hasPriv(mockContext, 'admin')).toBeTruthy();

    expect(hasPriv(mockContext, 'loading')).toBeFalsy();
    expect(hasPriv(mockContext, 'guest')).toBeFalsy();
    expect(hasPriv(mockContext, 'pending')).toBeFalsy();
  });
});

describe('currentPage(location, pages)', () => {
  const pages = [
    { path: '' },
    { path: 'test1' },
    { path: 'test2' },
    { path: 'test3' },
    { path: '*' },
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
  it('holds the given properties.', () => {
    const obj = new MenuItem({
      path: '/test',
      require: 'admin',
      title: 'Title 01',
      icon: <HomeIcon />,
      element: <div>Test</div>,
    });
    expect(obj.path).toEqual('/test');
    expect(obj.require).toEqual('admin');
    expect(obj.title).toEqual('Title 01');
    expect(obj.icon).toEqual(<HomeIcon />);
    expect(obj.element).toEqual(<div>Test</div>);
    expect(obj.top).toBeFalsy();
  });
});
