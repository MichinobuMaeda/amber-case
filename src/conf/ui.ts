import { ThemeOptions, Components } from '@mui/material/styles';

export const menuWidth = 320;
export const shrinkMenuBreakPoint = 'md';

// https://mui.com/customization/default-theme/
const components: Components = {
  MuiButton: {
    defaultProps: {
      variant: 'contained', // 'contained', 'outlined', 'text'
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'standard', // 'standard', 'outlined', 'filled'
      fullWidth: true,
      sx: { minHeight: '4.5em' },
    },
  },
};

const typography = {
  fontFamily: '"Yu Gothic Medium", "YuGothic Medium", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  h1: {
    fontSize: '1.4rem',
  },
  h2: {
    fontSize: '1.8rem',
  },
  h3: {
    fontSize: '1.4rem',
  },
  h4: {
    fontSize: '1.2rem',
  },
  h5: {
    fontSize: '1.1rem',
  },
  h6: {
    fontSize: '1.05rem',
  },
};

export const themeOptions: Array<ThemeOptions> = [
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#967833',
      },
      secondary: {
        main: '#0277bd',
      },
    },
    components,
    typography,
  },
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffc107',
      },
      secondary: {
        main: '#4fc3f7',
      },
    },
    components,
    typography,
  },
];
