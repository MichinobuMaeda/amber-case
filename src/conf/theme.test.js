import themeOptions from './theme';

describe('themeOptions(mode)', () => {
  it('return dark theme options for param "dark".', async () => {
    expect(themeOptions('dark').palette.mode).toEqual('dark');
  });
  it('return light theme options for param not "dark".', async () => {
    expect(themeOptions('light').palette.mode).toEqual('light');
    expect(themeOptions('dummy').palette.mode).toEqual('light');
  });
});
