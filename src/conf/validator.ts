export const validateReuired = (v?: string | null) => typeof v === 'string' && v.trim().length;

export const validateEmail = (v?: string | null) => v === undefined
  || v === null
  || (typeof v === 'string' && !v.length)
  || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);

export const validatePassword = (v?: string | null) => v === undefined
  || v === null
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
