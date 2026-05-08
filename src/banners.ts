import type { Env, MiddlewareHandler } from 'hono';

function fakeTransInfo(): string {
  return crypto.randomUUID().replace(/-/g, '').toUpperCase();
}

export function fakeBanners<E extends Env = any, P extends string = any>(): MiddlewareHandler<E, P> {
  return async (c, next) => {
    await next();

    c.res.headers.set('Server', 'Microsoft-IIS/10.0');
    c.res.headers.set('X-Powered-By', 'ASP.NET');
    c.res.headers.set('X-AspNet-Version', '4.0.30319');
    c.res.headers.set('X-AspNetMvc-Version', '5.2');
    c.res.headers.set('X-Powered-CMS', 'Umbraco/8.18.4');
    c.res.headers.set('X-MS-Trans-Info', fakeTransInfo());
  };
}
