import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const FinalCTA = () => {
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <section className="bg-[#060709] py-20 relative overflow-hidden text-white border-t border-[#1a1f2b]">
      
      {/* Restrained Subtle Ambient Copper Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4885c]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 bg-[#141824]/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-[#262f42] text-xs font-semibold text-[#c5a059] mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Empowering Neighborhood Micro-Enterprises</span>
        </div>

        {isCustomer ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight">
              Support Local Women Entrepreneurs <br className="hidden sm:inline" />
              <span className="text-[#d4885c]">In Your Community.</span>
            </h2>
            <p className="text-base sm:text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              From fresh daily tiffins to custom boutique tailoring and beauty services, connect directly with verified women business owners nearby.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/businesses" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center cursor-pointer">
                  Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/orders" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#141824] text-stone-200 border border-[#273043] hover:bg-[#1d2334] font-semibold text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  My Orders
                </button>
              </Link>
            </div>
          </>
        ) : isEntrepreneur ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight">
              Scale Your Home Business With <br className="hidden sm:inline" />
              <span className="text-[#d4885c]">Aatmanirbhar Nari.</span>
            </h2>
            <p className="text-base sm:text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Manage your digital profile, update weekly availability, and respond directly to customer inquiries in your local area.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/entrepreneur/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center cursor-pointer">
                  Manage My Business <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/learning" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#141824] text-stone-200 border border-[#273043] hover:bg-[#1d2334] font-semibold text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  Learning & Guides
                </button>
              </Link>
            </div>
          </>
        ) : isAdmin ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight">
              Platform Administration <br className="hidden sm:inline" />
              <span className="text-[#d4885c]">& Directory Control.</span>
            </h2>
            <p className="text-base sm:text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Oversee community micro-enterprises, verify entrepreneur submissions, and support local growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/admin/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center cursor-pointer">
                  Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/businesses" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#141824] text-stone-200 border border-[#273043] hover:bg-[#1d2334] font-semibold text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  Explore Businesses
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight">
              Discover Local Skills. <br className="hidden sm:inline" />
              <span className="text-[#d4885c]">Support Local Businesses.</span>
            </h2>
            <p className="text-base sm:text-lg text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Whether you want to order authentic home meals or start your own business, join our growing local marketplace community today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/businesses" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#c5a059] hover:bg-[#d4b068] text-stone-950 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center cursor-pointer">
                  Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="/auth/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#141824] text-stone-200 border border-[#273043] hover:bg-[#1d2334] font-semibold text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer">
                  Start Your Business
                </button>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default FinalCTA;
