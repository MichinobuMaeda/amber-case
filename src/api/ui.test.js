import { selectThemeMode } from '.';

import '../testConfig';

describe('selectThemeMode(service)', () => {
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
