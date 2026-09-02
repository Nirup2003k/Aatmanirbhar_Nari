import React from 'react';
import Hero from './sections/Hero';
import ValueStrip from './sections/ValueStrip';
import Categories from './sections/Categories';
import FeaturedBusinesses from './sections/FeaturedBusinesses';
import HowItWorks from './sections/HowItWorks';
import LearningResources from './sections/LearningResources';
import EntrepreneurCTA from './sections/EntrepreneurCTA';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const showLearning = !isCustomer && !isAdmin;

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ValueStrip />
      <Categories />
      <FeaturedBusinesses />
      <HowItWorks />
      {showLearning && <LearningResources />}
      <EntrepreneurCTA />
    </div>
  );
};

export default Home;
