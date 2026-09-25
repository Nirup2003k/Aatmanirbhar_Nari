import React from 'react';
import { ChefHat, Scissors, Sparkles, Palette, UtensilsCrossed, GraduationCap, Store, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketplaceImage from '../common/MarketplaceImage';

const iconMap = {
  ChefHat,
  Scissors,
  Sparkles,
  Palette,
  UtensilsCrossed,
  GraduationCap,
  Store,
};

const categoryImages = {
  1: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
  2: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
  3: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80",
  4: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
  5: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
  6: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
  7: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Store;
  const imageSrc = categoryImages[category.id];

  return (
    <Link 
      to={`/businesses?category=${category.id}`}
      className="group relative flex flex-col bg-[#151922] border border-[#252a37] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-[#c5a059]/50 transition-all duration-300 hover:-translate-y-1 h-full"
    >
      {/* Category Image Header */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
        <MarketplaceImage 
          src={imageSrc} 
          alt={category.name}
          categoryId={category.id} 
          aspectRatio="aspect-full" 
          className="h-40"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1015] via-slate-950/20 to-transparent" />
        
        {/* Category Icon Pill */}
        <div className="absolute top-3 left-3 bg-[#131722]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#293040] shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
          <IconComponent className="w-5 h-5 text-amber-400 group-hover:text-white transition-colors" />
        </div>

        {/* Hover Arrow Icon */}
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-xs p-2 rounded-full text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Category Title Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-grow bg-[#151922]">
        <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 mb-3">
          {category.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#232835] text-xs font-semibold text-[#c5a059] group-hover:text-amber-300 transition-colors">
          <span>Explore Businesses</span>
          <span className="text-[11px] font-medium text-stone-400">→</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
