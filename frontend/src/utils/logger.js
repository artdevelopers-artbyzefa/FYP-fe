export const logger = (...args) => {
  const isDev = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') || 
                (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV);
  if (isDev) {
    const c = window.console;
    if (c && c.log) {
      c.log(...args);
    }
  }
};
