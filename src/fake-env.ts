import type { Context } from 'hono';

// These are fake/example credentials only. AWS publishes the example key pair,
// and the Stripe-style key is included as a public-looking decoy string.
const FAKE_ENV_BODY = `APP_ENV=production
APP_KEY=base64:kX9mN2vQ8pL3wR7tY4uI0oE5sA1dF6gH
APP_DEBUG=false
APP_URL=https://app.internal.corp

DB_CONNECTION=sqlsrv
DB_HOST=10.0.1.22
DB_PORT=1433
DB_DATABASE=AppProductionDB
DB_USERNAME=sa
DB_PASSWORD=Str0ng!Pass#2019

MAIL_DRIVER=smtp
MAIL_HOST=smtp.internal.corp
MAIL_PORT=587
MAIL_USERNAME=noreply@internal.corp
MAIL_PASSWORD=M@ilP4ss!99
MAIL_ENCRYPTION=tls

STRIPE_SECRET=sk_live_4eC39HqLyjWDarjtT1zdp7dc
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=us-east-1`;

export function fakeEnvResponse(_c: Context): Response {
  return new Response(FAKE_ENV_BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
