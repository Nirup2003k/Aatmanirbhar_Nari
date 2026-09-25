import React from 'react';
import { MapPin, Clock, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import MarketplaceImage from '../common/MarketplaceImage';

const BusinessCard = ({ business }) => {
  const isAvailable = Array.isArray(business.availability)
    ? business.availability.some((a) => a.isAvailable)
    : Boolean(business.isAvailable);

  const availabilityText = Array.isArray(business.availability)
    ? (isAvailable ? 'Available' : 'By appointment')
    : (business.availability || 'Available today');

  const isVerified = business.verificationStatus === 'APPROVED';
  const categoryId = business.categoryId || 7;

  return (
    <div className="group bg-[#161a23] border border-[#262c3a] hover:border-[#c5a059]/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      
      {/* Prominent Business Photo Preview */}
      <div className="relative h-48 w-full bg-[#0f1219] overflow-hidden">
        <MarketplaceImage
          src={business.imageUrl}
          alt={business.businessName || business.name}
          categoryId={categoryId}
          aspectRatio="aspect-full"
          className="h-48"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#161a23] via-transparent to-transparent" />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-xs ${
              isAvailable 
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30' 
                : 'bg-stone-900/90 text-stone-300 border border-stone-700/50'
            }`}
          >
            {isAvailable ? 'Available Today' : 'By Appointment'}
          </span>
        </div>

        {/* Verified Badge Overlay */}
        {isVerified && (
          <div className="absolute bottom-3 left-3">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0d2218]/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs shadow-xs"
              title="Platform Verified: Identity and business details verified by Aatmanirbhar Nari team"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400 fill-emerald-950" /> 
              Platform Verified
            </span>
          </div>
        )}
      </div>
      
      {/* Card Details Body */}
      <div className="p-5 flex flex-col flex-grow">
        
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider truncate">
            {business.category || 'Local Service'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-stone-100 mb-2 line-clamp-1 group-hover:text-[#d4885c] transition-colors">
          {business.businessName || business.name}
        </h3>
        
        <div className="flex items-center text-xs font-medium text-stone-400 mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#c5a059] flex-shrink-0" />
          <span className="truncate">{business.location}</span>
        </div>
        
        <p className="text-xs text-stone-300/80 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {business.description}
        </p>
        
        <div className="space-y-2 mb-5 pt-3 border-t border-[#262c3a] text-xs">
          <div className="flex items-center text-stone-200 font-medium">
            <Tag className="w-3.5 h-3.5 mr-2 text-[#c5a059] flex-shrink-0" />
            <span className="truncate">{business.pricingRange}</span>
          </div>
          <div className="flex items-center text-stone-400">
            <Clock className="w-3.5 h-3.5 mr-2 text-stone-500 flex-shrink-0" />
            <span className="truncate">{availabilityText}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link to={`/businesses/${business.id}`} className="w-full block">
            <button className="w-full justify-center font-semibold text-xs py-2.5 px-4 rounded-lg bg-[#1d222e] hover:bg-[#c5a059] text-stone-200 hover:text-stone-950 border border-[#2d3446] hover:border-[#c5a059] transition-all duration-200 flex items-center justify-center cursor-pointer">
              View Business <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BusinessCard;
