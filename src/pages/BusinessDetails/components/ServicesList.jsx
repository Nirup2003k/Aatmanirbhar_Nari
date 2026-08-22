import React from 'react';
import { ShoppingBag } from 'lucide-react';
import ServiceCard from './ServiceCard';

const ServicesList = ({ services, businessId, businessName, onInquireService }) => {
  if (!services || services.length === 0) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-brand-secondary mb-2">Services Offered</h2>
        <p className="text-sm text-brand-muted">Custom services available upon inquiry.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
        <h2 className="text-xl font-bold text-brand-secondary flex items-center">
          <ShoppingBag className="w-5 h-5 text-brand-primary mr-2" />
          Services Offered
        </h2>
        <span className="text-xs text-brand-muted font-medium">
          {services.length} {services.length === 1 ? 'service' : 'services'} available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            businessId={businessId}
            businessName={businessName}
            onInquire={onInquireService}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
