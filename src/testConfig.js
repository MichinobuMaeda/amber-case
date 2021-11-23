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

export const mockContext = {};

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

export const mockDocPath = 'mockDocPath';
export const mockOnSnapshot = jest.fn(() => jest.fn());
export const mockDoc = jest.fn();
export const mockConnectFirestoreEmulator = jest.fn();
export const mockUpdateDoc = jest.fn();
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  onSnapshot: mockOnSnapshot,
  doc: mockDoc,
  connectFirestoreEmulator: mockConnectFirestoreEmulator,
  updateDoc: mockUpdateDoc,
}));

jest.mock('react-markdown', () => 'div');

export const resetMockService = () => {
  jest.clearAllMocks();
  mockContext.version = '1.0.0';
  mockContext.unsubConf = null;
  mockContext.unsub = {};
  mockContext.auth = mockAuth;
  mockContext.db = mockDb;
  mockContext.storage = mockStorage;
  mockContext.functions = mockFunctions;
  mockContext.themeMode = 'light';
  mockContext.setThemeMode = mockSetThemeMode;
  mockContext.preferColorScheme = 'light';
  mockContext.conf = {};
  mockContext.setConf = mockSetConf;
  mockContext.authUser = {};
  mockContext.setAuthUser = mockSetAuthUser;
  mockContext.me = {};
  mockContext.groups = [];
  mockContext.setMe = mockSetMe;
  mockContext.reauthenticationTimeout = 0;
  mockContext.setReauthenticationTimeout = mockSetReauthenticationTimeout;

  const mockLocalStorageKeys = Object.keys(mockLocalStorage);
  mockLocalStorageKeys.forEach((key) => { delete mockLocalStorage[key]; });
  mockWindow.location.href = mockUrl;
};
