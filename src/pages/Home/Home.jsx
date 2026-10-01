import React from 'react';
import Hero from './sections/Hero';
import Categories from './sections/Categories';
import FeaturedBusinesses from './sections/FeaturedBusinesses';
import HowItWorks from './sections/HowItWorks';
import EntrepreneurCTA from './sections/EntrepreneurCTA';
import LearningResources from './sections/LearningResources';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const showLearning = !isCustomer && !isAdmin;

  return (
    <div className="flex flex-col min-h-screen bg-[#080a0d] overflow-x-hidden">
      <Hero />
      <Categories />
      <FeaturedBusinesses />
      <HowItWorks />
      <EntrepreneurCTA />
      {showLearning && <LearningResources />}
    </div>
  );
};

export default Home;
