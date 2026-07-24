import React from 'react';
import { Map, List } from 'lucide-react';
import styles from './BottomMapToggle.module.css';

interface BottomMapToggleProps {
  viewMode: 'list' | 'map';
  onToggle: (mode: 'list' | 'map') => void;
}

const BottomMapToggle: React.FC<BottomMapToggleProps> = ({ viewMode, onToggle }) => {
  return (
    <div className={styles.toggleContainer}>
      <button
        className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
        onClick={() => onToggle('list')}
      >
        <List size={20} />
        <span>List</span>
      </button>
      <button
        className={`${styles.toggleButton} ${viewMode === 'map' ? styles.active : ''}`}
        onClick={() => onToggle('map')}
      >
        <Map size={20} />
        <span>Map</span>
      </button>
    </div>
  );
};

export default BottomMapToggle;