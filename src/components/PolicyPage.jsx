import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Policy from '@mui/icons-material/Policy';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Cancel from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import '../conf/i18n';
import PageTitle from './PageTitle';
import { AppContext, setConfProperties } from '../api';
import EditButton from './EditButton';

const PolicyPage = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [editPolicy, setEditPolicy] = useState(false);
  const [policy, setPolicy] = useState(context.conf.policy);
  const [errorStatus, setErrorStatus] = useState(false);

  const onCancel = () => {
    setPolicy(context.conf.policy);
    setErrorStatus(false);
    setEditPolicy(false);
  };

  const onSubmit = async () => {
    try {
      await setConfProperties(context, { policy });
      setErrorStatus(false);
      setEditPolicy(false);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="policy-page">
      <Grid item xs={12}>
        <PageTitle icon={<Policy />} title={t('Policy')} />
      </Grid>
      {context.me.admin && editPolicy && (
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="policy-field"
            label={t('Policy')}
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            multiline
            rows={10}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs="auto">
            <Button
              disabled={policy === context.conf.policy}
              onClick={onSubmit}
              aria-label="save"
              startIcon={<SaveAlt />}
            >
              {t('Save')}
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button
              onClick={onCancel}
              aria-label="cancel"
              startIcon={<Cancel />}
              color="secondary"
            >
              {t('Cancel')}
            </Button>
          </Grid>
        </Grid>
        {errorStatus && (
        <Grid item xs={12}>
          <Alert severity="error">
            {t('failed to save data') + t('retry failed or call admin')}
          </Alert>
        </Grid>
        )}
      </Grid>
      )}
      <Grid item xs={12}>
        {context.me.admin && !editPolicy && (
        <div style={{ float: 'right' }}>
          <EditButton aria-label="edit-policy" onClick={() => setEditPolicy(true)} />
        </div>
        )}
        <ReactMarkdown>{policy}</ReactMarkdown>
      </Grid>
    </Grid>
  );
};

export default PolicyPage;
