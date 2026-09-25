import React from 'react';
import { Search, MapPin } from 'lucide-react';
import Button from '../../../components/common/Button';
import SmoothInput from '../../../components/common/SmoothInput';

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
      className="bg-[#131722] p-4 rounded-2xl border border-[#242b3a] shadow-xl flex flex-col md:flex-row gap-3 items-center"
      aria-label="Search businesses"
    >
      <div className="flex-grow flex items-center w-full md:w-auto bg-[#181d2a] px-4 py-3 rounded-xl border border-[#283042] focus-within:border-[#c5a059] focus-within:bg-[#1a202f] transition-all">
        <Search className="w-5 h-5 text-[#c5a059] mr-3 flex-shrink-0" />
        <label htmlFor="business-search-input" className="sr-only">
          What service are you looking for?
        </label>
        <SmoothInput
          id="business-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What service are you looking for?"
          className="bg-transparent border-none focus:outline-none text-stone-100 w-full text-sm font-medium placeholder:text-stone-400"
        />
      </div>

      <div className="flex-grow flex items-center w-full md:w-auto bg-[#181d2a] px-4 py-3 rounded-xl border border-[#283042] focus-within:border-[#c5a059] focus-within:bg-[#1a202f] transition-all">
        <MapPin className="w-5 h-5 text-[#c5a059] mr-3 flex-shrink-0" />
        <label htmlFor="location-search-input" className="sr-only">
          Enter city or area
        </label>
        <SmoothInput
          id="location-search-input"
          type="text"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="Enter city or area"
          className="bg-transparent border-none focus:outline-none text-stone-100 w-full text-sm font-medium placeholder:text-stone-400"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-auto px-8 py-3 whitespace-nowrap h-auto font-bold text-sm shadow-md"
      >
        Search
      </Button>
    </form>
  );
};

export default BusinessSearch;
