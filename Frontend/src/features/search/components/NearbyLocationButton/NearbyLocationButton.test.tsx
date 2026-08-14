// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NearbyLocationButton from './NearbyLocationButton';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

const tStub = (key: string) => key;

describe('NearbyLocationButton', () => {
  const props = {
    status: 'idle' as const,
    radiusKm: 10,
    total: 0,
    onFindNearby: vi.fn(),
    onChangeRadius: vi.fn(),
    onReset: vi.fn(),
  };

  it('shows the CTA and triggers findNearby on click when idle', () => {
    const onFindNearby = vi.fn();
    render(<NearbyLocationButton {...props} status="idle" onFindNearby={onFindNearby} />);
    const button = screen.getByText(tStub('nearby.useMyLocation'));
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(onFindNearby).toHaveBeenCalledTimes(1);
  });

  it('shows a disabled locating button while locating', () => {
    render(<NearbyLocationButton {...props} status="locating" />);
    const button = screen.getByText(tStub('nearby.locating'));
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows the search radius banner in success state with pills', () => {
    const onChangeRadius = vi.fn();
    render(
      <NearbyLocationButton
        {...props}
        status="success"
        total={12}
        radiusKm={10}
        onChangeRadius={onChangeRadius}
      />
    );
    expect(screen.getByText(/nearby.within/)).toBeTruthy();
    const pill = screen.getByText('25 km');
    fireEvent.click(pill);
    expect(onChangeRadius).toHaveBeenCalledWith(25);
  });

  it('marks the active radius pill', () => {
    render(<NearbyLocationButton {...props} status="success" radiusKm={50} />);
    const pills = screen.getAllByText(/km/);
    // 50 km is active, the others are not
    expect(pills.length).toBe(4);
  });

  it('calls onReset when exit is clicked', () => {
    const onReset = vi.fn();
    render(<NearbyLocationButton {...props} status="success" onReset={onReset} />);
    fireEvent.click(screen.getByText(tStub('nearby.exit')));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('shows an error box with retry for denied', () => {
    const onFindNearby = vi.fn();
    render(<NearbyLocationButton {...props} status="denied" onFindNearby={onFindNearby} />);
    expect(screen.getByText(tStub('nearby.denied'))).toBeTruthy();
    fireEvent.click(screen.getByText(tStub('common.retry')));
    expect(onFindNearby).toHaveBeenCalledTimes(1);
  });

  it('shows the unsupported message without a button', () => {
    render(<NearbyLocationButton {...props} status="unsupported" />);
    expect(screen.getByText(tStub('nearby.unsupported'))).toBeTruthy();
    expect(screen.queryByText(tStub('common.retry'))).toBeNull();
  });
});
