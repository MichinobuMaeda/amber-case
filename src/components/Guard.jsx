import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';

import { AppContext, currentPriv, isAllowed } from '../api';

const Guard = ({
  require, children, redirect, substitutes,
}) => {
  const context = useContext(AppContext);
  const location = useLocation();
  const from = location.state?.from;

  if (isAllowed(context, require)) return children;

  const priv = currentPriv(context);

  if (require === 'admin' && priv === 'user') {
    return <Navigate to="/" replace />;
  }

  if (substitutes) return substitutes;

  if (redirect) {
    switch (priv) {
      case 'admin':
        return <Navigate to={from?.pathname || '/'} replace />;
      case 'user':
        return <Navigate to={from?.pathname || '/'} replace />;
      case 'pending':
        return ['any', 'loaded', 'user', 'admin'].includes(require)
          ? <Navigate to="/emailVerify" state={{ from: location }} />
          : <Navigate to="/emailVerify" state={from ? { from } : {}} />;
      case 'guest':
        return ['any', 'loaded', 'user', 'admin'].includes(require)
          ? <Navigate to="/signin" state={{ from: location }} />
          : <Navigate to="/signin" state={from ? { from } : {}} />;
      default:
        return ['any', 'loaded', 'user', 'admin'].includes(require)
          ? <Navigate to="/loading" state={{ from: location }} />
          : <Navigate to="/loading" state={from ? { from } : {}} />;
    }
  }

  return null;
};

Guard.propTypes = {
  require: PropTypes.oneOf([
    'any', 'loading', 'loaded', 'guest', 'pending', 'user', 'admin',
  ]).isRequired,
  children: PropTypes.node.isRequired,
  redirect: PropTypes.bool,
  substitutes: PropTypes.node,
};

Guard.defaultProps = {
  redirect: false,
  substitutes: null,
};

export default Guard;
