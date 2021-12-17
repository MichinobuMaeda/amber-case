import React, { useContext } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';

import { AppContext, hasPriv } from '../api';

const propTypes = {
  require: PropTypes.oneOf([
    'any', 'loading', 'loaded', 'guest', 'pending', 'user', 'admin', 'noroute',
  ]).isRequired,
  children: PropTypes.node.isRequired,
  redirect: PropTypes.bool,
  substitutes: PropTypes.node,
};

const Guard = ({
  require, children, substitutes, redirect,
}: InferProps<typeof propTypes>) => {
  const context = useContext(AppContext);
  const location = useLocation();

  if (hasPriv(context, require)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  if (!redirect) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{substitutes}</>;
  }

  if ((require === 'noroute')
    || (require === 'admin' && hasPriv(context, 'user'))
  ) {
    return <Navigate to="/" replace />;
  }

  const from = ['any', 'loaded', 'user', 'admin'].includes(require)
    ? location
    : location.state?.from;

  if (hasPriv(context, 'user')) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  if (hasPriv(context, 'pending')) {
    return <Navigate to="/emailVerify" state={from ? { from } : {}} />;
  }

  if (hasPriv(context, 'guest')) {
    return <Navigate to="/signin" state={from ? { from } : {}} />;
  }

  return <Navigate to="/loading" state={from ? { from } : {}} />;
};

Guard.propTypes = propTypes;

Guard.defaultProps = {
  redirect: false,
  substitutes: null,
};

export default Guard;
