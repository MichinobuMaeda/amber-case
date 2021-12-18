import { ThemeOptions } from '@mui/material/styles';

import { themeOptions } from '../conf';
import { Context } from './AppContext';
import { ThemeMode } from './models';

export const selectThemeMode = (context: Context): ThemeOptions => themeOptions
  .find(
    (item: ThemeOptions) => item.palette?.mode === (
      (
        context.themeMode === ThemeMode.SYSTEM
          ? context.preferColorScheme
          : context.themeMode
      ) === ThemeMode.DARK
        ? ThemeMode.DARK
        : ThemeMode.LIGHT
    ),
  )!;

export const updateApp = async (navigator: any, window: any) => {
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  window.location.reload();
};
