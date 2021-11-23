import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { AppContext, isSignedIn, setAccountProperties } from '../api';
import RadioButtons from './RadioButtons';

const ThemeModePanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const handleChange = async (mode) => {
    context.setThemeMode(mode);
    if (isSignedIn(context)) {
      await setAccountProperties(context, context.me.id, { themeMode: mode });
    }
  };

  return (
    <Grid container spacing={2} data-testid="themeMode-panel">
      <Grid item xs={12}>
        <RadioButtons
          onChange={handleChange}
          items={[
            { value: 'light', label: t('Light mode') },
            { value: 'dark', label: t('Dark mode') },
            { value: 'system', label: t('Accept system settings') },
          ]}
          value={context.themeMode}
        />
      </Grid>
    </Grid>
  );
};

export default ThemeModePanel;
