import "../../../styles/search-global.css";
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import MobileFilterDrawer from '../components/MobileFilterDrawer/MobileFilterDrawer';
import SearchResults from '../components/SearchResults/SearchResults';
import MapView from '../components/MapView/MapView';
import BottomMapToggle from '../components/BottomMapToggle/BottomMapToggle';
import ActiveFilters from '../components/ActiveFilters/ActiveFilters';
import NearbyLocationButton from '../components/NearbyLocationButton/NearbyLocationButton';
import { useFilters } from '../hooks/useFilters';
import { useNearbySchools } from '../hooks/useNearbySchools';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { searchSchools } from '../services/searchApi';
import { School } from '../types';
import { sortOptions } from '../data/mockSchools';
import Skeleton from '../../../components/skeletons/Skeleton';
import styles from './SearchPage.module.css';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();

  // Single source of truth for all filter state
  const {
    filters,
    isFilterDrawerOpen,
    updateFilter,
    toggleArrayFilter,
    toggleVerified,
    toggleOffersHighSchool,
    setSearchQuery,
    setProgramFilter,
    setSpecialityFilter,
    resetFilters,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  } = useFilters();

  const nearby = useNearbySchools();

  // Distinct region/program/speciality options from GET /schools/filters
  // (with a static fallback so the dropdowns are never empty).
  const filterOptions = useFilterOptions();

  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [sortBy, setSortBy] = useState('name');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Entering a search query exits the "schools near me" mode
  useEffect(() => {
    if (filters.searchQuery) {
      nearby.reset();
    }
  }, [filters.searchQuery]);

  // Re-fetch whenever any filter changes, debounced 300ms with a stale-request guard.
  // `cancelled` flags in-flight requests from previous runs so they can never
  // overwrite results from a newer request.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    const handler = setTimeout(() => {
      searchSchools(filters)
        .then((results) => {
          if (!cancelled) setSchools(results);
        })
        .catch((err) => {
          if (!cancelled) {
            setError('Failed to fetch schools. Please try again.');
            console.error(err);
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [filters]);

  // Real client-side name sorting. The backend has no rating column, so only
  // name-based sort options are offered.
  const sortedSchools = useMemo(() => {
    const arr = [...schools];
    if (sortBy === 'name-desc') {
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    }
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [schools, sortBy]);

  // While the nearby feature has a location (success/loading), the nearby
  // results (already nearest-first from the backend) replace the search results.
  const isNearbyActive = nearby.userLocation !== null &&
    (nearby.status === 'success' || nearby.status === 'loading');
  const displaySchools = isNearbyActive ? nearby.schools : sortedSchools;
  const displayLoading = isLoading && !isNearbyActive;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRemoveFilter = (key: keyof typeof filters, value?: string) => {
    if (key === 'verified') {
      toggleVerified();
    } else if (key === 'offersHighSchool') {
      toggleOffersHighSchool();
    } else if (key === 'programs') {
      setProgramFilter('');
    } else if (key === 'specialities') {
      setSpecialityFilter('');
    } else if (value && ['region', 'category', 'language', 'ownership', 'boarding'].includes(key)) {
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

          {/* Schools near me */}
          <div className={styles.nearbyRow}>
            <NearbyLocationButton
              status={nearby.status}
              radiusKm={nearby.radiusKm}
              total={nearby.total}
              onFindNearby={nearby.findNearby}
              onChangeRadius={nearby.changeRadius}
              onReset={nearby.reset}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className={styles.desktopLayout}>
          {/* Desktop Sidebar */}
          <aside className={styles.sidebar}>
            <FilterSidebar
              filters={filters}
              onToggleArrayFilter={toggleArrayFilter}
              onToggleVerified={toggleVerified}
              onToggleOffersHighSchool={toggleOffersHighSchool}
              onReset={resetFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={displaySchools.length}
              onProgramChange={setProgramFilter}
              onRegionChange={(value) => updateFilter('region', value ? [value] : [])}
              onSpecialityChange={setSpecialityFilter}
              regionOptions={filterOptions.regions}
              programOptions={filterOptions.programs}
              specialityOptions={filterOptions.specialities}
            />
          </aside>

          {/* Main Content Area */}
          <div className={styles.contentArea}>
            {/* Results Header */}
            <div className={styles.resultsHeader}>
              <div className={styles.resultsInfo}>
                <h1 className={styles.resultsTitle}>
                  {displayLoading ? (
                    <Skeleton className="inline-block h-6 w-40 rounded-md align-middle" />
                  ) : (
                    `${displaySchools.length} ${displaySchools.length === 1 ? 'School' : 'Schools'} Found`
                  )}
                </h1>
                {isNearbyActive ? (
                  <div className={styles.nearestLabel}>
                    {t('nearby.nearestFirst')}
                  </div>
                ) : (
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
                )}
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
                schools={displaySchools}
                isLoading={displayLoading}
                onViewDetails={handleViewDetails}
                emptyHint={isNearbyActive ? t('nearby.noSchoolsWithin', { radius: nearby.radiusKm }) : undefined}
              />
            ) : (
              <MapView
                schools={displaySchools}
                onSchoolClick={handleViewDetails}
                userLocation={nearby.userLocation}
                radiusKm={isNearbyActive ? nearby.radiusKm : undefined}
              />
            )}

            {/* Desktop Map (shown below results in list mode) */}
            {viewMode === 'list' && (
              <div className={styles.desktopMap}>
                <h2 className={styles.mapTitle}>Map View</h2>
                <MapView
                  schools={displaySchools}
                  onSchoolClick={handleViewDetails}
                  userLocation={nearby.userLocation}
                  radiusKm={isNearbyActive ? nearby.radiusKm : undefined}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={styles.mobileLayout}>
          {viewMode === 'list' ? (
            <SearchResults
              schools={displaySchools}
              isLoading={displayLoading}
              onViewDetails={handleViewDetails}
              emptyHint={isNearbyActive ? t('nearby.noSchoolsWithin', { radius: nearby.radiusKm }) : undefined}
            />
          ) : (
            <MapView
              schools={displaySchools}
              onSchoolClick={handleViewDetails}
              userLocation={nearby.userLocation}
              radiusKm={isNearbyActive ? nearby.radiusKm : undefined}
            />
          )}
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={closeFilterDrawer}
          filters={filters}
          onToggleArrayFilter={toggleArrayFilter}
          onToggleVerified={toggleVerified}
          onToggleOffersHighSchool={toggleOffersHighSchool}
          resultCount={displaySchools.length}
          onProgramChange={setProgramFilter}
          onRegionChange={(value) => updateFilter('region', value ? [value] : [])}
          onSpecialityChange={setSpecialityFilter}
          regionOptions={filterOptions.regions}
          programOptions={filterOptions.programs}
          specialityOptions={filterOptions.specialities}
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
