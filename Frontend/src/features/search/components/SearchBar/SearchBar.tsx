import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.searchBar}>
      <Search className={styles.searchIcon} size={20} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder || t("search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;