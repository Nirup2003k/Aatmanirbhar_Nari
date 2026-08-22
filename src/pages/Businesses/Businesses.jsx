import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import BusinessSearch from './components/BusinessSearch';
import BusinessFilters from './components/BusinessFilters';
import BusinessResults from './components/BusinessResults';
import Button from '../../components/common/Button';
import { getBusinesses } from '../../services/api';

const INITIAL_PAGE_SIZE = 6;
const DEFAULT_LOCATIONS = [
  'Vidya Nagar, Hubli',
  'Gokul Road, Hubli',
  'Keshwapur, Hubli',
  'Old Hubli',
  'Unkal, Hubli',
  'Deshpande Nagar, Hubli',
  'Dharwad',
];

const Businesses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('locationFilter') || 'all');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availability') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [displayedCount, setDisplayedCount] = useState(INITIAL_PAGE_SIZE);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // API Data & Async States
  const [apiBusinesses, setApiBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setLocationQuery(searchParams.get('location') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedLocation(searchParams.get('locationFilter') || 'all');
    setSelectedAvailability(searchParams.get('availability') || 'all');
    setSortBy(searchParams.get('sort') || 'recommended');
    setDisplayedCount(INITIAL_PAGE_SIZE);
  }, [searchParams]);

  // Fetch businesses from backend API
  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const urlSearch = searchParams.get('search') || '';
      const urlLocation = searchParams.get('location') || '';
      const urlCategory = searchParams.get('category') || 'all';
      const urlLocFilter = searchParams.get('locationFilter') || 'all';
      const urlAvail = searchParams.get('availability') || 'all';

      // Combine location query input and sidebar location filter if present
      const effectiveLocation = urlLocation || (urlLocFilter !== 'all' ? urlLocFilter : '');

      const response = await getBusinesses({
        search: urlSearch,
        location: effectiveLocation,
        category: urlCategory,
        availability: urlAvail,
      });

      setApiBusinesses(response.data || []);
    } catch (err) {
      console.error('API Error in Businesses page:', err);
      setError(err.message || 'Unable to load businesses right now.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Unique locations list for sidebar filter dropdown
  const availableLocations = useMemo(() => {
    if (apiBusinesses.length > 0) {
      const set = new Set(apiBusinesses.map((b) => b.location));
      return Array.from(set);
    }
    return DEFAULT_LOCATIONS;
  }, [apiBusinesses]);

  // Helper to update URL search parameters
  const updateUrlParams = (newParamsObj) => {
    const params = new URLSearchParams();
    if (newParamsObj.search?.trim()) params.set('search', newParamsObj.search.trim());
    if (newParamsObj.location?.trim()) params.set('location', newParamsObj.location.trim());
    if (newParamsObj.category && newParamsObj.category !== 'all') params.set('category', newParamsObj.category);
    if (newParamsObj.locationFilter && newParamsObj.locationFilter !== 'all') params.set('locationFilter', newParamsObj.locationFilter);
    if (newParamsObj.availability && newParamsObj.availability !== 'all') params.set('availability', newParamsObj.availability);
    if (newParamsObj.sort && newParamsObj.sort !== 'recommended') params.set('sort', newParamsObj.sort);

    setSearchParams(params, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setDisplayedCount(INITIAL_PAGE_SIZE);
    updateUrlParams({
      search: searchQuery,
      location: locationQuery,
      category: selectedCategory,
      locationFilter: selectedLocation,
      availability: selectedAvailability,
      sort: sortBy,
    });
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setDisplayedCount(INITIAL_PAGE_SIZE);
    updateUrlParams({
      search: searchQuery,
      location: locationQuery,
      category: catId,
      locationFilter: selectedLocation,
      availability: selectedAvailability,
      sort: sortBy,
    });
  };

  const handleLocationFilterChange = (loc) => {
    setSelectedLocation(loc);
    setDisplayedCount(INITIAL_PAGE_SIZE);
    updateUrlParams({
      search: searchQuery,
      location: locationQuery,
      category: selectedCategory,
      locationFilter: loc,
      availability: selectedAvailability,
      sort: sortBy,
    });
  };

  const handleAvailabilityChange = (avail) => {
    setSelectedAvailability(avail);
    setDisplayedCount(INITIAL_PAGE_SIZE);
    updateUrlParams({
      search: searchQuery,
      location: locationQuery,
      category: selectedCategory,
      locationFilter: selectedLocation,
      availability: avail,
      sort: sortBy,
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateUrlParams({
      search: searchQuery,
      location: locationQuery,
      category: selectedCategory,
      locationFilter: selectedLocation,
      availability: selectedAvailability,
      sort: newSort,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedAvailability('all');
    setSortBy('recommended');
    setDisplayedCount(INITIAL_PAGE_SIZE);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(searchQuery.trim()) ||
      Boolean(locationQuery.trim()) ||
      selectedCategory !== 'all' ||
      selectedLocation !== 'all' ||
      selectedAvailability !== 'all'
    );
  }, [searchQuery, locationQuery, selectedCategory, selectedLocation, selectedAvailability]);

  // Frontend Sorting over returned API results
  const sortedBusinesses = useMemo(() => {
    let result = [...apiBusinesses];
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return result;
  }, [apiBusinesses, sortBy]);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + INITIAL_PAGE_SIZE);
  };

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-secondary tracking-tight mb-2">
            Explore Local Businesses
          </h1>
          <p className="text-brand-muted text-base max-w-2xl">
            Discover women-led home businesses and services in your community.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="mb-8">
          <BusinessSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            onSearchSubmit={handleSearchSubmit}
          />
        </div>

        {/* Main Content Layout: Filters + Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <BusinessFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedLocation={selectedLocation}
            setSelectedLocation={handleLocationFilterChange}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={handleAvailabilityChange}
            locations={availableLocations}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            isMobileOpen={isMobileFiltersOpen}
            setIsMobileOpen={setIsMobileFiltersOpen}
          />

          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 bg-brand-surface rounded-xl border border-brand-border p-8 text-center shadow-sm w-full">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-brand-secondary mb-1">Finding local businesses...</h3>
              <p className="text-sm text-brand-muted">Fetching verified women-led enterprises in your area.</p>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 bg-brand-surface rounded-xl border border-brand-border p-8 text-center shadow-sm w-full">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary mb-2">Unable to load businesses right now</h3>
              <p className="text-sm text-brand-muted mb-6 max-w-md">{error}</p>
              <Button variant="primary" onClick={fetchBusinesses}>
                Try Again
              </Button>
            </div>
          ) : (
            <BusinessResults
              filteredBusinesses={sortedBusinesses}
              displayedCount={displayedCount}
              onLoadMore={handleLoadMore}
              sortBy={sortBy}
              setSortBy={handleSortChange}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Businesses;
