import React from 'react';
import { Policy } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';
import { PageTitle } from '../components';

const PolicyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-testid="PolicyPage" icon={<Policy />} title={t('Policy')} />
    </>
  );
};

export default PolicyPage;
