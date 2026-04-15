import * as Sentry from '@sentry/nextjs'

const isProduction = process.env.NODE_ENV === 'production'

Sentry.init({
  dsn: 'https://5ee8419fdcd82c9d0cbe20fe98bf9dca@o4511207424262144.ingest.de.sentry.io/4511207440908368',

  enabled: isProduction,

  tracesSampleRate: isProduction ? 0.2 : 1.0,
  enableLogs: !isProduction,

  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  sendDefaultPii: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart