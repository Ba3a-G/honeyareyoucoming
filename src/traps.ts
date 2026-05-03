import type { Context } from 'hono';
import { stream } from 'hono/streaming';

import { HONEYPOT_PATHS } from './routes';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function tarpit(c: Context, durationMs = 30_000): Response {
  c.header('Content-Type', 'text/plain; charset=UTF-8');

  return stream(c, async (output) => {
    const ticks = Math.max(1, Math.ceil(durationMs / 1000));

    for (let index = 0; index < ticks; index += 1) {
      await sleep(1000);
      await output.write('.');
    }
  });
}

export function tokenBurn(c: Context): Response {
  const rawPage = Number.parseInt(c.req.query('page') ?? '0', 10);
  const page = Number.isFinite(rawPage) && rawPage >= 0 ? rawPage : 0;
  const roles = ['admin', 'editor', 'viewer'] as const;

  const data = Array.from({ length: 100 }, (_, offset) => {
    const id = page * 100 + offset + 1;

    return {
      id,
      email: `user${id}@internal.corp`,
      role: roles[offset % roles.length],
      token: crypto.randomUUID(),
      createdAt: new Date(Date.now() - id * 60_000).toISOString(),
    };
  });

  return c.json({
    data,
    page,
    total: 999999,
    next: `?page=${page + 1}`,
    _note: 'confidential - internal use only',
  });
}

export function maze(c: Context): Response {
  const index = crypto.getRandomValues(new Uint32Array(1))[0] % HONEYPOT_PATHS.length;
  return c.redirect(HONEYPOT_PATHS[index], 302);
}

export function fake200(c: Context): Response {
  return c.json({
    status: 'ok',
    version: '2.1.4',
    env: 'production',
    db: {
      host: '10.0.1.22',
      name: 'AppProductionDB',
    },
    secrets: {
      apiKey: `sk-${crypto.randomUUID()}`,
    },
    _you_have_been_logged: true,
  });
}

export function silent404(c: Context): Response {
  return c.text('', 404);
}
