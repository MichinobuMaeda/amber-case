export const validateReuired = (v) => typeof v === 'string' && v.trim().length;

export const validateEmail = (v) => v === undefined
  || v === null
  || v === false
  || (typeof v === 'string' && !v.length)
  || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);

export const validatePassword = (v) => v === undefined
  || v === null
  || v === false
  || (typeof v === 'string' && !v.length)
  || (
    v.length >= 8
      && (
        (/[0-9]/.test(v) ? 1 : 0)
        + (/[A-Z]/.test(v) ? 1 : 0)
        + (/[a-z]/.test(v) ? 1 : 0)
        + (/[^0-9A-Za-z]/.test(v) ? 1 : 0)
      ) >= 3
  );
