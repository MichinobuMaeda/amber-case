import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  FormControl, FormHelperText,
  InputLabel, Input, InputAdornment,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired } from '../conf';

const PasswordField = ({
  id, 'data-testid': dataTestid, label, required, onChange,
}) => {
  const isEmptyError = (v) => required && !validateReuired(v);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [emptyError, setEmptyError] = useState(isEmptyError(''));

  const handleValueChange = (e) => {
    const newEmptyError = isEmptyError(e.target.value);
    setEmptyError(newEmptyError);
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
        type={showPassword ? 'text' : 'password'}
        error={emptyError}
        onChange={handleValueChange}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )}
      />
      {emptyError && (
        <FormHelperText error>{t('inputnis required')}</FormHelperText>
      )}
    </FormControl>
  );
};

PasswordField.propTypes = {
  id: PropTypes.string,
  'data-testid': PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

PasswordField.defaultProps = {
  id: 'password',
  'data-testid': null,
  required: false,
  onChange: null,
};

export default PasswordField;
