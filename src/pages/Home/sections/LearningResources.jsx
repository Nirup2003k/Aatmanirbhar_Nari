import React from 'react';
import { Link } from 'react-router-dom';
import { learningResources } from '../../../data/mockData';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';
import MarketplaceImage, { learningThumbnails } from '../../../components/common/MarketplaceImage';

const LearningResources = () => {
  return (
    <section className="bg-[#0e1117] py-20 border-b border-[#1b1f2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Entrepreneur Knowledge Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
              Everything You Need to Start
            </h2>
            <p className="text-sm sm:text-base text-stone-400 mt-2 max-w-xl">
              Simple, actionable guidance to help you set up, price, market, and grow your home business.
            </p>
          </div>

          <Link to="/learning" className="hidden md:inline-flex">
            <button className="bg-[#181d29] text-stone-200 border border-[#2b3345] hover:bg-[#222838] hover:border-[#c5a059] font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center cursor-pointer">
              Explore Learning Hub <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
        
        {/* Editorial Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {learningResources.slice(0, 3).map((resource) => {
            const thumbnailSrc = learningThumbnails[resource.id];
            
            return (
              <Link 
                key={resource.id} 
                to={`/learning/${resource.id}`}
                className="group block bg-[#151923] border border-[#252b39] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#c5a059]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Article Photographic Thumbnail Header */}
                <div className="relative h-44 w-full bg-[#0e1118] overflow-hidden">
                  <MarketplaceImage
                    src={thumbnailSrc}
                    alt={resource.title}
                    categoryId="learning"
                    aspectRatio="aspect-full"
                    className="h-44"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151923] via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#121620]/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#c5a059] border border-[#272e3f] shadow-xs">
                    {resource.category}
                  </div>

                  {/* Read Time Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center text-[11px] font-semibold text-stone-200 bg-[#0a0c10]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#232938]">
                    <Clock className="w-3 h-3 mr-1 text-[#c5a059]" />
                    {resource.readTime}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 flex flex-col flex-grow bg-[#151923]">
                  <h3 className="text-lg font-bold text-stone-100 mb-2 group-hover:text-[#d4885c] transition-colors leading-snug">
                    {resource.title}
                  </h3>
                  
                  <p className="text-xs text-stone-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {resource.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[#242a38] flex items-center justify-between text-[#c5a059] text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center md:hidden">
          <Link to="/learning">
            <button className="w-full bg-[#181d29] text-stone-200 border border-[#2b3345] hover:bg-[#222838] hover:border-[#c5a059] font-semibold text-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center cursor-pointer">
              Explore Learning Hub <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearningResources;
