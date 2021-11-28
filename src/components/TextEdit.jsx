import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SaveAlt from '@mui/icons-material/SaveAlt';
import InputAdornment from '@mui/material/InputAdornment';
import Cancel from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';

const TextEdit = ({
  'data-testid': dataTestid, label, value,
  validate, saveErrorMessage, onSave,
}) => {
  const { t } = useTranslation();

  const handleValidate = (text) => validate(text).reduce((ret, cur) => cur || ret, null);

  const [changed, setChanged] = useState(value);
  const [validateError, setValidateError] = useState(handleValidate(value));
  const [saveError, setSaveError] = useState(null);

  const onChange = (text) => {
    setChanged(text);
    setValidateError(handleValidate(text));
    setSaveError(null);
  };

  const onSubmit = async () => {
    try {
      await onSave(changed);
    } catch (e) {
      setSaveError(
        saveErrorMessage || t('failed to save data') + t('retry failed or call admin'),
      );
    }
  };

  const onCancel = () => {
    setChanged(value);
    setValidateError(handleValidate(value));
    setSaveError(null);
  };

  return (
    <Grid
      data-testid={dataTestid}
      container
      spacing={2}
      alignItems="center"
    >
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id={`${dataTestid}-input`}
          value={changed}
          label={label}
          onChange={(e) => onChange(e.target.value)}
          error={!!validateError}
          helperText={validateError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onCancel}
                  edge="end"
                  disabled={value === changed}
                >
                  <Cancel />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!!validateError || value === changed}
          onClick={onSubmit}
          aria-label="save"
          startIcon={<SaveAlt />}
        >
          {t('Save')}
        </Button>
      </Grid>
      {saveError && (
      <Grid item xs={12}>
        <Alert severity="error">
          {saveError}
        </Alert>
      </Grid>
      )}
    </Grid>
  );
};

TextEdit.propTypes = {
  'data-testid': PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  saveErrorMessage: PropTypes.string,
  validate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

TextEdit.defaultProps = {
  'data-testid': null,
  value: null,
  saveErrorMessage: null,
};

export default TextEdit;
