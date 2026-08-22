import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import Button from '../../../components/common/Button';

const BusinessNotFound = () => {
  return (
    <div className="bg-brand-background min-h-screen py-24 flex items-center justify-center">
      <div className="bg-brand-surface border border-brand-border rounded-xl p-10 text-center max-w-md mx-auto shadow-sm">
        <div className="w-16 h-16 bg-brand-background border border-brand-border rounded-full flex items-center justify-center mx-auto mb-4 text-brand-muted">
          <Store className="w-8 h-8 text-brand-primary/60" />
        </div>
        <h1 className="text-2xl font-bold text-brand-secondary mb-2">
          Business Not Found
        </h1>
        <p className="text-sm text-brand-muted mb-6">
          This business profile could not be found or may have been removed.
        </p>
        <Link to="/businesses">
          <Button variant="primary">
            Explore Businesses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BusinessNotFound;
