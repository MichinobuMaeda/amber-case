import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Cancel from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import '../conf/i18n';
import EditButton from './EditButton';

const MarkDownEdit = ({
  'data-testid': dataTestid, label, value,
  editable, saveErrorMessage, onSave,
}) => {
  const { t } = useTranslation();
  const [changed, setChanged] = useState('');
  const [edit, setEdit] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const onEdit = () => {
    setChanged(value || '');
    setSaveError(null);
    setEdit(true);
  };

  const onChange = (text) => {
    setChanged(text);
    setSaveError(null);
  };

  const onSubmit = async () => {
    try {
      await onSave(changed);
      setSaveError(false);
      setEdit(false);
    } catch (e) {
      setSaveError(
        saveErrorMessage || t('failed to save data') + t('retry failed or call admin'),
      );
    }
  };

  const onCancel = () => {
    setChanged(value || '');
    setSaveError(null);
    setEdit(false);
  };

  return (
    <Grid container spacing={2} data-testid={dataTestid}>
      {edit && (
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id={`${dataTestid}-input`}
            label={label}
            value={changed}
            onChange={(e) => onChange(e.target.value)}
            multiline
            rows={10}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs="auto">
            <Button
              disabled={changed === value}
              onClick={onSubmit}
              aria-label={`${dataTestid}-save`}
              startIcon={<SaveAlt />}
            >
              {t('Save')}
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button
              onClick={onCancel}
              aria-label={`${dataTestid}-cancel`}
              startIcon={<Cancel />}
              color="secondary"
            >
              {t('Cancel')}
            </Button>
          </Grid>
        </Grid>
        {saveError && (
        <Grid item xs={12}>
          <Alert severity="error">
            {saveError}
          </Alert>
        </Grid>
        )}
      </Grid>
      )}
      <Grid item xs={12}>
        {editable && !edit && (
        <div style={{ float: 'right' }}>
          <EditButton aria-label={`${dataTestid}-edit`} onClick={() => onEdit()} />
        </div>
        )}
        <ReactMarkdown>{edit ? changed : value}</ReactMarkdown>
      </Grid>
    </Grid>
  );
};

MarkDownEdit.propTypes = {
  'data-testid': PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  editable: PropTypes.bool,
  saveErrorMessage: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

MarkDownEdit.defaultProps = {
  'data-testid': null,
  value: null,
  editable: false,
  saveErrorMessage: null,
};

export default MarkDownEdit;
