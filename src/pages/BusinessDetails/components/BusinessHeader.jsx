import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, ChevronRight, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';

const BusinessHeader = ({ business }) => {
  const { user } = useAuth();
  const categoryName = business.category;

  const isAvailable = Array.isArray(business.availability)
    ? business.availability.some((a) => a.isAvailable)
    : Boolean(business.isAvailable);

  const availabilityText = typeof business.availability === 'string'
    ? business.availability
    : (isAvailable ? 'Available' : 'Busy');

  const isVerified = business.verificationStatus === 'APPROVED';
  const isOwner = user?.role === 'ENTREPRENEUR' && user?.id === business.ownerId;

  return (
    <div className="mb-8">
      {isOwner && (
        <div className="mb-6 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary text-white rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-brand-secondary text-sm block">Your Registered Business Profile</span>
              <span className="text-xs text-brand-muted">You are previewing your business page as it appears to customers.</span>
            </div>
          </div>
          <Link to="/entrepreneur/dashboard?tab=details" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto">
              Manage My Business
            </Button>
          </Link>
        </div>
      )}

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

          <div className="absolute top-4 right-4 flex items-center gap-2">
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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-block text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2.5 py-1 rounded-md">
              {categoryName}
            </span>
            {isVerified && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Platform Verified
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-secondary mb-3">
            {business.businessName}
          </h1>

          {/* Short Explanation of Platform Verification */}
          {isVerified && (
            <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Platform Verified Enterprise</strong>
                <span>
                  This business has been reviewed and verified by the Aatmanirbhar Nari platform for entrepreneur identity, location authenticity, and service quality standards.
                </span>
              </div>
            </div>
          )}

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
