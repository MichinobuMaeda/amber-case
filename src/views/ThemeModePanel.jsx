import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, isSignedIn, setAccountProperties } from '../api';
import { RadioButtons } from '../components';

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
    <RadioButtons
      onChange={handleChange}
      items={[
        { value: 'light', label: t('Light mode') },
        { value: 'dark', label: t('Dark mode') },
        { value: 'system', label: t('Accept system settings') },
      ]}
      value={service.themeMode}
    />
  );
};

export default ThemeModePanel;
