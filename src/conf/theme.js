// https://mui.com/customization/default-theme/
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

export default [
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#b27000',
      },
      secondary: {
        main: '#8ab200',
      },
    },
    typography,
  },
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffc107',
      },
      secondary: {
        main: '#c6ff00',
      },
    },
    typography,
  },
];
