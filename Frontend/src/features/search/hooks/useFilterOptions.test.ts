// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFilterOptions } from './useFilterOptions';

const { apiMock } = vi.hoisted(() => ({
  apiMock: { getFilterOptions: vi.fn() },
}));

vi.mock('../../../lib/api', () => ({
  api: apiMock,
  default: apiMock,
}));

import { api } from '../../../lib/api';

const mockedGetFilterOptions = vi.mocked(api.getFilterOptions);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useFilterOptions', () => {
  it('starts with the static fallback options while loading', () => {
    mockedGetFilterOptions.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFilterOptions());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.regions.length).toBeGreaterThan(0);
    expect(result.current.programs.length).toBeGreaterThan(0);
    expect(result.current.specialities.length).toBeGreaterThan(0);
  });

  it('uses the database options when the filters endpoint succeeds', async () => {
    mockedGetFilterOptions.mockResolvedValue({
      data: {
        regions: ['Centre', 'Littoral'],
        programs: ['Bachelor of Science in Computer Science', 'GCE Advanced Level'],
        specialities: ['Computer Science', 'Nursing'],
      },
    } as any);

    const { result } = renderHook(() => useFilterOptions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions).toEqual([
      { value: 'Centre', label: 'Centre' },
      { value: 'Littoral', label: 'Littoral' },
    ]);
    expect(result.current.programs[0]).toEqual({
      value: 'Bachelor of Science in Computer Science',
      label: 'Bachelor of Science in Computer Science',
    });
    expect(result.current.specialities.map((o) => o.value)).toEqual(['Computer Science', 'Nursing']);
  });

  it('keeps the static fallback when the endpoint returns an error', async () => {
    mockedGetFilterOptions.mockResolvedValue({ error: 'HTTP 500', status: 500 } as any);

    const { result } = renderHook(() => useFilterOptions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.specialities.map((o) => o.value)).toContain('Computer Science');
    expect(result.current.regions.map((o) => o.value)).toContain('Centre');
  });

  it('keeps the static fallback when the request throws', async () => {
    mockedGetFilterOptions.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useFilterOptions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.programs.length).toBeGreaterThan(0);
  });

  it('ignores an empty payload from the endpoint', async () => {
    mockedGetFilterOptions.mockResolvedValue({ data: {} } as any);

    const { result } = renderHook(() => useFilterOptions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.regions.map((o) => o.value)).toContain('Centre');
    expect(result.current.specialities.map((o) => o.value)).toContain('Computer Science');
  });
});
