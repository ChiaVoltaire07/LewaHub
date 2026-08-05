import "../../../styles/search-global.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import MobileFilterDrawer from '../components/MobileFilterDrawer/MobileFilterDrawer';
import SearchResults from '../components/SearchResults/SearchResults';
import MapView from '../components/MapView/MapView';
import BottomMapToggle from '../components/BottomMapToggle/BottomMapToggle';
import ActiveFilters from '../components/ActiveFilters/ActiveFilters';
import { useFilters } from '../hooks/useFilters';
import { searchSchools } from '../services/searchApi';
import { School } from '../types';
import { sortOptions } from '../data/mockSchools';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  // Single source of truth for all filter state
  const {
    filters,
    isFilterDrawerOpen,
    toggleArrayFilter,
    toggleTopRated,
    toggleOffersHighSchool,
    setSearchQuery,
    setProgramFilter,
    resetFilters,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  } = useFilters();

  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [sortBy, setSortBy] = useState('rating');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch whenever any filter changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    searchSchools(filters)
      .then((results) => {
        if (!cancelled) setSchools(results);
      })
      .catch((err) => {
        if (!cancelled) setError('Failed to fetch schools. Please try again.');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [filters]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveFilter = (key: keyof typeof filters, value?: string) => {
    if (key === 'topRated') {
      toggleTopRated();
    } else if (key === 'offersHighSchool') {
      toggleOffersHighSchool();
    } else if (value && ['region', 'category', 'curriculum', 'degreeLevel', 'feeRange'].includes(key)) {
      toggleArrayFilter(key as any, value);
    }
  };

  const handleClearAll = () => {
    resetFilters();
  };

  const handleViewDetails = (school: School) => {
    navigate(`/school/${school.id}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // TODO: Implement sorting logic
  };

  return (
    <div className={styles.page}>
      <div className={styles.mainContent}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchContainer}>
            <SearchBar
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />
            <button className={styles.filterButton} onClick={openFilterDrawer}>
              <SlidersHorizontal size={20} />
              <span>Filters</span>
              {hasActiveFilters && <span className={styles.filterBadge}></span>}
            </button>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Desktop Layout */}
        <div className={styles.desktopLayout}>
          {/* Desktop Sidebar */}
          <aside className={styles.sidebar}>
            <FilterSidebar
              filters={filters}
              onToggleArrayFilter={toggleArrayFilter}
              onToggleTopRated={toggleTopRated}
              onToggleOffersHighSchool={toggleOffersHighSchool}
              onReset={resetFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={schools.length}
              onProgramChange={setProgramFilter}
            />
          </aside>

          {/* Main Content Area */}
          <div className={styles.contentArea}>
            {/* Results Header */}
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                <h1 className={styles.resultsTitle}>
                  {schools.length} {schools.length === 1 ? 'School' : 'Schools'} Found
                </h1>
                <div className={styles.sortContainer}>
                  <label className={styles.sortLabel}>Sort by:</label>
                  <div className={styles.sortSelect}>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className={styles.sortDropdown}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={styles.sortIcon} />
                  </div>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className={styles.errorContainer} style={{
                backgroundColor: "rgba(193, 87, 43, 0.1)",
                border: "1px solid rgba(193, 87, 43, 0.3)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                color: "#C1572B"
              }}>
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}

            {viewMode === 'list' ? (
              <SearchResults
                schools={schools}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <MapView
                schools={schools}
                onSchoolClick={handleViewDetails}
              />
            )}

            {/* Desktop Map (shown below results in list mode) */}
            {viewMode === 'list' && (
              <div className={styles.desktopMap}>
                <h2 className={styles.mapTitle}>Map View</h2>
                <MapView
                  schools={schools}
                  onSchoolClick={handleViewDetails}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={styles.mobileLayout}>
          {viewMode === 'list' ? (
            <SearchResults
              schools={schools}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <MapView
              schools={schools}
              onSchoolClick={handleViewDetails}
            />
          )}
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={closeFilterDrawer}
          filters={filters}
          onToggleArrayFilter={toggleArrayFilter}
          onToggleTopRated={toggleTopRated}
          onToggleOffersHighSchool={toggleOffersHighSchool}
          onReset={resetFilters}
          resultCount={schools.length}
        />

        {/* Mobile Bottom Toggle */}
        <BottomMapToggle
          viewMode={viewMode}
          onToggle={setViewMode}
        />
      </div>
    </div>
  );
};

export default SearchPage;
