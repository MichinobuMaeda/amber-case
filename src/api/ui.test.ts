import {
  initializeMock, mockContext,
  mockWindow, mockNavigator,
} from '../setupTests';
import {
  selectThemeMode,
  updateApp,
} from './ui';
import { ThemeMode } from '../api/models'

beforeEach(() => {
  initializeMock();
});

describe('selectThemeMode(context)', () => {
  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = ThemeMode.DARK;
    mockContext.preferColorScheme = ThemeMode.DARK;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.DARK);
  });

  it('return the dark theme options '
  + 'for themeMode: "dark", preferColorScheme: "light".', async () => {
    mockContext.themeMode = ThemeMode.DARK;
    mockContext.preferColorScheme = ThemeMode.LIGHT;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.DARK);
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = ThemeMode.SYSTEM;
    mockContext.preferColorScheme = ThemeMode.DARK;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.DARK);
  });

  it('return the light theme options '
  + 'for themeMode: "light", preferColorScheme: "light".', async () => {
    mockContext.themeMode = ThemeMode.LIGHT;
    mockContext.preferColorScheme = ThemeMode.LIGHT;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.LIGHT);
  });

  it('return the dark theme options '
  + 'for themeMode: "light", preferColorScheme: "dark".', async () => {
    mockContext.themeMode = ThemeMode.LIGHT;
    mockContext.preferColorScheme = ThemeMode.DARK;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.LIGHT);
  });

  it('return the dark theme options '
  + 'for themeMode: "system", preferColorScheme: "light".', async () => {
    mockContext.themeMode = ThemeMode.SYSTEM;
    mockContext.preferColorScheme = ThemeMode.LIGHT;
    expect(selectThemeMode(mockContext).palette?.mode).toEqual(ThemeMode.LIGHT);
  });
});

describe('updateApp(navigator, window)', () => {
  it('unregister the service worker and reload web app.', async () => {
    await updateApp(mockNavigator, mockWindow);
    expect(mockNavigator.serviceWorker.ready.unregister.mock.calls).toEqual([[]]);
    expect(mockWindow.location.reload.mock.calls).toEqual([[]]);
  });
});
