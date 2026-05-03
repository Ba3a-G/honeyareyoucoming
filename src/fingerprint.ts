import type { Context } from 'hono';

import type { FingerprintResult } from './types';

const BOT_SIGNATURES = [
  'GPTBot',
  'ClaudeBot',
  'anthropic',
  'openai',
  'Googlebot',
  'bingbot',
  'Bytespider',
  'PetalBot',
  'SemrushBot',
  'AhrefsBot',
  'DotBot',
  'wget',
  'curl',
  'python-requests',
  'axios',
  'Go-http-client',
  'scrapy',
] as const;

const SCORE_PER_MATCH = 20;
const MAX_CONFIDENCE = 100;

export function isSuspicious(c: Context): FingerprintResult {
  const reasons: string[] = [];
  const ua = c.req.header('user-agent') ?? '';
  const accept = c.req.header('accept') ?? '';
  const referer = c.req.header('referer') ?? '';

  const matchedUa = BOT_SIGNATURES.find((signature) =>
    ua.toLowerCase().includes(signature.toLowerCase()),
  );

  if (matchedUa) {
    reasons.push(`bot-ua:${matchedUa}`);
  }

  if (!c.req.header('sec-fetch-site')) {
    reasons.push('missing-header:sec-fetch-site');
  }

  if (!c.req.header('sec-fetch-mode')) {
    reasons.push('missing-header:sec-fetch-mode');
  }

  if (!c.req.header('accept-language')) {
    reasons.push('missing-header:accept-language');
  }

  if (!c.req.header('sec-ch-ua')) {
    reasons.push('missing-header:sec-ch-ua');
  }

  if (c.req.path !== '/' && !referer) {
    reasons.push('missing-header:referer');
  }

  const acceptsJson = accept.toLowerCase().includes('application/json');
  const acceptsHtml = accept.toLowerCase().includes('text/html');
  if (acceptsJson && !acceptsHtml) {
    reasons.push('accept-json-without-html');
  }

  const confidence = Math.min(reasons.length * SCORE_PER_MATCH, MAX_CONFIDENCE);

  return {
    suspicious: confidence > 0,
    confidence,
    reasons,
  };
}
