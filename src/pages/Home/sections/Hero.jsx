import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ShieldCheck, ArrowRight, Star, Heart } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Button from '../../../components/common/Button';
import SmoothInput from '../../../components/common/SmoothInput';
import { useAuth } from '../../../context/AuthContext';
import MarketplaceImage, { heroImages } from '../../../components/common/MarketplaceImage';

const Hero = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const containerRef = useRef(null);

  // Scroll driven animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Transform values for hero kinetic cards & words
  const textY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const rotateLeftCard = useTransform(smoothProgress, [0, 1], [-6, 2]);
  const rotateRightCard = useTransform(smoothProgress, [0, 1], [6, -2]);
  const scaleCollage = useTransform(smoothProgress, [0, 1], [1, 0.95]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `/businesses?${queryString}` : '/businesses');
  };

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <section ref={containerRef} className="relative bg-gradient-to-b from-[#090b0e] via-[#0b0e14] to-[#0d1016] overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#1f2430]">
      
      {/* Restrained Cinematic Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(200,125,85,0.12),transparent_70%)] rounded-full blur-3xl pointer-events-none -z-0 animate-cinematic-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[radial-gradient(ellipse_at_center,rgba(40,55,80,0.2),transparent_70%)] rounded-full blur-3xl pointer-events-none -z-0 animate-ambient-shift"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Kinetic Hero Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center lg:justify-start mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#131722]/90 px-4 py-1.5 rounded-full border border-[#262c3b] shadow-sm text-xs font-semibold text-stone-200 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Empowering Women Micro-Enterprises Across India</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Content Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            <motion.div style={{ y: textY }}>
              {isCustomer ? (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight mb-6 leading-[1.15]">
                    Discover Local Skills. <br className="hidden sm:inline" />
                    <span className="text-amber-400 font-black underline decoration-amber-500/30 decoration-wavy decoration-2">
                      Support Local Businesses.
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                    Find authentic home-cooked meals, custom boutique tailoring, doorstep beauty services, and skilled women professionals right in your neighborhood.
                  </p>
                </>
              ) : isEntrepreneur ? (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight mb-6 leading-[1.15]">
                    Turn Your Skill Into a <br className="hidden sm:inline" />
                    <span className="text-amber-400 font-black">Thriving Business.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                    Manage your digital service profile, set operating hours, showcase your craft, and connect directly with local neighborhood customers.
                  </p>
                </>
              ) : isAdmin ? (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight mb-6 leading-[1.15]">
                    Aatmanirbhar Nari <br className="hidden sm:inline" />
                    <span className="text-amber-400 font-black">Admin Management.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                    Verify micro-enterprises, monitor community directory activity, and support local women entrepreneurs.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight mb-6 leading-[1.15]">
                    Discover Local Skills. <br className="hidden sm:inline" />
                    <span className="text-amber-400 font-black">Support Local Businesses.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                    Connecting home-based women entrepreneurs with nearby customers. Quality tiffin services, custom dressmaking, beauty, handcrafts, and tutoring.
                  </p>
                </>
              )}
            </motion.div>
            
            {/* Search Form - Preserving exact query parameters and behavior */}
            <motion.form 
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#121620]/90 p-3 sm:p-4 rounded-2xl border border-[#262c3b] shadow-2xl mb-8 flex flex-col md:flex-row gap-3 items-center backdrop-blur-md"
            >
              <div className="flex-grow flex items-center w-full md:w-auto bg-[#0b0e14]/70 px-4 py-3.5 rounded-xl border border-[#222836] focus-within:border-amber-500/60 focus-within:bg-[#0f131d] transition-all">
                <Search className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
                <SmoothInput 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service are you looking for? (e.g. Tiffin, Tailoring)" 
                  className="bg-transparent border-none focus:outline-none text-stone-100 w-full text-sm font-medium placeholder:text-stone-400"
                  ariaLabel="What service are you looking for?"
                />
              </div>
              
              <div className="flex-grow flex items-center w-full md:w-auto bg-[#0b0e14]/70 px-4 py-3.5 rounded-xl border border-[#222836] focus-within:border-amber-500/60 focus-within:bg-[#0f131d] transition-all">
                <MapPin className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
                <SmoothInput 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location (e.g. Hubli, Vidya Nagar)" 
                  className="bg-transparent border-none focus:outline-none text-stone-100 w-full text-sm font-medium placeholder:text-stone-400"
                  ariaLabel="Enter your location"
                />
              </div>
              
              <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto px-8 py-3.5 h-auto whitespace-nowrap text-sm font-bold shadow-md">
                Search Marketplace
              </Button>
            </motion.form>
            
            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {isCustomer ? (
                <>
                  <Link to="/businesses" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 font-bold">
                      Explore All Businesses <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/orders" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3.5 bg-[#141822] text-stone-200 border-[#282e3d] hover:bg-[#1c2230]">
                      My Orders
                    </Button>
                  </Link>
                </>
              ) : isEntrepreneur ? (
                <>
                  <Link to="/entrepreneur/dashboard" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 font-bold">
                      Go to Business Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/businesses" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3.5 bg-[#141822] text-stone-200 border-[#282e3d] hover:bg-[#1c2230]">
                      Explore Directory
                    </Button>
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <Link to="/admin/dashboard" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 font-bold">
                      Open Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/businesses" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 font-bold text-base shadow-md">
                      Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/auth/register" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3.5 font-semibold text-base bg-[#141822] text-stone-200 border-[#282e3d] hover:bg-[#1c2230]">
                      Start Your Business
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Platform Trust Highlights */}
            <div className="mt-8 pt-6 border-t border-[#1f2430] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-400 font-medium">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
                Verified Local Entrepreneurs
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 text-amber-400 mr-1.5 fill-amber-400" />
                Direct Neighborhood Connection
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 text-rose-400 mr-1.5 fill-rose-400" />
                100% Women-Led Enterprises
              </span>
            </div>

          </div>

          {/* Realistic Photography Visual Showcase Collage */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-lg lg:max-w-none">
            <motion.div style={{ scale: scaleCollage }} className="relative">
              
              {/* Main Feature Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#2d3446] bg-[#121620]">
                <MarketplaceImage
                  src={heroImages.main}
                  alt="Indian woman entrepreneur in home business"
                  aspectRatio="aspect-[4/3]"
                  className="rounded-3xl"
                  overlayText="Local Women Entrepreneurs"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e]/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-brand-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-2">
                    Verified Marketplace
                  </span>
                  <h3 className="text-xl font-bold text-white drop-shadow-xs">
                    Empowering Home-Based Skills
                  </h3>
                  <p className="text-xs text-stone-200 mt-1 font-normal">
                    Connecting daily customers with home kitchens, boutique studios & tutors.
                  </p>
                </div>
              </div>

              {/* Floating Kinetic Showcase Cards */}
              <motion.div 
                style={{ rotate: rotateLeftCard }}
                className="absolute -bottom-6 -left-6 sm:-left-8 bg-[#141824]/95 p-3.5 rounded-2xl shadow-2xl border border-[#272f3f] flex items-center gap-3 max-w-[220px] hidden sm:flex backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#2d3446]">
                  <MarketplaceImage src={heroImages.tiffin} categoryId={1} aspectRatio="aspect-square" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100 line-clamp-1">Annapurna Tiffins</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold">Available Today</p>
                  <p className="text-[10px] text-stone-400">Vidya Nagar, Hubli</p>
                </div>
              </motion.div>

              <motion.div 
                style={{ rotate: rotateRightCard }}
                className="absolute -top-6 -right-6 bg-[#141824]/95 p-3.5 rounded-2xl shadow-2xl border border-[#272f3f] flex items-center gap-3 max-w-[210px] hidden sm:flex backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#2d3446]">
                  <MarketplaceImage src={heroImages.boutique} categoryId={2} aspectRatio="aspect-square" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100 line-clamp-1">Sahana Boutique</h4>
                  <p className="text-[11px] text-amber-400 font-semibold">Custom Tailoring</p>
                  <p className="text-[10px] text-stone-400">Gokul Road, Hubli</p>
                </div>
              </motion.div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
