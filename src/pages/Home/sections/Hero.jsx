import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Store } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `/businesses?${queryString}` : '/businesses');
  };

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <section className="relative bg-brand-background overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-36 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            {isCustomer ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-secondary tracking-tight mb-6 leading-tight">
                  Discover & Support Local <span className="text-brand-primary">Entrepreneurs.</span>
                </h1>
                <p className="text-lg sm:text-xl text-brand-text mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Find quality services, homemade goods, and skilled women professionals right in your neighborhood.
                </p>
              </>
            ) : isEntrepreneur ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-secondary tracking-tight mb-6 leading-tight">
                  Empowering Your <span className="text-brand-primary">Business Journey.</span>
                </h1>
                <p className="text-lg sm:text-xl text-brand-text mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Manage your digital business profile, showcase services, and connect with customers in your local community.
                </p>
              </>
            ) : isAdmin ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-secondary tracking-tight mb-6 leading-tight">
                  Aatmanirbhar Nari <span className="text-brand-primary">Admin Portal.</span>
                </h1>
                <p className="text-lg sm:text-xl text-brand-text mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Oversee community business listings, monitor platform activity, and empower local women entrepreneurs.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-secondary tracking-tight mb-6 leading-tight">
                  Turn Your Skills Into a <span className="text-brand-primary">Business.</span>
                </h1>
                <p className="text-lg sm:text-xl text-brand-text mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Aatmanirbhar Nari helps women build a digital presence, showcase their services, and connect with customers in their local community.
                </p>
              </>
            )}
            
            {/* Discovery Search Component */}
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-brand-surface p-4 rounded-xl border border-brand-border shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="flex-grow flex items-center w-full md:w-auto bg-brand-background px-4 py-3 rounded-lg border border-brand-border/50 focus-within:border-brand-primary/50 transition-colors">
                <Search className="w-5 h-5 text-brand-muted mr-3 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for?" 
                  className="bg-transparent border-none focus:outline-none text-brand-text w-full text-sm placeholder:text-brand-muted"
                  aria-label="What service are you looking for?"
                />
              </div>
              <div className="flex-grow flex items-center w-full md:w-auto bg-brand-background px-4 py-3 rounded-lg border border-brand-border/50 focus-within:border-brand-primary/50 transition-colors">
                <MapPin className="w-5 h-5 text-brand-muted mr-3 flex-shrink-0" />
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Enter your location" 
                  className="bg-transparent border-none focus:outline-none text-brand-text w-full text-sm placeholder:text-brand-muted"
                  aria-label="Enter your location"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full md:w-auto px-8 py-3 h-auto whitespace-nowrap">
                Find Services
              </Button>
            </form>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-5">
              {isCustomer ? (
                <Link to="/businesses" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Explore All Businesses
                  </Button>
                </Link>
              ) : isEntrepreneur ? (
                <Link to="/entrepreneur/dashboard" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Go to My Business
                  </Button>
                </Link>
              ) : isAdmin ? (
                <Link to="/admin/dashboard" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Open Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/register" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full bg-white">
                    Start Your Business
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Visual Content - Improved Placeholder */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative pt-[100%] sm:pt-[80%] lg:pt-[90%] rounded-2xl overflow-hidden bg-brand-surface border border-brand-border shadow-sm">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-background/50 p-8 text-center">
                <div className="w-20 h-20 mb-5 rounded-full bg-brand-surface shadow-sm border border-brand-border flex items-center justify-center text-brand-primary">
                  <Store className="w-8 h-8 opacity-80" />
                </div>
                <h3 className="text-lg font-medium text-brand-secondary tracking-wide uppercase text-opacity-80">
                  Business Showcase
                </h3>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 bg-brand-secondary/5 rounded-full blur-2xl"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
