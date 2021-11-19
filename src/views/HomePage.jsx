import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <div data-testid="HomePage">Home</div>
      <p style={{ float: 'right', marginTop: 0 }}><Link to="/policy">{t('Polycy')}</Link></p>
    </>
  );
};

export default HomePage;
