import { ThemeOptions } from '@mui/material/styles';

import { themeOptions } from '../conf';
import { Context } from './AppContext';

export const selectThemeMode = (context: Context): ThemeOptions => themeOptions
  .find(
    (item: ThemeOptions) => item.palette?.mode === (
      (
        context.themeMode === 'system'
          ? context.preferColorScheme
          : context.themeMode
      ) === 'dark'
        ? 'dark'
        : 'light'
    ),
  )!;

export const updateApp = async (navigator: any, window: any) => {
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  window.location.reload();
};
