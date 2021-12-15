import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import AppContext from '../api/AppContext';
import { hasPriv } from '../api/authorization';
import { setAccountProperties } from '../api/accounts';
import RadioButtons, { RadioButtonsItem } from '../components/RadioButtons';

const ThemeModePanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const handleChange = async (mode) => {
    context.setThemeMode(mode);
    if (hasPriv(context, 'user')) {
      await setAccountProperties(context, context.me.id, { themeMode: mode });
    }
  };

  return (
    <Grid container spacing={2} data-testid="themeMode-panel">
      <Grid item xs={12}>
        <RadioButtons
          legend={t('Theme mode')}
          onChange={handleChange}
          items={[
            new RadioButtonsItem({
              label: t('Light mode'),
              value: 'light',
            }),
            new RadioButtonsItem({
              label: t('Dark mode'),
              value: 'dark',
            }),
            new RadioButtonsItem({
              label: t('Accept system settings'),
              value: 'system',
            }),
          ]}
          value={context.themeMode}
        />
      </Grid>
    </Grid>
  );
};

export default ThemeModePanel;
