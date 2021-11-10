export default (mode) => [
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
  },
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
  },
].find((item) => item.palette.mode === (mode === 'dark' ? 'dark' : 'light'));
