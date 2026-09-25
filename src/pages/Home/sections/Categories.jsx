import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../../../components/business/CategoryCard';
import { categories } from '../../../data/mockData';
import Button from '../../../components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const Categories = () => {
  return (
    <section className="bg-[#0d1015] py-20 border-b border-[#1b202c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Dark Cinematic Styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore By Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              Women-Led Local Businesses
            </h2>
            <p className="text-sm sm:text-base text-stone-400 mt-2 max-w-xl">
              Discover verified home kitchens, boutique tailors, beauty artisans, and tutors in your neighborhood.
            </p>
          </div>
          
          <Link to="/businesses" className="hidden md:inline-flex">
            <Button variant="outline" className="font-semibold text-sm bg-[#141822] text-stone-200 border-[#282e3d] hover:bg-[#1c2230]">
              View All Categories <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Responsive Grid with Visual Variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        
        <div className="text-center md:hidden">
          <Link to="/businesses">
            <Button variant="outline" className="w-full font-semibold bg-[#141822] text-stone-200 border-[#282e3d] hover:bg-[#1c2230]">
              View All Categories <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
