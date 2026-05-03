import type { Hono, MiddlewareHandler } from 'hono';

import { fakeBanners } from './banners';
import { registerHoneypotRoutes } from './routes';
import type { HoneypotOptions } from './types';

export function honeypot(_options: HoneypotOptions = {}): MiddlewareHandler {
  return fakeBanners();
}

export function createHoneypot(app: Hono, options: HoneypotOptions = {}): void {
  app.use('*', honeypot(options));
  registerHoneypotRoutes(app, options);
}

export { registerHoneypotRoutes } from './routes';
export type { FingerprintResult, HitRecord, HoneypotOptions, TrapMode } from './types';
