import { themeOptions } from '../conf';

export const selectThemeMode = ({ themeMode, preferColorScheme }) => themeOptions
  .find(
    (item) => item.palette.mode === (
      (
        themeMode === 'system'
          ? preferColorScheme
          : themeMode
      ) === 'dark'
        ? 'dark'
        : 'light'
    ),
  );

export const updateApp = async (navigator, window) => {
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  window.location.reload();
};
