export const mockUrl = 'https://example.com/';

export const mockCurrentUser = { uid: 'id01' };
export const mockAuth = {
  name: 'mockAuth',
  currentUser: mockCurrentUser,
};
export const mockDb = { name: 'mockDb' };
export const mockStorage = { name: 'mockStorage' };
export const mockFunctions = { name: 'mockFunctions' };

export const mockSetThemeMode = jest.fn();
export const mockSetConf = jest.fn();
export const mockSetMe = jest.fn();
export const mockSetAuthUser = jest.fn();

export const mockDocPath = 'mockDocPath';
export const mockOnSnapshot = jest.fn(() => jest.fn());
export const mockDoc = jest.fn();

export const mockService = {};

export const mockLocalStorage = {};
export const mockLocationReload = jest.fn();
export const mockLocationReplace = jest.fn();
export const mockWindow = {
  location: {
    href: mockUrl,
    reload: mockLocationReload,
    replace: mockLocationReplace,
  },
  localStorage: {
    getItem: (key) => mockLocalStorage[key],
    setItem: (key, value) => { mockLocalStorage[key] = value; },
    removeItem: (key) => { delete mockLocalStorage[key]; },
  },
};

export const resetMockService = () => {
  mockService.version = '1.0.0';
  mockService.unsubConf = null;
  mockService.unsub = {};
  mockService.auth = mockAuth;
  mockService.db = mockDb;
  mockService.storage = mockStorage;
  mockService.functions = mockFunctions;
  mockService.themeMode = 'light';
  mockService.setThemeMode = mockSetThemeMode;
  mockService.preferColorScheme = 'light';
  mockService.conf = {};
  mockService.setConf = mockSetConf;
  mockService.authUser = {};
  mockService.setAuthUser = mockSetAuthUser;
  mockService.me = {};
  mockService.setMe = mockSetMe;

  const mockLocalStorageKeys = Object.keys(mockLocalStorage);
  mockLocalStorageKeys.forEach((key) => { delete mockLocalStorage[key]; });
  mockWindow.location.href = mockUrl;
};
