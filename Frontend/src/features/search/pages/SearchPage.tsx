import "../../../styles/search-global.css";
import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import MobileFilterDrawer from '../components/MobileFilterDrawer/MobileFilterDrawer';
import SearchResults from '../components/SearchResults/SearchResults';
import MapView from '../components/MapView/MapView';
import BottomMapToggle from '../components/BottomMapToggle/BottomMapToggle';
import ActiveFilters from '../components/ActiveFilters/ActiveFilters';
import Footer from '../components/Footer/Footer';
import { useSearch } from '../hooks/useSearch';
import { useFilters } from '../hooks/useFilters';
import { School } from '../types';
import { sortOptions } from '../data/mockSchools';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const { filteredSchools, isLoading, filters, updateFilter, resetFilters } = useSearch();
  const {
    isFilterDrawerOpen,
    toggleArrayFilter,
    toggleTopRated,
    setSearchQuery,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  } = useFilters();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [sortBy, setSortBy] = useState('rating');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateFilter('searchQuery', query);
  };

  const handleRemoveFilter = (key: keyof typeof filters, value?: string) => {
    if (key === 'topRated') {
      toggleTopRated();
    } else if (value && ['region', 'institutionType', 'curriculum', 'degreeLevel', 'feeRange'].includes(key)) {
      toggleArrayFilter(key as any, value);
    }
  };

  const handleClearAll = () => {
    resetFilters();
    setSearchQuery('');
  };

  const handleViewDetails = (school: School) => {
    console.log('View details for:', school.name);
    // TODO: Navigate to school details page
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // TODO: Implement sorting logic
  };

  return (
    <div className={styles.page}>
      <Navbar />

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
              onReset={resetFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </aside>

          {/* Main Content Area */}
          <div className={styles.contentArea}>
            {/* Results Header */}
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                <h1 className={styles.resultsTitle}>
                  {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
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

            {/* Results and Map */}
            {viewMode === 'list' ? (
              <SearchResults
                schools={filteredSchools}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <MapView
                schools={filteredSchools}
                onSchoolClick={handleViewDetails}
              />
            )}

            {/* Desktop Map */}
            {viewMode === 'list' && (
              <div className={styles.desktopMap}>
                <h2 className={styles.mapTitle}>Map View</h2>
                <MapView
                  schools={filteredSchools}
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
              schools={filteredSchools}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <MapView
              schools={filteredSchools}
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
          onReset={resetFilters}
          resultCount={filteredSchools.length}
        />

        {/* Mobile Bottom Toggle */}
        <BottomMapToggle
          viewMode={viewMode}
          onToggle={setViewMode}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;