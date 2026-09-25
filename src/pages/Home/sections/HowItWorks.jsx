import React, { useRef } from 'react';
import { Search, Eye, MessageCircle, UserPlus, ListPlus, TrendingUp, ShoppingBag, Package, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

const HowItWorks = () => {
  const { user, isAuthenticated } = useAuth();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';

  const customerFullSteps = [
    {
      stepNumber: "01",
      icon: <Search className="w-6 h-6 text-[#c5a059]" />,
      title: "Discover Local Businesses",
      description: "Browse verified local women-led micro-enterprises offering tiffin, tailoring, beauty, and tutoring."
    },
    {
      stepNumber: "02",
      icon: <Eye className="w-6 h-6 text-[#c5a059]" />,
      title: "Explore Services & Pricing",
      description: "View transparent pricing, service menus, photos, and weekly operating availability schedules."
    },
    {
      stepNumber: "03",
      icon: <ShoppingBag className="w-6 h-6 text-[#c5a059]" />,
      title: "Add Items to Cart",
      description: "Select daily meals, custom garments, or beauty treatments directly into your shopping cart."
    },
    {
      stepNumber: "04",
      icon: <Package className="w-6 h-6 text-[#c5a059]" />,
      title: "Place Order & Track",
      description: "Submit orders with your local delivery address and track fulfillment progress in real-time."
    }
  ];

  const entrepreneurFullSteps = [
    {
      stepNumber: "01",
      icon: <UserPlus className="w-6 h-6 text-[#c5a059]" />,
      title: "Create Business Profile",
      description: "Register your micro-enterprise details, service location, and business description in minutes."
    },
    {
      stepNumber: "02",
      icon: <ListPlus className="w-6 h-6 text-[#c5a059]" />,
      title: "List Services & Schedule",
      description: "Add your offerings with transparent pricing and set your weekly available operating hours."
    },
    {
      stepNumber: "03",
      icon: <TrendingUp className="w-6 h-6 text-[#c5a059]" />,
      title: "Earn Platform Verification",
      description: "Submit details to get reviewed by our team and receive the trusted Platform Verified badge."
    },
    {
      stepNumber: "04",
      icon: <Package className="w-6 h-6 text-[#c5a059]" />,
      title: "Receive & Manage Orders",
      description: "Accept customer requests, update order delivery statuses, and expand your local client base."
    }
  ];

  const guestCustomerSteps = [
    {
      stepNumber: "01",
      icon: <Search className="w-5 h-5 text-[#c5a059]" />,
      title: "Discover",
      description: "Find skilled women entrepreneurs in your local neighborhood."
    },
    {
      stepNumber: "02",
      icon: <Eye className="w-5 h-5 text-[#c5a059]" />,
      title: "Explore",
      description: "View services, pricing, availability schedules, and business details."
    },
    {
      stepNumber: "03",
      icon: <MessageCircle className="w-5 h-5 text-[#c5a059]" />,
      title: "Connect & Order",
      description: "Send direct inquiries or place orders with local entrepreneurs."
    }
  ];

  const guestEntrepreneurSteps = [
    {
      stepNumber: "01",
      icon: <UserPlus className="w-5 h-5 text-emerald-400" />,
      title: "Create Profile",
      description: "Register your home business and set up your digital profile."
    },
    {
      stepNumber: "02",
      icon: <ListPlus className="w-5 h-5 text-emerald-400" />,
      title: "Add Offerings",
      description: "List services, set pricing options, and specify availability."
    },
    {
      stepNumber: "03",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: "Grow Income",
      description: "Connect with nearby neighborhood customers and scale your craft."
    }
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-[#10131b] py-24 border-b border-[#1f2533] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 3-Step Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
            How Aatmanirbhar Nari Works
          </h2>
          <p className="text-sm sm:text-base text-stone-400 mt-3">
            Connecting neighborhood customers directly with verified women-led micro-enterprises.
          </p>
        </div>

        {isCustomer ? (
          /* CUSTOMER LOGGED IN WORKFLOW */
          <div className="bg-[#151924] rounded-3xl p-8 sm:p-12 border border-[#252c3c] shadow-2xl max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-stone-100 mb-2 text-center">Customer Ordering Experience</h3>
            <p className="text-center text-stone-400 mb-12 text-sm">Four seamless steps from discovery to doorstep fulfillment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {customerFullSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#1a1f2e] border border-[#272f40] rounded-2xl p-6 flex items-start gap-4 hover:border-[#c5a059]/40 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#121620] border border-[#272e3f] shadow-xs flex items-center justify-center font-bold text-[#c5a059]">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#c5a059] uppercase tracking-widest">{step.stepNumber}</span>
                    <h4 className="text-base font-bold text-stone-100 mb-1">{step.title}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
              <Link to="/businesses">
                <button className="bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  Explore Local Businesses <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/orders">
                <button className="bg-[#1c212e] hover:bg-[#252c3d] text-stone-200 border border-[#2e3749] font-semibold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer">
                  View My Orders
                </button>
              </Link>
            </div>
          </div>
        ) : isEntrepreneur ? (
          /* ENTREPRENEUR LOGGED IN WORKFLOW */
          <div className="bg-[#151924] rounded-3xl p-8 sm:p-12 border border-[#252c3c] shadow-2xl max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-[#c5a059] mb-2 text-center">Entrepreneur Business Workflow</h3>
            <p className="text-center text-stone-400 mb-12 text-sm">Manage offerings, earn verification, and receive local orders.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {entrepreneurFullSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#1a1f2e] border border-[#272f40] rounded-2xl p-6 flex items-start gap-4 hover:border-[#c5a059]/40 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#121620] border border-[#272e3f] shadow-xs flex items-center justify-center font-bold text-[#c5a059]">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#c5a059] uppercase tracking-widest">{step.stepNumber}</span>
                    <h4 className="text-base font-bold text-stone-100 mb-1">{step.title}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
              <Link to="/entrepreneur/dashboard">
                <button className="bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  Go to Business Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/learning">
                <button className="bg-[#1c212e] hover:bg-[#252c3d] text-stone-200 border border-[#2e3749] font-semibold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer">
                  View Business Guides
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* GUEST / GENERAL WORKFLOW WITH SCROLL-ANIMATED STEP CARDS */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            
            {/* Customer Journey Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#151924] rounded-3xl p-8 border border-[#252c3c] shadow-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="inline-block bg-[#1d2230] text-[#c5a059] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#2f374a]">
                  For Customers
                </div>
                <h3 className="text-2xl font-extrabold text-stone-100 mb-6">Order From Local Women Entrepreneurs</h3>

                <div className="space-y-6 relative">
                  {/* Animated Connecting Line */}
                  <motion.div 
                    style={{ height: lineHeight }}
                    className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#c5a059]/30 origin-top -z-0 hidden sm:block" 
                  />

                  {guestCustomerSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#1e2331] border-2 border-[#c5a059] text-[#c5a059] flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#252c3c]">
                <Link to="/businesses" className="block">
                  <button className="w-full justify-center bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                    Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Entrepreneur Journey Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#0e121a] rounded-3xl p-8 border border-[#202737] shadow-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="inline-block bg-[#1f2838] text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                  For Entrepreneurs
                </div>
                <h3 className="text-2xl font-extrabold text-stone-100 mb-6">Turn Your Skill Into a Business</h3>

                <div className="space-y-6 relative">
                  {guestEntrepreneurSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#202737]">
                <Link to="/auth/register" className="block">
                  <button className="w-full justify-center bg-[#18202d] text-stone-100 border border-[#2a3447] hover:bg-[#222c3e] hover:border-[#c5a059] font-bold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer">
                    Start Your Business <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
};

export default HowItWorks;
