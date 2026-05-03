export type TrapMode = 'tarpit' | 'tokenBurn' | 'maze' | 'fake200' | 'silent404';

export interface HitRecord {
  ip: string;
  path: string;
  ua: string;
  reasons: string[];
  confidence: number;
  timestamp: string;
}

export interface HoneypotOptions {
  server?: 'iis';
  cms?: 'umbraco';
  onHit?: (record: HitRecord) => void | Promise<void>;
}

export interface FingerprintResult {
  suspicious: boolean;
  confidence: number;
  reasons: string[];
}
