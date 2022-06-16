export const COOKIE_NAME = 'cookie_login_validin';
export const COOKIE_OPTIONS = {
  cookieName: COOKIE_NAME,
  password: process.env.COOKIE_PASS as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
