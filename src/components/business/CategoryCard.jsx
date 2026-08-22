import React from 'react';
import { ChefHat, Scissors, Sparkles, Palette, Store, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  ChefHat: ChefHat,
  Scissors: Scissors,
  Sparkles: Sparkles,
  Palette: Palette,
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Store;

  return (
    <Link 
      to={`/businesses?category=${category.id}`}
      className="group flex flex-col bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/30 h-full"
    >
      <div className="bg-brand-background w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300">
        <IconComponent className="text-brand-primary w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors flex items-center justify-between">
        {category.name}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </h3>
      <p className="text-sm text-brand-text/80 line-clamp-2 mt-auto">
        {category.description}
      </p>
    </Link>
  );
};

export default CategoryCard;
