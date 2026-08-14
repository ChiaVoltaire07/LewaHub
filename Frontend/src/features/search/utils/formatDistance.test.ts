import { describe, it, expect } from 'vitest';
import { formatDistance } from './formatDistance';

describe('formatDistance', () => {
  it('formats sub-kilometer distances as rounded meters', () => {
    expect(formatDistance(0.35)).toEqual({ meters: 350, km: null });
    expect(formatDistance(0.8)).toEqual({ meters: 800, km: null });
    expect(formatDistance(0.045)).toEqual({ meters: 45, km: null });
  });

  it('formats 1 km and above as kilometers with one decimal', () => {
    expect(formatDistance(1.2)).toEqual({ meters: null, km: 1.2 });
    expect(formatDistance(5.73)).toEqual({ meters: null, km: 5.7 });
    expect(formatDistance(18.7)).toEqual({ meters: null, km: 18.7 });
  });

  it('handles exact boundaries', () => {
    expect(formatDistance(1)).toEqual({ meters: null, km: 1 });
    expect(formatDistance(0.999)).toEqual({ meters: 999, km: null });
  });

  it('returns null parts for missing or invalid input', () => {
    expect(formatDistance(null)).toEqual({ meters: null, km: null });
    expect(formatDistance(undefined)).toEqual({ meters: null, km: null });
    expect(formatDistance(NaN)).toEqual({ meters: null, km: null });
    expect(formatDistance(-5)).toEqual({ meters: null, km: null });
    expect(formatDistance(Infinity)).toEqual({ meters: null, km: null });
  });
});
