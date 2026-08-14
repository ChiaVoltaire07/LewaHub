import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2, X } from 'lucide-react';
import { NearbyStatus } from '../../types';
import { RADIUS_OPTIONS_KM } from '../../hooks/useNearbySchools';
import styles from './NearbyLocationButton.module.css';

interface NearbyLocationButtonProps {
  status: NearbyStatus;
  radiusKm: number;
  total: number;
  onFindNearby: () => void;
  onChangeRadius: (radius: number) => void;
  onReset: () => void;
}

const isBusy = (status: NearbyStatus) => status === 'locating' || status === 'loading';

const NearbyLocationButton: React.FC<NearbyLocationButtonProps> = ({
  status,
  radiusKm,
  total,
  onFindNearby,
  onChangeRadius,
  onReset,
}) => {
  const { t } = useTranslation();

  if (status === 'success') {
    return (
      <div className={styles.banner} role="status">
        <div className={styles.bannerHeader}>
          <span className={styles.bannerTitle}>
            {t('nearby.within', { count: total, radius: radiusKm })}
          </span>
          <button
            type="button"
            className={styles.exitButton}
            onClick={onReset}
            aria-label={t('nearby.exit')}
          >
            <X size={16} />
            <span className={styles.exitLabel}>{t('nearby.exit')}</span>
          </button>
        </div>
        <div className={styles.radiusRow}>
          <span className={styles.radiusLabel}>{t('nearby.radiusLabel')}</span>
          {RADIUS_OPTIONS_KM.map((r) => (
            <button
              key={r}
              type="button"
              className={r === radiusKm ? styles.radiusPillActive : styles.radiusPill}
              onClick={() => onChangeRadius(r)}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isBusy(status)) {
    return (
      <button type="button" className={styles.primaryButton} disabled aria-busy="true">
        <Loader2 size={18} className={styles.spinner} />
        {status === 'locating' ? t('nearby.locating') : t('nearby.searching')}
      </button>
    );
  }

  if (status === 'denied' || status === 'unavailable' || status === 'timeout' || status === 'error') {
    const messages: Record<string, string> = {
      denied: t('nearby.denied'),
      unavailable: t('nearby.unavailable'),
      timeout: t('nearby.timeout'),
      error: t('nearby.error'),
    };
    return (
      <div className={styles.errorBox} role="alert">
        <p className={styles.errorText}>{messages[status]}</p>
        <button type="button" className={styles.retryButton} onClick={onFindNearby}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (status === 'unsupported') {
    return (
      <p className={styles.errorText} role="alert">
        {t('nearby.unsupported')}
      </p>
    );
  }

  return (
    <button type="button" className={styles.primaryButton} onClick={onFindNearby}>
      <MapPin size={18} />
      {t('nearby.useMyLocation')}
    </button>
  );
};

export default NearbyLocationButton;
