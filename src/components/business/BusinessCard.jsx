import React from 'react';
import { MapPin, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const BusinessCard = ({ business }) => {
  const isAvailable = Array.isArray(business.availability)
    ? business.availability.some((a) => a.isAvailable)
    : Boolean(business.isAvailable);

  const availabilityText = Array.isArray(business.availability)
    ? (isAvailable ? 'Available' : 'By appointment')
    : (business.availability || 'Available today');

  return (
    <div className="group bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Cleaner Image Placeholder */}
      <div className="h-48 bg-brand-background/80 relative w-full flex flex-col items-center justify-center border-b border-brand-border/50 group-hover:bg-brand-background transition-colors">
        <div className="w-12 h-12 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-2 shadow-sm text-brand-muted/70 group-hover:text-brand-primary/50 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-brand-muted/60 text-xs font-medium uppercase tracking-widest">Business Preview</span>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-brand-surface text-brand-text border border-brand-border'}`}>
            {isAvailable ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-medium text-brand-primary uppercase tracking-wider">
            {business.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-brand-secondary mb-2 line-clamp-1">
          {business.businessName}
        </h3>
        
        <div className="flex items-center text-sm text-brand-muted mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{business.location}</span>
        </div>
        
        <p className="text-sm text-brand-text mb-4 line-clamp-2 flex-grow">
          {business.description}
        </p>
        
        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-brand-muted">
            <Tag className="w-4 h-4 mr-2 text-brand-primary/70 flex-shrink-0" />
            <span className="truncate">{business.pricingRange}</span>
          </div>
          <div className="flex items-center text-sm text-brand-muted">
            <Clock className="w-4 h-4 mr-2 text-brand-primary/70 flex-shrink-0" />
            <span className="truncate">{availabilityText}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-brand-border">
          <Link to={`/businesses/${business.id}`} className="w-full block">
            <Button variant="outline" className="w-full justify-center">
              View Business
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
