import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterOption } from '../../types';
import styles from './FilterSelect.module.css';

interface FilterSelectProps {
  title: string;
  value: string;
  options: FilterOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

/** Single-select dropdown for filter options (Region, Program, Speciality). */
const FilterSelect: React.FC<FilterSelectProps> = ({
  title,
  value,
  options,
  placeholder = 'Any',
  onChange,
}) => (
  <div className={styles.filterSection}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.selectWrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={title}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className={styles.icon} />
    </div>
  </div>
);

export default FilterSelect;
