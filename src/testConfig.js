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
export const mockSetReauthenticationTimeout = jest.fn();

export const mockDocPath = 'mockDocPath';
export const mockOnSnapshot = jest.fn(() => jest.fn());
export const mockDoc = jest.fn();

export const mockService = {};

export const mockLocalStorage = {};
export const mockLocalStorageSetItem = jest.fn();
export const mockLocalStorageRemoveItem = jest.fn();
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
    setItem: mockLocalStorageSetItem,
    removeItem: mockLocalStorageRemoveItem,
  },
};

export const resetMockService = () => {
  jest.clearAllMocks();
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
  mockService.reauthenticationTimeout = 0;
  mockService.setReauthenticationTimeout = mockSetReauthenticationTimeout;

  const mockLocalStorageKeys = Object.keys(mockLocalStorage);
  mockLocalStorageKeys.forEach((key) => { delete mockLocalStorage[key]; });
  mockWindow.location.href = mockUrl;
};
