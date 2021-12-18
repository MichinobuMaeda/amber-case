import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import AppContext from '../api/AppContext';
import { ThemeMode, themeModeList } from '../api/models';
import { Priv, hasPriv } from '../api/authorization';
import { setAccountProperties } from '../api/accounts';
import RadioButtons from '../components/RadioButtons';

const ThemeModePanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const handleChange = async (mode: string) => {
    context.setThemeMode(mode);
    if (hasPriv(context, Priv.USER)) {
      await setAccountProperties(
        context,
        context.me!.id!,
        { themeMode: themeModeList.indexOf(mode) },
      );
    }
  };

  return (
    <Grid container spacing={2} data-testid="themeMode-panel">
      <Grid item xs={12}>
        <RadioButtons
          legend={t('Theme mode')}
          onChange={handleChange}
          items={[
            {
              label: t('Light mode'),
              value: ThemeMode.LIGHT,
            },
            {
              label: t('Dark mode'),
              value: ThemeMode.DARK,
            },
            {
              label: t('Accept system settings'),
              value: ThemeMode.SYSTEM,
            },
          ]}
          value={context.themeMode!}
        />
      </Grid>
    </Grid>
  );
};

export default ThemeModePanel;
