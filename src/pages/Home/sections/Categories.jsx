import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../../components/common/SectionHeading';
import CategoryCard from '../../../components/business/CategoryCard';
import { categories } from '../../../data/mockData';
import Button from '../../../components/common/Button';

const Categories = () => {
  return (
    <section className="bg-slate-50 py-20 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Explore Local Businesses" 
          subtitle="Discover skilled women entrepreneurs offering products and services near you."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/businesses">
            <Button variant="outline">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
