import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../../components/common/SectionHeading';
import BusinessCard from '../../../components/business/BusinessCard';
import Button from '../../../components/common/Button';
import { getBusinesses } from '../../../services/api';

const FeaturedBusinesses = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBusinesses()
      .then((res) => {
        if (res.data) {
          setFeaturedBusinesses(res.data.slice(0, 4));
        }
      })
      .catch((err) => {
        console.error('Failed to load featured businesses:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="bg-brand-surface py-20 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Discover Women-Led Businesses" 
          subtitle="Support local entrepreneurs and find great products and services in your community."
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
        
        <div className="text-center">
          <Link to="/businesses">
            <Button variant="outline">
              Explore All Businesses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
