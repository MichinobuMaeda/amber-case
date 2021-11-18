import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl, FormHelperText, InputLabel, Input,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validateEmail } from '../conf';

const EmailField = ({
  id, 'data-testid': dataTestid, label, value, required, onChange,
}) => {
  const isEmptyError = (v) => required && !validateReuired(v);
  const isFormatError = (v) => validateReuired(v) && !validateEmail(v);
  const { t } = useTranslation();
  const [email, setEmail] = useState(value);
  const [emptyError, setEmptyError] = useState(isEmptyError(value));
  const [formatError, setFormatError] = useState(isFormatError(value));

  const handleValueChange = (e) => {
    const newEmptyError = isEmptyError(e.target.value);
    const newFormatError = isFormatError(e.target.value);
    setEmail(e.target.value);
    setEmptyError(newEmptyError);
    setFormatError(newFormatError);
    if (onChange) onChange(e.target.value);
  };

  return (
    <FormControl
      variant="standard"
      fullWidth
      sx={{ maxWidth: '480px' }}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        data-testid={dataTestid}
        type="text"
        value={email}
        error={emptyError || formatError}
        onChange={handleValueChange}
      />
      {emptyError && (
        <FormHelperText error>{t('inputnis required')}</FormHelperText>
      )}
      {formatError && (
        <FormHelperText error>{t('correct your email address')}</FormHelperText>
      )}
    </FormControl>
  );
};

EmailField.propTypes = {
  id: PropTypes.string,
  'data-testid': PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

EmailField.defaultProps = {
  id: null,
  'data-testid': null,
  label: '',
  value: '',
  required: false,
  onChange: null,
};

export default EmailField;
