export const validateReuired = (v) => v === 0 || !!v;

export const validateEmail = (v) => typeof v === 'string'
  && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);

export const validatePassword = (v) => typeof v === 'string'
  && v.length >= 8
  && (
    (/[0-9]/.test(v) ? 1 : 0)
    + (/[A-Z]/.test(v) ? 1 : 0)
    + (/[a-z]/.test(v) ? 1 : 0)
    + (/[^0-9A-Za-z]/.test(v) ? 1 : 0)
  ) >= 3;
