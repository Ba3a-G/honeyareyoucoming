import type { Context, Env, Hono, Schema } from 'hono';

import { fakeIisError } from './errors';
import { fakeConfigResponse } from './fake-config';
import { fakeEnvResponse } from './fake-env';
import { fakeLoginResponse } from './fake-login';
import { isSuspicious } from './fingerprint';
import { fake200, maze, tarpit, tokenBurn } from './traps';
import type { HitRecord, HoneypotOptions } from './types';

export const HONEYPOT_PATHS: string[] = [
  '/.env',
  '/.env.backup',
  '/.env.production',
  '/.env.local',
  '/web.config',
  '/elmah.axd',
  '/trace.axd',
  '/App_Data/',
  '/admin/Default.aspx',
  '/Telerik.Web.UI.WebResource.axd',
  '/api/v1/admin-tools',
  '/robots.txt',
];

const ROBOTS_PATHS = [...HONEYPOT_PATHS, '/api/v1/internal/', '/*.aspx'];

function getClientIp(c: Context): string {
  const xForwardedFor = c.req.header('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return c.req.header('cf-connecting-ip') ?? c.req.header('x-real-ip') ?? 'unknown';
}

function buildHitRecord(c: Context): HitRecord {
  const fingerprint = isSuspicious(c);

  return {
    ip: getClientIp(c),
    path: c.req.path,
    ua: c.req.header('user-agent') ?? '',
    reasons: fingerprint.reasons,
    confidence: fingerprint.confidence,
    timestamp: new Date().toISOString(),
  };
}

async function recordHit(c: Context, options: HoneypotOptions): Promise<void> {
  if (!options.onHit) {
    return;
  }

  try {
    await options.onHit(buildHitRecord(c));
  } catch {
    // Avoid breaking deceptive responses when hit reporting fails.
  }
}

function wrapHandler(
  options: HoneypotOptions,
  handler: (c: Context) => Response | Promise<Response>,
): (c: Context) => Promise<Response> {
  return async (c) => {
    await recordHit(c, options);
    return handler(c);
  };
}

export function registerHoneypotRoutes<E extends Env, S extends Schema, BasePath extends string>(
  app: Hono<E, S, BasePath>,
  options: HoneypotOptions = {},
): void {
  app.get('/.env', wrapHandler(options, fakeEnvResponse));
  app.get('/.env.backup', wrapHandler(options, (c) => tarpit(c, 30_000)));
  app.get('/.env.production', wrapHandler(options, fakeEnvResponse));
  app.get('/.env.local', wrapHandler(options, fakeEnvResponse));
  app.get('/web.config', wrapHandler(options, fakeConfigResponse));
  app.get('/elmah.axd', wrapHandler(options, fake200));
  app.get('/trace.axd', wrapHandler(options, fake200));
  app.get('/App_Data/', wrapHandler(options, (c) => c.text('', 403)));
  app.get('/admin/Default.aspx', wrapHandler(options, (c) => fakeLoginResponse(c, 'GET')));
  app.post('/admin/Default.aspx', wrapHandler(options, (c) => fakeLoginResponse(c, 'POST')));
  app.get('/Telerik.Web.UI.WebResource.axd', wrapHandler(options, (c) => tarpit(c, 15_000)));
  app.get('/api/v1/admin-tools', wrapHandler(options, tokenBurn));
  app.all('/api/v1/internal/*', wrapHandler(options, maze));
  app.get(
    '/robots.txt',
    wrapHandler(options, (c) =>
      c.text(`User-agent: *\n${ROBOTS_PATHS.map((path) => `Disallow: ${path}`).join('\n')}`),
    ),
  );

  app.use('*', async (c, next) => {
    if (c.req.path.endsWith('.aspx')) {
      await recordHit(c, options);
      return fakeIisError(c, c.req.path);
    }

    await next();
  });
}
