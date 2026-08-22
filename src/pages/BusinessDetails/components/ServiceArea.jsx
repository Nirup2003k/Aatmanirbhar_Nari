import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const ServiceArea = ({ serviceArea, location }) => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-brand-secondary mb-4 flex items-center">
        <MapPin className="w-5 h-5 text-brand-primary mr-2" />
        Service Area & Coverage
      </h2>

      <p className="text-sm text-brand-text mb-5 leading-relaxed">
        {serviceArea || `Serving local customers in and around ${location}.`}
      </p>

      {/* Clean Visual Map Placeholder Block */}
      <div className="bg-brand-background border border-brand-border rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[160px]">
        <div className="w-12 h-12 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary mb-2 shadow-sm">
          <Navigation className="w-6 h-6 opacity-70" />
        </div>
        <span className="text-sm font-semibold text-brand-secondary mb-1">
          Local Service Coverage Zone
        </span>
        <span className="text-xs text-brand-muted max-w-sm">
          Primary location: <strong className="text-brand-text font-medium">{location}</strong>. Interactive map capabilities will be integrated in future releases.
        </span>
      </div>
    </div>
  );
};

export default ServiceArea;
