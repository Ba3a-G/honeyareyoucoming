# honeyareyoucoming

`honeyareyoucoming` is a stateless Hono middleware package for defensive deception: it decorates every response with convincing IIS/ASP.NET/Umbraco banners and exposes a set of lure routes that waste attacker and scraper time without relying on Redis, in-memory tracking, timers outside request scope, or background workers.

## Install

```bash
npm install honeyareyoucoming
```

## Quick start

```ts
import { Hono } from 'hono';
import { createHoneypot } from 'honeyareyoucoming';

const app = new Hono();

createHoneypot(app, {
  onHit: (record) => {
    console.warn(record);
  },
});

export default app;
```

You can also install only the banner middleware manually:

```ts
import { Hono } from 'hono';
import { honeypot, registerHoneypotRoutes } from 'honeyareyoucoming';

const app = new Hono();

app.use('*', honeypot());
registerHoneypotRoutes(app, {
  onHit: (record) => console.warn(record),
});
```

## Routes

| Path | Method | Strategy |
| --- | --- | --- |
| `/.env` | `GET` | Fake plaintext environment file |
| `/.env.backup` | `GET` | `tarpit` for 30 seconds |
| `/.env.production` | `GET` | Fake plaintext environment file |
| `/.env.local` | `GET` | Fake plaintext environment file |
| `/web.config` | `GET` | Fake IIS `web.config` XML |
| `/elmah.axd` | `GET` | `fake200` JSON response |
| `/trace.axd` | `GET` | `fake200` JSON response |
| `/App_Data/` | `GET` | Empty `403` |
| `/admin/Default.aspx` | `GET` | Fake ASP.NET WebForms login |
| `/admin/Default.aspx` | `POST` | Fake ASP.NET WebForms login with failure message |
| `/Telerik.Web.UI.WebResource.axd` | `GET` | `tarpit` for 15 seconds |
| `/api/v1/admin-tools` | `GET` | `tokenBurn` paginated fake records |
| `/api/v1/internal/*` | `ALL` | `maze` redirect to another lure route |
| `/robots.txt` | `GET` | Reverse-psychology disallow list |
| `*.aspx` | `ALL` | Fake IIS yellow error page |

## Reverse proxy note

The package sets `Server: Microsoft-IIS/10.0` and related ASP.NET headers on every response, but reverse proxies like Nginx or Caddy can still overwrite or strip `Server` before traffic reaches the client. If you need the deception to survive the edge, disable proxy banner rewriting and ensure your proxy forwards upstream `Server` headers unchanged.

## Fake credential note

All credentials and secrets returned by the package are fake. They use publicly documented example formats and values, including AWS’s published example key pair and a Stripe-style decoy key, and are not real secrets.
