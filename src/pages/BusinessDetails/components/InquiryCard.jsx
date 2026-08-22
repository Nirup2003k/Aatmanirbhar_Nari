import React from 'react';
import { MessageSquare } from 'lucide-react';
import InquiryForm from './InquiryForm';

const InquiryCard = ({ businessId, services, selectedServiceId, businessName }) => {
  return (
    <div id="inquiry-section" className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-8">
      <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-brand-border">
        <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-secondary">
            Send an Inquiry
          </h2>
          <p className="text-xs text-brand-muted">
            Directly message {businessName}
          </p>
        </div>
      </div>

      <InquiryForm
        businessId={businessId}
        services={services}
        selectedServiceId={selectedServiceId}
        businessName={businessName}
      />
    </div>
  );
};

export default InquiryCard;
