import { init } from '@sentry/node';

init({
  dsn: process.env.sentryLink,
  enabled: !!process.env.sentryLink,
});
