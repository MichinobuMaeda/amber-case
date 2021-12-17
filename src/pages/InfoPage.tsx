import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import AppContext from '../api/AppContext';
import { hasPriv } from '../api/authorization';
import { setConfProperties } from '../api/service';
import AccordionSection from '../components/AccordionSection';
import MarkDownEdit from '../components/MarkDownEdit';

const InfoPage = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  return (
    <>
      <AccordionSection
        data-testid="copyright-section"
        title={t('Copyright')}
      >
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4" component="div">
            {t('App name')}
          </Typography>
          <Typography variant="body2" component="div">
            {`Version: ${context.version}`}
          </Typography>
        </Stack>
        <MarkDownEdit
          data-testid="copyright"
          label={t('Copyright')}
          value={context.conf?.copyright ?? ''}
          editable={hasPriv(context, 'admin')}
          onSave={(v) => setConfProperties(context, { copyright: v })}
        />
      </AccordionSection>
      <AccordionSection
        data-testid="policy-section"
        title={t('Policy')}
        defaultExpanded
      >
        <MarkDownEdit
          data-testid="policy"
          label={t('Policy')}
          value={context.conf?.policy ?? ''}
          editable={hasPriv(context, 'admin')}
          onSave={(v) => setConfProperties(context, { policy: v })}
        />
      </AccordionSection>
    </>
  );
};

export default InfoPage;
