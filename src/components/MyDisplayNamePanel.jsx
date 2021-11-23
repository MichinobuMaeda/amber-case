import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired } from '../conf';
import { AppContext, setAccountProperties } from '../api';

const MyDisplayNamePanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const getValidationError = (text) => (
    validateReuired(text) ? null : t('input is required')
  );

  const [name, setName] = useState(
    getValidationError(context.me.name) ? '' : context.me.name.trim(),
  );
  const [validationError, setValidationError] = useState(getValidationError(context.me.name));
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onNameChange = (text) => {
    setName(text.trim());
    setValidationError(getValidationError(text));
    setSuccessStatus(false);
    setErrorStatus(false);
  };

  const onSubmit = async () => {
    try {
      await setAccountProperties(context, context.me.id, { name });
      setSuccessStatus(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="myDisplayName-panel">
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          id="myDisplayName-name"
          value={name}
          label={t('Display name')}
          onChange={(e) => onNameChange(e.target.value)}
          error={!!validationError}
          helperText={validationError}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!name.trim() || name.trim() === context.me.name}
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

export default MyDisplayNamePanel;
