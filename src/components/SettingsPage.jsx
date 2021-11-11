import React from 'react';
// import PropTypes from 'prop-types';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PageTitle from './PageTitle';
import '../conf/i18n';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-testid="SettingsPage" icon={Settings} title={t('Settings')} />
    </>
  );
};

// HomePage.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   service: PropTypes.object.isRequired,
// };

export default SettingsPage;
