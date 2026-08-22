import React from 'react';
import { SearchX } from 'lucide-react';
import Button from '../../../components/common/Button';

const EmptyBusinessState = ({ onClearFilters }) => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 bg-brand-background border border-brand-border rounded-full flex items-center justify-center mx-auto mb-4 text-brand-muted">
        <SearchX className="w-8 h-8 text-brand-primary/70" />
      </div>
      <h3 className="text-xl font-bold text-brand-secondary mb-2">
        No businesses found
      </h3>
      <p className="text-sm text-brand-muted mb-6 leading-relaxed">
        Try changing your search keywords or relaxing your category, location, or availability filters.
      </p>
      <Button variant="primary" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default EmptyBusinessState;
