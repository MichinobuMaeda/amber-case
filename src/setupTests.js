// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';

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
  setThemeMode: jest.fn(),
  setConf: jest.fn(),
  setAccounts: jest.fn(),
  setGroups: jest.fn(),
  setMe: jest.fn(),
  setAuthUser: jest.fn(),
  setReauthenticationTimeout: jest.fn(),
};

export const initialieMock = () => {
  mockWindow.location.href = mockUrl;

  mockContext.version = '1.0.0';
  mockContext.unsubConf = null;
  mockContext.unsub = {};
  mockContext.auth = {
    name: 'mockAuth',
    currentUser: { uid: 'id01' },
  };
  mockContext.db = { name: 'mockDb' };
  mockContext.storage = { name: 'mockStorage' };
  mockContext.functions = { name: 'mockFunctions' };
  mockContext.themeMode = 'light';
  mockContext.preferColorScheme = 'light';
  mockContext.conf = {};
  mockContext.authUser = {};
  mockContext.me = {};
  mockContext.accounts = [];
  mockContext.groups = [];
  mockContext.reauthenticationTimeout = 0;
};
