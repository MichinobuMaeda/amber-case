import React, { useState, useContext } from 'react';
import {
  Grid, Alert, TextField, Button,
} from '@mui/material';
import { Policy, SaveAlt, Cancel } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import '../conf/i18n';
import PageTitle from './PageTitle';
import { ServiceContext, setConfProperties } from '../api';
import EditButton from './EditButton';

const PolicyPage = () => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [editPolicy, setEditPolicy] = useState(false);
  const [policy, setPolicy] = useState(service.conf.policy);
  const [errorStatus, setErrorStatus] = useState(false);

  const onCancel = () => {
    setPolicy(service.conf.policy);
    setErrorStatus(false);
    setEditPolicy(false);
  };

  const onSubmit = async () => {
    try {
      await setConfProperties(service, { policy });
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
      {service.me.admin && editPolicy && (
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
        <Grid item xs={12}>
          <div style={{ textAlign: 'right' }}>
            <Button
              disabled={policy === service.conf.policy}
              onClick={onSubmit}
              aria-label="save"
              startIcon={<SaveAlt />}
              sx={{ mx: 2 }}
            >
              {t('Save')}
            </Button>
            <Button
              onClick={onCancel}
              aria-label="cancel"
              startIcon={<Cancel />}
              color="secondary"
              sx={{ mx: 2 }}
            >
              {t('Cancel')}
            </Button>
          </div>
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
        {service.me.admin && !editPolicy && (
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
