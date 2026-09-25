import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BusinessCard from '../../../components/business/BusinessCard';
import Button from '../../../components/common/Button';
import { getBusinesses } from '../../../services/api';
import { ArrowRight, Store } from 'lucide-react';

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
    <section className="bg-[#11141b] py-20 border-b border-[#1b202c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Featured Micro-Enterprises</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              Discover Women-Led Businesses
            </h2>
            <p className="text-sm sm:text-base text-stone-400 mt-2 max-w-xl">
              Support local entrepreneurs and find great products and services in your community.
            </p>
          </div>

          <Link to="/businesses" className="hidden md:inline-flex">
            <Button variant="primary" className="font-semibold text-sm">
              Explore All Businesses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#161a24] rounded-2xl p-4 border border-[#252b38] animate-pulse h-96 flex flex-col justify-between">
                <div className="bg-[#222836] h-44 rounded-xl w-full" />
                <div className="space-y-3 py-4">
                  <div className="bg-[#222836] h-4 rounded-md w-2/3" />
                  <div className="bg-[#222836] h-3 rounded-md w-1/2" />
                  <div className="bg-[#222836] h-3 rounded-md w-full" />
                </div>
                <div className="bg-[#222836] h-10 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
        
        <div className="text-center md:hidden">
          <Link to="/businesses">
            <Button variant="primary" className="w-full font-semibold">
              Explore All Businesses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
