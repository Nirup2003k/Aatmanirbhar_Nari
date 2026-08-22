import React from 'react';
import Hero from './sections/Hero';
import ValueStrip from './sections/ValueStrip';
import Categories from './sections/Categories';
import FeaturedBusinesses from './sections/FeaturedBusinesses';
import HowItWorks from './sections/HowItWorks';
import LearningResources from './sections/LearningResources';
import EntrepreneurCTA from './sections/EntrepreneurCTA';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ValueStrip />
      <Categories />
      <FeaturedBusinesses />
      <HowItWorks />
      <LearningResources />
      <EntrepreneurCTA />
    </div>
  );
};

export default Home;
