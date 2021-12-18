import React, { useContext } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';

import AppContext from '../api/AppContext';
import { Priv, hasPriv } from '../api/authorization';

const propTypes = {
  require: PropTypes.oneOf([
    Priv.NOROUTE, Priv.LOADING, Priv.LOADED, Priv.GUEST, Priv.PENDING, Priv.USER, Priv.ADMIN,
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

  if ((require === Priv.NOROUTE)
    || (require === Priv.ADMIN && hasPriv(context, Priv.USER))
  ) {
    return <Navigate to="/" replace />;
  }

  const from = [Priv.LOADED, Priv.USER, Priv.ADMIN].includes(require)
    ? location
    : location.state?.from;

  if (hasPriv(context, Priv.USER)) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  if (hasPriv(context, Priv.PENDING)) {
    return <Navigate to="/emailVerify" state={from ? { from } : {}} />;
  }

  if (hasPriv(context, Priv.GUEST)) {
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
