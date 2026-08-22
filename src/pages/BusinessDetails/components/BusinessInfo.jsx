import React from 'react';
import { Tag, MapPin, Clock, Award, Compass, ShieldCheck } from 'lucide-react';

const BusinessInfo = ({ business }) => {
  const isAvailable = Array.isArray(business.availability)
    ? business.availability.some((a) => a.isAvailable)
    : Boolean(business.isAvailable);

  const availabilityText = typeof business.availability === 'string'
    ? business.availability
    : (isAvailable ? 'Available Mon-Sat' : 'By Appointment');

  const infoItems = [
    {
      icon: Tag,
      label: 'Category',
      value: business.category,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: business.location,
    },
    {
      icon: Clock,
      label: 'Availability Status',
      value: availabilityText,
    },
    {
      icon: Tag,
      label: 'Pricing Range',
      value: business.pricingRange,
    },
    {
      icon: Award,
      label: 'Experience Level',
      value: business.experienceLevel || business.entrepreneur?.experienceLevel || 'Established local practitioner',
    },
    {
      icon: Compass,
      label: 'Service Coverage',
      value: business.serviceArea || 'Local community delivery',
    },
  ];

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-lg font-bold text-brand-secondary mb-4 flex items-center">
        <ShieldCheck className="w-5 h-5 text-brand-primary mr-2" />
        Business Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-brand-background border border-brand-border/60 rounded-lg p-3.5 flex items-start space-x-3"
            >
              <div className="p-2 rounded-md bg-brand-surface border border-brand-border text-brand-primary flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-brand-secondary truncate block">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessInfo;
