import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Share2, MessageCircle, Mail, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <footer className="bg-[#060709] text-stone-200 border-t border-[#181c27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#c5a059] flex items-center justify-center text-stone-950 mr-3 shadow-md group-hover:scale-105 transition-transform">
                <Store className="h-5 w-5 text-stone-950" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-stone-100">
                Aatmanirbhar Nari
              </span>
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              Empowering women entrepreneurs across India to showcase home-based skills, connect directly with local customers, and build thriving businesses.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#141824] border border-[#262f42] flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-[#c5a059] hover:text-stone-950 transition-all">
                <span className="sr-only">Share</span>
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#141824] border border-[#262f42] flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-[#c5a059] hover:text-stone-950 transition-all">
                <span className="sr-only">Contact</span>
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#141824] border border-[#262f42] flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-[#c5a059] hover:text-stone-950 transition-all">
                <span className="sr-only">Email</span>
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#c5a059]">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/businesses" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Explore Businesses</Link>
              </li>
              {isCustomer && (
                <li>
                  <Link to="/orders" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">My Orders</Link>
                </li>
              )}
              {isEntrepreneur && (
                <>
                  <li>
                    <Link to="/entrepreneur/dashboard?tab=details" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">My Business</Link>
                  </li>
                  <li>
                    <Link to="/entrepreneur/dashboard?tab=orders" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Manage Orders</Link>
                  </li>
                </>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin/dashboard" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Admin Dashboard</Link>
                </li>
              )}
              {!isCustomer && !isAdmin && (
                <li>
                  <Link to="/learning" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Learning</Link>
                </li>
              )}
              <li>
                <Link to="/about" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Role Aware Hub */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#c5a059]">
              {isCustomer ? 'Customer Hub' : isEntrepreneur ? 'Entrepreneur Hub' : isAdmin ? 'Admin Hub' : 'For Entrepreneurs'}
            </h3>
            <ul className="space-y-2.5">
              {isCustomer ? (
                <>
                  <li>
                    <Link to="/orders" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Track My Orders</Link>
                  </li>
                  <li>
                    <Link to="/businesses" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Explore Local Directory</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">About Aatmanirbhar Nari</Link>
                  </li>
                </>
              ) : isEntrepreneur ? (
                <>
                  <li>
                    <Link to="/entrepreneur/dashboard" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Business Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Business Guidance</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Marketing Resources</Link>
                  </li>
                </>
              ) : isAdmin ? (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Admin Portal</Link>
                  </li>
                  <li>
                    <Link to="/businesses" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Business Directory</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth/register" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Start Your Business</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Business Guidance</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Marketing Resources</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal & Mission */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#c5a059]">
              Legal & Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Terms of Use</Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-stone-400 hover:text-stone-100 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Sub-bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 gap-4">
          <p>
            &copy; {currentYear} Aatmanirbhar Nari. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Built with passion for local women empowerment</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
