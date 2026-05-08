import { Hono } from 'hono';

import { createHoneypot, honeypot, registerHoneypotRoutes } from '../index';

type AppEnv = {
  Bindings: {
    EXAMPLE: string;
  };
};

const app = new Hono<AppEnv>();

app.use(honeypot());
app.use('*', honeypot());
app.use('/admin/*', honeypot());

createHoneypot(app);
registerHoneypotRoutes(app);
