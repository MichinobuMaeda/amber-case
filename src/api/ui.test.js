import {
  initialieMock,
  mockWindow, mockNavigator,
} from '../setupTests';
import {
  selectThemeMode,
  updateApp,
} from './ui';

beforeEach(() => {
  initialieMock();
});

describe('selectThemeMode(context)', () => {
  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "dark".', async () => {
    expect(selectThemeMode({
      themeMode: 'dark',
      preferColorScheme: 'dark',
    }).palette.mode).toEqual('dark');
  });

  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "light".', async () => {
    expect(selectThemeMode({
      themeMode: 'dark',
      preferColorScheme: 'light',
    }).palette.mode).toEqual('dark');
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "dark".', async () => {
    expect(selectThemeMode({
      themeMode: 'system',
      preferColorScheme: 'dark',
    }).palette.mode).toEqual('dark');
  });

  it('return the light theme options '
  + 'for themeMode: "light", preferColorScheme: "light".', async () => {
    expect(selectThemeMode({
      themeMode: 'light',
      preferColorScheme: 'light',
    }).palette.mode).toEqual('light');
  });

  it('return the dark theme options '
  + 'for themeMode: "light", preferColorScheme: "dark".', async () => {
    expect(selectThemeMode({
      themeMode: 'light',
      preferColorScheme: 'dark',
    }).palette.mode).toEqual('light');
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "light".', async () => {
    expect(selectThemeMode({
      themeMode: 'system',
      preferColorScheme: 'light',
    }).palette.mode).toEqual('light');
  });
});

describe('updateApp(navigator, window)', () => {
  it('unregister the service worker and reload web app.', async () => {
    await updateApp(mockNavigator, mockWindow);
    expect(mockNavigator.serviceWorker.ready.unregister.mock.calls).toEqual([[]]);
    expect(mockWindow.location.reload.mock.calls).toEqual([[]]);
  });
});
