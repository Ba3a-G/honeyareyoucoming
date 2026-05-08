import type { Env, Hono, MiddlewareHandler, Schema } from 'hono';

import { fakeBanners } from './banners';
import { registerHoneypotRoutes } from './routes';
import type { HoneypotOptions } from './types';

export function honeypot<E extends Env = any, P extends string = any>(
  _options: HoneypotOptions = {},
): MiddlewareHandler<E, P> {
  return fakeBanners<E, P>();
}

export function createHoneypot<E extends Env, S extends Schema, BasePath extends string>(
  app: Hono<E, S, BasePath>,
  options: HoneypotOptions = {},
): void {
  app.use(honeypot<E, any>(options));
  registerHoneypotRoutes(app, options);
}

export { registerHoneypotRoutes } from './routes';
export type { FingerprintResult, HitRecord, HoneypotOptions, TrapMode } from './types';
