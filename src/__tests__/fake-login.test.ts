import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

import { fakeLoginResponse } from '../fake-login';

describe('fakeLoginResponse', () => {
  it('returns viewstate on GET', async () => {
    const app = new Hono();
    app.get('/admin/Default.aspx', (c) => fakeLoginResponse(c, 'GET'));

    const response = await app.request('/admin/Default.aspx');
    const text = await response.text();

    expect(text).toContain('__VIEWSTATE');
    expect(response.headers.get('set-cookie')).toContain('ASP.NET_SessionId=');
  });

  it('returns the failure text span on POST', async () => {
    const app = new Hono();
    app.post('/admin/Default.aspx', (c) => fakeLoginResponse(c, 'POST'));

    const response = await app.request('/admin/Default.aspx', {
      method: 'POST',
    });
    const text = await response.text();

    expect(text).toContain('ctl00_MainContent_LoginUser_FailureText');
    expect(text).toContain('Your login attempt was not successful. Please try again.');
    expect(response.headers.get('set-cookie')).toContain('ASP.NET_SessionId=');
  });
});
