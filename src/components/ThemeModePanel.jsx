import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, isSignedIn, setAccountProperties } from '../api';
import RadioButtons from './RadioButtons';

const ThemeModePanel = () => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);

  const handleChange = async (mode) => {
    service.setThemeMode(mode);
    if (isSignedIn(service)) {
      await setAccountProperties(service, service.me.id, { themeMode: mode });
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
          value={service.themeMode}
        />
      </Grid>
    </Grid>
  );
};

export default ThemeModePanel;
