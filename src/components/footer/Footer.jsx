import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Share2, MessageCircle, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user, isAuthenticated } = useAuth();

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isEntrepreneur = isAuthenticated && user?.role === 'ENTREPRENEUR';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <footer className="bg-brand-secondary text-brand-surface border-t border-brand-secondary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Store className="h-8 w-8 text-brand-primary mr-2" />
              <span className="font-bold text-xl tracking-tight text-white">
                Aatmanirbhar Nari
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Empowering women to turn their skills into thriving local businesses. Discover, connect, and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Share</span>
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Contact</span>
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/businesses" className="text-sm text-gray-400 hover:text-white transition-colors">Explore Businesses</Link>
              </li>
              {isCustomer && (
                <li>
                  <Link to="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">My Orders</Link>
                </li>
              )}
              {isEntrepreneur && (
                <>
                  <li>
                    <Link to="/entrepreneur/dashboard?tab=details" className="text-sm text-gray-400 hover:text-white transition-colors">My Business</Link>
                  </li>
                  <li>
                    <Link to="/entrepreneur/dashboard?tab=orders" className="text-sm text-gray-400 hover:text-white transition-colors">Manage Orders</Link>
                  </li>
                </>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Admin Dashboard</Link>
                </li>
              )}
              {!isCustomer && !isAdmin && (
                <li>
                  <Link to="/learning" className="text-sm text-gray-400 hover:text-white transition-colors">Learning</Link>
                </li>
              )}
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* For Entrepreneurs / Customer / Admin Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {isCustomer ? 'Customer Links' : isEntrepreneur ? 'Entrepreneur Hub' : isAdmin ? 'Admin Management' : 'For Entrepreneurs'}
            </h3>
            <ul className="space-y-3">
              {isCustomer ? (
                <>
                  <li>
                    <Link to="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">Track My Orders</Link>
                  </li>
                  <li>
                    <Link to="/businesses" className="text-sm text-gray-400 hover:text-white transition-colors">Explore Local Directory</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Aatmanirbhar Nari</Link>
                  </li>
                </>
              ) : isEntrepreneur ? (
                <>
                  <li>
                    <Link to="/entrepreneur/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">My Business Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-sm text-gray-400 hover:text-white transition-colors">Business Guidance</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-sm text-gray-400 hover:text-white transition-colors">Marketing Resources</Link>
                  </li>
                </>
              ) : isAdmin ? (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Admin Portal</Link>
                  </li>
                  <li>
                    <Link to="/businesses" className="text-sm text-gray-400 hover:text-white transition-colors">Business Directory</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">Start Your Business</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-sm text-gray-400 hover:text-white transition-colors">Business Guidance</Link>
                  </li>
                  <li>
                    <Link to="/learning" className="text-sm text-gray-400 hover:text-white transition-colors">Marketing Resources</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Use</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} Aatmanirbhar Nari. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built for local empowerment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
