import { themeOptions } from '../conf';

// eslint-disable-next-line import/prefer-default-export
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
