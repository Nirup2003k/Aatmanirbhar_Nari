import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import Button from '../../../components/common/Button';
import { categories } from '../../../data/mockData';

const availabilityOptions = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Available Today' },
  { id: 'week', label: 'Available This Week' },
  { id: 'appointment', label: 'By Appointment' },
];

const BusinessFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedAvailability,
  setSelectedAvailability,
  locations,
  onClearFilters,
  hasActiveFilters,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div className="flex items-center space-x-2 text-brand-secondary font-bold text-lg">
          <Filter className="w-5 h-5 text-brand-primary" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center text-xs font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-3">
          Category
        </h4>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                : 'text-brand-text hover:bg-brand-background'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === String(cat.id)
                  ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                  : 'text-brand-text hover:bg-brand-background'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label
          htmlFor="location-filter-select"
          className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-3"
        >
          Location
        </label>
        <select
          id="location-filter-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-3">
          Availability
        </h4>
        <div className="space-y-2">
          {availabilityOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedAvailability(opt.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedAvailability === opt.id
                  ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                  : 'text-brand-text hover:bg-brand-background'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-center space-x-2 bg-brand-surface"
        >
          <Filter className="w-4 h-4 text-brand-primary" />
          <span>{isMobileOpen ? 'Hide Filters' : 'Filter Businesses'}</span>
        </Button>
      </div>

      {/* Mobile Filter Drawer / Collapsible Box */}
      {isMobileOpen && (
        <div className="lg:hidden mb-6 p-5 bg-brand-surface rounded-xl border border-brand-border shadow-sm">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="text-brand-muted hover:text-brand-text p-1"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
        </div>
      )}

      {/* Desktop Sidebar Panel */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-brand-surface p-5 rounded-xl border border-brand-border shadow-sm h-fit">
        {content}
      </aside>
    </>
  );
};

export default BusinessFilters;
