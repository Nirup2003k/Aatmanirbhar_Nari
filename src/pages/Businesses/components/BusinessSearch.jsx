import React from 'react';
import { Search, MapPin } from 'lucide-react';
import Button from '../../../components/common/Button';

const BusinessSearch = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearchSubmit,
}) => {
  return (
    <form
      onSubmit={onSearchSubmit}
      className="bg-brand-surface p-4 rounded-xl border border-brand-border shadow-sm flex flex-col md:flex-row gap-3 items-center"
      aria-label="Search businesses"
    >
      <div className="flex-grow flex items-center w-full md:w-auto bg-brand-background px-4 py-3 rounded-lg border border-brand-border/60 focus-within:border-brand-primary transition-colors">
        <Search className="w-5 h-5 text-brand-muted mr-3 flex-shrink-0" />
        <label htmlFor="business-search-input" className="sr-only">
          What service are you looking for?
        </label>
        <input
          id="business-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What service are you looking for?"
          className="bg-transparent border-none focus:outline-none text-brand-text w-full text-sm placeholder:text-brand-muted"
        />
      </div>

      <div className="flex-grow flex items-center w-full md:w-auto bg-brand-background px-4 py-3 rounded-lg border border-brand-border/60 focus-within:border-brand-primary transition-colors">
        <MapPin className="w-5 h-5 text-brand-muted mr-3 flex-shrink-0" />
        <label htmlFor="location-search-input" className="sr-only">
          Enter city or area
        </label>
        <input
          id="location-search-input"
          type="text"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="Enter city or area"
          className="bg-transparent border-none focus:outline-none text-brand-text w-full text-sm placeholder:text-brand-muted"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-auto px-8 py-3 whitespace-nowrap h-auto"
      >
        Search
      </Button>
    </form>
  );
};

export default BusinessSearch;
