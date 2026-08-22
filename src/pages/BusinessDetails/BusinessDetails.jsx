import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import BusinessHeader from './components/BusinessHeader';
import BusinessInfo from './components/BusinessInfo';
import ServicesList from './components/ServicesList';
import Availability from './components/Availability';
import EntrepreneurInfo from './components/EntrepreneurInfo';
import ServiceArea from './components/ServiceArea';
import InquiryCard from './components/InquiryCard';
import BusinessNotFound from './components/BusinessNotFound';
import Button from '../../components/common/Button';
import { getBusinessById } from '../../services/api';

const BusinessDetails = () => {
  const { id } = useParams();
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinessDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getBusinessById(id);
      setBusiness(response.data || null);
    } catch (err) {
      console.error(`API Error fetching business ${id}:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBusinessDetails();
  }, [fetchBusinessDetails]);

  const handleInquireService = (service) => {
    setSelectedServiceId(service.id);
    const inquiryElem = document.getElementById('inquiry-section');
    if (inquiryElem) {
      inquiryElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-brand-secondary mb-1">Loading business details...</h3>
          <p className="text-sm text-brand-muted">Fetching verified profiles and services from database.</p>
        </div>
      </div>
    );
  }

  // 404 Not Found State
  if (error && error.status === 404) {
    return <BusinessNotFound />;
  }

  // Network / Server Error State
  if (error || !business) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-lg w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-secondary mb-2">
            Unable to load this business right now
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            {error?.message || 'A network error occurred while connecting to the server.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={fetchBusinessDetails}>
              Try Again
            </Button>
            <Link to="/businesses">
              <Button variant="outline" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Businesses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const entrepreneurData = {
    name: business.ownerName,
    experienceLevel: business.experienceLevel,
    bio: business.description,
  };

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section (Breadcrumbs, Image Placeholder, Title & Intro) */}
        <BusinessHeader business={business} />

        {/* 2-Column Responsive Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Business Content (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <BusinessInfo business={business} />

            <ServicesList
              services={business.services}
              businessId={business.id}
              businessName={business.businessName}
              onInquireService={handleInquireService}
            />


            <Availability weeklyHours={business.availability} />

            <EntrepreneurInfo entrepreneur={entrepreneurData} />

            <ServiceArea
              serviceArea={business.serviceArea}
              location={business.location}
            />
          </div>

          {/* Right Column: Sticky Inquiry Form Card (1 col on desktop) */}
          <div className="lg:col-span-1">
            <InquiryCard
              businessId={business.id}
              services={business.services}
              selectedServiceId={selectedServiceId}
              businessName={business.businessName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
