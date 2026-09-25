import React from 'react';
import Hero from './sections/Hero';
import Categories from './sections/Categories';
import FeaturedBusinesses from './sections/FeaturedBusinesses';
import ValueStrip from './sections/ValueStrip';
import HowItWorks from './sections/HowItWorks';
import EntrepreneurCTA from './sections/EntrepreneurCTA';
import LearningResources from './sections/LearningResources';
import FinalCTA from './sections/FinalCTA';
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
      <ValueStrip />
      <HowItWorks />
      <EntrepreneurCTA />
      {showLearning && <LearningResources />}
      <FinalCTA />
    </div>
  );
};

export default Home;
