import type { Context } from 'hono';
import { describe, expect, it } from 'vitest';

import { isSuspicious } from '../fingerprint';

type HeaderMap = Record<string, string | undefined>;

function createMockContext(path: string, headers: HeaderMap): Context {
  const normalized = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      normalized.set(key, value);
    }
  }

  return {
    req: {
      path,
      header(name: string) {
        return normalized.get(name);
      },
    },
  } as unknown as Context;
}

function baseHeaders(): HeaderMap {
  return {
    'user-agent': 'Mozilla/5.0',
    accept: 'text/html,application/xhtml+xml',
    'accept-language': 'en-US,en;q=0.9',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    'sec-ch-ua': '"Chromium";v="124"',
    referer: 'https://example.com/',
  };
}

describe('isSuspicious', () => {
  it('scores a bot user-agent match', () => {
    const result = isSuspicious(
      createMockContext('/', {
        ...baseHeaders(),
        'user-agent': 'GPTBot/1.0',
      }),
    );

    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['bot-ua:GPTBot']);
  });

  it('scores missing sec-fetch-site', () => {
    const headers = baseHeaders();
    delete headers['sec-fetch-site'];

    const result = isSuspicious(createMockContext('/', headers));
    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['missing-header:sec-fetch-site']);
  });

  it('scores missing sec-fetch-mode', () => {
    const headers = baseHeaders();
    delete headers['sec-fetch-mode'];

    const result = isSuspicious(createMockContext('/', headers));
    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['missing-header:sec-fetch-mode']);
  });

  it('scores missing accept-language', () => {
    const headers = baseHeaders();
    delete headers['accept-language'];

    const result = isSuspicious(createMockContext('/', headers));
    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['missing-header:accept-language']);
  });

  it('scores missing sec-ch-ua', () => {
    const headers = baseHeaders();
    delete headers['sec-ch-ua'];

    const result = isSuspicious(createMockContext('/', headers));
    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['missing-header:sec-ch-ua']);
  });

  it('scores missing referer on non-root paths', () => {
    const headers = baseHeaders();
    delete headers.referer;

    const result = isSuspicious(createMockContext('/admin/Default.aspx', headers));
    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['missing-header:referer']);
  });

  it('scores json-only accept headers', () => {
    const result = isSuspicious(
      createMockContext('/', {
        ...baseHeaders(),
        accept: 'application/json',
      }),
    );

    expect(result.confidence).toBe(20);
    expect(result.reasons).toEqual(['accept-json-without-html']);
  });

  it('caps confidence at 100', () => {
    const result = isSuspicious(
      createMockContext('/deep/path', {
        'user-agent': 'curl/8.0',
        accept: 'application/json',
      }),
    );

    expect(result.confidence).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(5);
  });
});
