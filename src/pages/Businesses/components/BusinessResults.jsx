import React from 'react';
import BusinessCard from '../../../components/business/BusinessCard';
import EmptyBusinessState from './EmptyBusinessState';
import Button from '../../../components/common/Button';

const BusinessResults = ({
  filteredBusinesses,
  displayedCount,
  onLoadMore,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  if (filteredBusinesses.length === 0) {
    return <EmptyBusinessState onClearFilters={onClearFilters} />;
  }

  const displayedBusinesses = filteredBusinesses.slice(0, displayedCount);
  const hasMore = displayedCount < filteredBusinesses.length;

  return (
    <div className="flex-grow">
      {/* Results Header: Count & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border/60">
        <div>
          <h2 className="text-lg font-bold text-brand-secondary">
            {filteredBusinesses.length}{' '}
            {filteredBusinesses.length === 1 ? 'business found' : 'businesses found'}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {displayedBusinesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4 pb-8">
          <Button variant="outline" size="lg" onClick={onLoadMore}>
            Load More Businesses
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessResults;
