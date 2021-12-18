// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';
import { User } from 'firebase/auth';
import { Unsubscribe } from 'firebase/firestore';

import {
  Conf, Account, Group, ThemeMode,
} from './api/models';
import { Context } from './api/AppContext';

global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

export const mockUrl = 'https://example.com/';

export const mockWindow = {
  location: {
    href: mockUrl,
    reload: jest.fn(),
    replace: jest.fn(),
  },
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
};

export const mockNavigator = {
  serviceWorker: {
    ready: {
      unregister: jest.fn(),
    },
  },
};

jest.mock('react-markdown', () => 'div');

export const mockContext = {
  version: '1.0.0',
  unsub: new Map<string, any>(),
  setThemeMode: jest.fn(),
  setConf: jest.fn(),
  accounts: [] as Account[],
  setAccounts: jest.fn(),
  groups: [] as Group[],
  setGroups: jest.fn(),
  setMe: jest.fn(),
  setAuthUser: jest.fn(),
  setReauthenticationTimeout: jest.fn(),
} as Context;

export const initializeMock = () => {
  mockWindow.location.href = mockUrl;

  mockContext.version = '1.0.0';
  mockContext.unsubConf = undefined;
  mockContext.unsub = new Map<string, Unsubscribe>();
  mockContext.auth = {
    name: 'mockAuth',
    currentUser: { uid: 'id01' },
  };
  mockContext.db = { name: 'mockDb' };
  mockContext.storage = { name: 'mockStorage' };
  mockContext.functions = { name: 'mockFunctions' };
  mockContext.themeMode = ThemeMode.LIGHT;
  mockContext.preferColorScheme = ThemeMode.LIGHT;
  mockContext.conf = {} as Conf;
  mockContext.authUser = {} as User;
  mockContext.me = {} as Account;
  mockContext.accounts = [] as Account[];
  mockContext.groups = [] as Group[];
  mockContext.reauthenticationTimeout = 0;
};
