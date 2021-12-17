import {
  initializeMock, mockContext,
  mockWindow, mockNavigator,
} from '../setupTests';
import {
  selectThemeMode,
  updateApp,
} from './ui';

beforeEach(() => {
  initializeMock();
});

describe('selectThemeMode(context)', () => {
  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = 'dark';
    mockContext.preferColorScheme = 'dark';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('dark');
  });

  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "light".', async () => {
    mockContext.themeMode = 'dark';
    mockContext.preferColorScheme = 'light';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('dark');
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = 'system';
    mockContext.preferColorScheme = 'dark';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('dark');
  });

  it('return the light theme options '
  + 'for themeMode: "light", preferColorScheme: "light".', async () => {
    mockContext.themeMode = 'light';
    mockContext.preferColorScheme = 'light';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('light');
  });

  it('return the dark theme options '
  + 'for themeMode: "light", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = 'light';
    mockContext.preferColorScheme = 'dark';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('light');
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "light".', async () => {
    mockContext.themeMode = 'system';
    mockContext.preferColorScheme = 'light';
    expect(selectThemeMode(mockContext).palette?.mode).toEqual('light');
  });
});

describe('updateApp(navigator, window)', () => {
  it('unregister the service worker and reload web app.', async () => {
    await updateApp(mockNavigator, mockWindow);
    expect(mockNavigator.serviceWorker.ready.unregister.mock.calls).toEqual([[]]);
    expect(mockWindow.location.reload.mock.calls).toEqual([[]]);
  });
});
