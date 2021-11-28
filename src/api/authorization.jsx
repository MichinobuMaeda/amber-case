export const currentPriv = (context) => {
  if (!context.conf.id || context.authUser.uninitialized) return 'loading';
  if (!context.me.id) return 'guest';
  if (context.authUser.email && !context.authUser.emailVerified) return 'pending';
  if (!context.me.admin) return 'user';
  return 'admin';
};

export const isAllowed = (context, require) => {
  const priv = currentPriv(context);
  return require === 'any'
    || require === priv
    || (require === 'loaded' && context.conf.id)
    || (require === 'user' && priv === 'admin');
};
