export const currentPriv = (context) => {
  if (!context.conf.id || context.authUser.uninitialized) return 'loading';
  if (!context.me.id) return 'guest';
  if (context.authUser.email && !context.authUser.emailVerified) return 'pending';
  if (!context.me.admin) return 'user';
  return 'admin';
};

export const hasPriv = (context, require) => {
  const priv = currentPriv(context);
  return require === 'any'
    || require === priv
    || (require === 'loaded' && context.conf.id)
    || (require === 'user' && priv === 'admin');
};

export const currentPage = (location, pages) => pages.find(
  (item) => location.pathname === `/${item.path}` || item.path === '*',
);

export class MenuItem {
  constructor({
    path, require, title, icon, element, top = false,
  }) {
    this.path = path;
    this.require = require;
    this.title = title;
    this.icon = icon;
    this.element = element;
    this.top = top;
  }
}
