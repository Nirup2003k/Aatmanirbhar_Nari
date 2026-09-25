import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import MarketplaceImage from '../../../components/common/MarketplaceImage';

const EntrepreneurCTA = () => {
  const { user, isAuthenticated } = useAuth();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateCard = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const scaleCard = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const storySteps = [
    { title: "Skill", desc: "Cook, stitch, tutor, or craft" },
    { title: "Business", desc: "Create your digital profile" },
    { title: "Services", desc: "Set prices & weekly hours" },
    { title: "Customers", desc: "Receive neighborhood orders" },
    { title: "Growth", desc: "Build independent income" }
  ];

  return (
    <section ref={containerRef} className="bg-[#090b0e] py-24 border-b border-[#1b1f2a] relative overflow-hidden">
      
      {/* Restrained Subtle Ambient Copper Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4885c]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-[#131722] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#242b3a] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Storytelling Column */}
            <div className="lg:col-span-6">
              <motion.div style={{ rotate: rotateCard, scale: scaleCard }} className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#283042] bg-[#0e1118]">
                  <MarketplaceImage
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                    alt="Indian woman entrepreneur running her business"
                    aspectRatio="aspect-[4/3]"
                    overlayText="Turn Skill Into Income"
                  />
                </div>

                {/* Floating Growth Badge */}
                <div className="absolute -bottom-5 -right-5 bg-[#181d2a] p-4 rounded-2xl border border-[#2c3549] shadow-2xl flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#242b3b] flex items-center justify-center text-[#c5a059] font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">Community Growth</h4>
                    <p className="text-[11px] text-stone-400">Empowering local women leaders</p>
                  </div>
                </div>
              </motion.div>

              {/* Visual Progression Path: Skill -> Business -> Growth */}
              <div className="mt-10 pt-6 border-t border-[#242b3a]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059] block mb-3">
                  The Entrepreneur Journey
                </span>
                
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {storySteps.map((s, idx) => (
                    <div key={idx} className="bg-[#1a1f2b] p-2 rounded-xl border border-[#262e3f]">
                      <span className="text-[10px] font-extrabold text-[#c5a059] block">{`0${idx + 1}`}</span>
                      <span className="text-xs font-bold text-stone-200 block mt-0.5">{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content & Action Column */}
            <div className="lg:col-span-6">
              {isCustomer ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Support Local Talent</span>
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight mb-4">
                    Looking for Trusted Local Services?
                  </h2>
                  <p className="text-base text-stone-300 mb-8 leading-relaxed">
                    Connect directly with skilled women entrepreneurs in your neighborhood. Discover daily tiffins, custom dresses, beauty treatments, and tutoring.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/businesses">
                      <button className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                        Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                    <Link to="/orders">
                      <button className="w-full sm:w-auto bg-[#1a1f2e] text-stone-200 border border-[#2b3345] hover:bg-[#232a3d] font-semibold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer">
                        My Orders
                      </button>
                    </Link>
                  </div>
                </>
              ) : isEntrepreneur ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Manage & Scale</span>
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight mb-4">
                    Grow Your Business Profile
                  </h2>
                  <p className="text-base text-stone-300 mb-8 leading-relaxed">
                    Update your operating availability, list new services, and respond to incoming customer inquiries directly from your dashboard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/entrepreneur/dashboard">
                      <button className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                        Go to Business Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                    <Link to="/learning">
                      <button className="w-full sm:w-auto bg-[#1a1f2e] text-stone-200 border border-[#2b3345] hover:bg-[#232a3d] font-semibold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer">
                        Learning Guides
                      </button>
                    </Link>
                  </div>
                </>
              ) : isAdmin ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight mb-4">
                    Platform Management & Directory
                  </h2>
                  <p className="text-base text-stone-300 mb-8 leading-relaxed">
                    Review entrepreneur verification requests, monitor platform activity, and oversee local community micro-enterprises.
                  </p>
                  <Link to="/admin/dashboard">
                    <button className="bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                      Open Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>For Aspiring Women Entrepreneurs</span>
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight mb-4">
                    Your Skill Can Become Your Business.
                  </h2>
                  <p className="text-base text-stone-300 mb-6 leading-relaxed">
                    Build a professional digital presence, display your services, set your working hours, and connect with customers in your local community.
                  </p>
                  
                  <div className="space-y-3 mb-8 text-xs font-semibold text-stone-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Free digital profile creation in under 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Earn the trusted Platform Verified badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Receive order inquiries directly from nearby customers</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/auth/register">
                      <button className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-lg">
                        Start Your Business <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                    <Link to="/businesses">
                      <button className="w-full sm:w-auto bg-[#1a1f2e] text-stone-200 border border-[#2b3345] hover:bg-[#232a3d] font-semibold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer">
                        Explore Marketplace First
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default EntrepreneurCTA;
