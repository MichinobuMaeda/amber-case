import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Alert, TextField, Button,
} from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, setAccountProperties } from '../api';

const MyDisplayNamePanel = ({ 'data-testid': dataTestid }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);

  const validateName = (text) => (text && typeof text === 'string' && text.trim()
    ? null
    : t('input is required'));

  const [name, setName] = useState(validateName(service.me.name) ? '' : service.me.name.trim());
  const [inputError, setInputError] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onNameChange = (text) => {
    setName(text.trim());
    setInputError(validateName(text));
    setSuccessStatus(false);
    setErrorStatus(false);
  };

  const onSubmit = async () => {
    try {
      await setAccountProperties(service, service.me.id, { name });
      setSuccessStatus(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid={dataTestid}>
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          id="myDisplayName-panel"
          value={name}
          label={t('Display name')}
          onChange={(e) => onNameChange(e.target.value)}
          error={!!inputError}
          helperText={inputError}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!name.trim() || name.trim() === service.me.name}
          onClick={onSubmit}
          aria-label="save"
          startIcon={<SaveAlt />}
        >
          {t('Save')}
        </Button>
      </Grid>
      {successStatus && (
      <Grid item xs={12}>
        <Alert severity="success">
          {t('completed saving data')}
        </Alert>
      </Grid>
      )}
      {errorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to save data') + t('retry failed or call admin')}
        </Alert>
      </Grid>
      )}
    </Grid>
  );
};

MyDisplayNamePanel.propTypes = {
  'data-testid': PropTypes.string,
};

MyDisplayNamePanel.defaultProps = {
  'data-testid': null,
};

export default MyDisplayNamePanel;
