import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, ChevronRight } from 'lucide-react';

const BusinessHeader = ({ business }) => {
  const categoryName = business.category;

  const isAvailable = Array.isArray(business.availability)
    ? business.availability.some((a) => a.isAvailable)
    : Boolean(business.isAvailable);

  const availabilityText = typeof business.availability === 'string'
    ? business.availability
    : (isAvailable ? 'Available' : 'Busy');

  return (
    <div className="mb-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          to="/businesses"
          className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Businesses
        </Link>

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-muted">
          <Link to="/" className="hover:text-brand-text transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/businesses" className="hover:text-brand-text transition-colors">
            Explore Businesses
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-secondary font-semibold truncate max-w-[150px] sm:max-w-xs">
            {business.businessName}
          </span>
        </nav>
      </div>

      {/* Main Profile Header Box */}
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-sm">
        {/* Large Image Placeholder Container */}
        <div className="h-64 sm:h-80 bg-brand-background relative w-full flex flex-col items-center justify-center border-b border-brand-border/60 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-3 shadow-sm text-brand-primary">
            <Store className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-sm font-semibold text-brand-secondary tracking-widest uppercase text-opacity-70 mb-1">
            Business Showcase Image
          </h3>
          <span className="text-xs text-brand-muted">
            High-resolution visual preview placeholder
          </span>

          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                isAvailable
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-brand-surface text-brand-text border border-brand-border'
              }`}
            >
              {availabilityText}
            </span>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="p-6 sm:p-8">
          <div className="mb-3">
            <span className="inline-block text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2.5 py-1 rounded-md">
              {categoryName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-secondary mb-3">
            {business.businessName}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-brand-muted gap-y-2 gap-x-4 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-brand-primary flex-shrink-0" />
              <span>{business.location}</span>
            </div>
            {business.serviceArea && (
              <div className="flex items-center text-brand-text/80">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted mr-2"></span>
                <span>{business.serviceArea}</span>
              </div>
            )}
          </div>

          <p className="text-base text-brand-text leading-relaxed">
            {business.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
