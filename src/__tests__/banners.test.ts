import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

import { fakeBanners } from '../banners';

describe('fakeBanners', () => {
  it('overrides server banners after the route handler runs', async () => {
    const app = new Hono();

    app.use('*', fakeBanners());
    app.get('/', (c) => {
      c.header('Server', 'custom-server');
      c.header('X-Powered-By', 'custom-runtime');
      return c.text('ok');
    });

    const response = await app.request('/');

    expect(response.headers.get('server')).toBe('Microsoft-IIS/10.0');
    expect(response.headers.get('x-powered-by')).toBe('ASP.NET');
  });
});
