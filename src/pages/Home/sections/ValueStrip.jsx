import React from 'react';
import { ShieldCheck, Search, MessageCircle, ShoppingBag, HeartHandshake, CheckCircle2 } from 'lucide-react';
import MarketplaceImage from '../../../components/common/MarketplaceImage';

const ValueStrip = () => {
  const trustPoints = [
    {
      icon: <Search className="w-5 h-5 text-[#c5a059]" />,
      title: "Easy Local Discovery",
      description: "Find verified home-cooked tiffins, tailoring, beauty, and tutoring right in your neighborhood."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Platform Verification",
      description: "Our team verifies business identity and service details to give customers clarity and peace of mind."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#c5a059]" />,
      title: "Direct Customer Inquiries",
      description: "Connect directly with women business owners to inquire about customized orders or schedules."
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-[#c5a059]" />,
      title: "Convenient Ordering",
      description: "Browse menu options, select services, and place orders with seamless local fulfillment tracking."
    }
  ];

  return (
    <section className="bg-[#0e1118] py-24 border-b border-[#1e2330] relative overflow-hidden">
      
      {/* Subtle Background Lighting Accent */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Asymmetric Visual Highlight Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#252c3c] bg-[#141824] p-2">
              <MarketplaceImage
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                alt="Women business owner serving local customer"
                aspectRatio="aspect-[4/5]"
                className="rounded-2xl"
                overlayText="Empowering Women Entrepreneurs"
              />
              
              {/* Overlay Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#131722]/95 backdrop-blur-md p-5 rounded-2xl border border-[#282f42] shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Community Impact Platform</span>
                </div>
                <p className="text-xs text-stone-300/90 leading-relaxed font-medium">
                  "Every order directly supports a woman entrepreneur growing her independent home micro-enterprise."
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content & Feature Matrix Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Why Choose Aatmanirbhar Nari</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight">
              Built for Trust, Local Impact & Seamless Discovery
            </h2>
            
            <p className="text-base text-stone-300/90 mb-10 leading-relaxed max-w-2xl font-normal">
              Aatmanirbhar Nari bridges the gap between skilled women operating from home and customers looking for high-quality, authentic local services.
            </p>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="bg-[#151924] border border-[#252c3c] rounded-2xl p-5 hover:bg-[#1a1f2d] hover:border-[#c5a059]/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1d2230] border border-[#2d3548] flex items-center justify-center mb-4 shadow-xs">
                    {point.icon}
                  </div>
                  <h3 className="text-base font-bold text-stone-100 mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ValueStrip;
