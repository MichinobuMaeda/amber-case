import React, { useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import InputAdornment from '@mui/material/InputAdornment';
import Cancel from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';

const propTypes = {
  'data-testid': PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  saveErrorMessage: PropTypes.string,
  validate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const TextEdit = ({
  'data-testid': dataTestid, label, value,
  validate, saveErrorMessage, onSave,
}: InferProps<typeof propTypes>) => {
  const { t } = useTranslation();

  const [changed, setChanged] = useState(value);
  const [validateError, setValidateError] = useState(validate(value));
  const [saveError, setSaveError] = useState('');

  const onChange = (text: string) => {
    setChanged(text);
    setValidateError(validate(text));
    setSaveError('');
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
    setValidateError(validate(value));
    setSaveError('');
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
          inputProps={{
            'aria-label': `${dataTestid}-input`,
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onCancel}
                  aria-label={`${dataTestid}-cancel`}
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
          aria-label={`${dataTestid}-save`}
          startIcon={<SaveAltIcon />}
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

TextEdit.propTypes = propTypes;

TextEdit.defaultProps = {
  'data-testid': null,
  value: '',
  saveErrorMessage: '',
};

export default TextEdit;
