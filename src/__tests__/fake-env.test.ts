import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

import { fakeEnvResponse } from '../fake-env';

describe('fakeEnvResponse', () => {
  it('includes fake database and aws credentials', async () => {
    const app = new Hono();
    app.get('/', (c) => fakeEnvResponse(c));

    const response = await app.request('/');
    const text = await response.text();

    expect(text).toContain('DB_PASSWORD=Str0ng!Pass#2019');
    expect(text).toContain('AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE');
  });
});
