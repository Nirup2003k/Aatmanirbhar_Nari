import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

const EntrepreneurCTA = () => {
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <section className="bg-brand-secondary py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-surface rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {isCustomer ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Looking for Trusted <span className="text-brand-primary">Local Services?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect directly with skilled women entrepreneurs in your community. Discover catering, boutique tailoring, tutoring, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link to="/businesses" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-base font-semibold px-8 py-4 shadow-lg shadow-brand-primary/20">
                  Explore Businesses
                </Button>
              </Link>
              <Link to="/orders" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-white border-white/20 hover:bg-white/5 text-base px-8 py-4">
                  My Orders
                </Button>
              </Link>
            </div>
          </>
        ) : isEntrepreneur ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Grow Your Business with <span className="text-brand-primary">Aatmanirbhar Nari.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage your service listings, update weekly availability, and respond to incoming customer inquiries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link to="/entrepreneur/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-base font-semibold px-8 py-4 shadow-lg shadow-brand-primary/20">
                  Manage My Business
                </Button>
              </Link>
              <Link to="/learning" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-white border-white/20 hover:bg-white/5 text-base px-8 py-4">
                  Learning & Resources
                </Button>
              </Link>
            </div>
          </>
        ) : isAdmin ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Platform <span className="text-brand-primary">Administration.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Monitor community growth, manage user accounts, and oversee entrepreneur business listings.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link to="/admin/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-base font-semibold px-8 py-4 shadow-lg shadow-brand-primary/20">
                  Admin Dashboard
                </Button>
              </Link>
              <Link to="/businesses" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-white border-white/20 hover:bg-white/5 text-base px-8 py-4">
                  Explore Businesses
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Your Skill Can Become Your <span className="text-brand-primary">Business.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create your digital business profile and make it easier for local customers to discover what you offer. Join our growing community of women entrepreneurs today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link to="/auth/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-base font-semibold px-8 py-4 shadow-lg shadow-brand-primary/20">
                  Create Your Business Profile
                </Button>
              </Link>
              <Link to="/#how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-white border-white/20 hover:bg-white/5 text-base px-8 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EntrepreneurCTA;
