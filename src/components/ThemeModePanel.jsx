import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, isSignedIn, setAccountProperties } from '../api';
import RadioButtons from './RadioButtons';

const ThemeModePanel = ({ 'data-testid': dataTestid }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);

  const handleChange = async (mode) => {
    service.setThemeMode(mode);
    if (isSignedIn(service)) {
      await setAccountProperties(service, service.me.id, { themeMode: mode });
    }
  };

  return (
    <Grid container spacing={2} data-testid={dataTestid}>
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

ThemeModePanel.propTypes = {
  'data-testid': PropTypes.string,
};

ThemeModePanel.defaultProps = {
  'data-testid': null,
};

export default ThemeModePanel;
