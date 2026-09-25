import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, User, LogOut, ShoppingCart, Package, Building2, ClipboardList, Shield, BookOpen, Info, HelpCircle } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, openCartDrawer } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu on click outside or Escape key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.includes('#')) {
      return location.hash === path.substring(1);
    }
    return location.pathname.startsWith(path);
  };

  const isRole = (roleName) => isAuthenticated && user?.role === roleName;
  const isCustomer = isRole('CUSTOMER');
  const isEntrepreneur = isRole('ENTREPRENEUR');
  const isAdmin = isRole('ADMIN');
  const isGuest = !isAuthenticated;

  // Secondary/public links inside the hamburger menu
  const getSecondaryLinks = () => {
    const defaultPublic = [
      { name: 'Explore Businesses', path: '/businesses', icon: Store },
      { name: 'How It Works', path: '/#how-it-works', icon: HelpCircle },
      { name: 'About', path: '/about', icon: Info },
    ];

    if (isGuest || isEntrepreneur) {
      defaultPublic.splice(2, 0, { name: 'Learning', path: '/learning', icon: BookOpen });
    }

    return defaultPublic;
  };

  const secondaryLinks = getSecondaryLinks();

  return (
    <>
      <nav ref={navRef} className="bg-[#0b0e14]/95 border-b border-[#1f2533] sticky top-0 z-40 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo (Left side) */}
            <div className="flex items-center min-w-0 mr-2">
              <Link to="/" onClick={closeMenu} className="flex items-center flex-shrink-0">
                <Store className="h-6 w-6 sm:h-7 sm:w-7 text-[#c5a059] mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="font-bold text-lg sm:text-xl text-stone-100 tracking-tight truncate">
                  Aatmanirbhar Nari
                </span>
              </Link>
            </div>

            {/* Desktop Navigation & Actions (Right side) */}
            <div className="hidden md:flex md:items-center md:space-x-5">
              
              {/* Authenticated Role Layout */}
              {isAuthenticated ? (
                <>
                  {/* Primary Role-Specific Links */}
                  <div className="flex items-center space-x-5">
                    {/* Home Link */}
                    <Link
                      to="/"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/')
                          ? 'text-[#c5a059] font-bold'
                          : 'text-stone-300 hover:text-[#c5a059]'
                      }`}
                    >
                      Home
                    </Link>

                    {/* CUSTOMER Links */}
                    {isCustomer && (
                      <>
                        <Link
                          to="/orders"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            isActive('/orders')
                              ? 'text-[#c5a059] font-bold'
                              : 'text-stone-300 hover:text-[#c5a059]'
                          }`}
                        >
                          <Package className="w-4 h-4 mr-1 text-[#c5a059]" />
                          <span>My Orders</span>
                        </Link>

                        <button
                          onClick={openCartDrawer}
                          className="relative p-2 text-stone-300 hover:text-[#c5a059] transition-colors rounded-lg hover:bg-[#161a24] border border-transparent hover:border-[#262c3b]"
                          title="Shopping Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#c5a059] text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                              {cartCount}
                            </span>
                          )}
                        </button>
                      </>
                    )}

                    {/* ENTREPRENEUR Links */}
                    {isEntrepreneur && (
                      <>
                        <Link
                          to="/entrepreneur/dashboard?tab=details"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            location.pathname === '/entrepreneur/dashboard' && (!location.search || location.search.includes('tab=details'))
                              ? 'text-[#c5a059] font-bold'
                              : 'text-stone-300 hover:text-[#c5a059]'
                          }`}
                        >
                          <Building2 className="w-4 h-4 mr-1 text-[#c5a059]" />
                          <span>My Business</span>
                        </Link>
                        <Link
                          to="/entrepreneur/dashboard?tab=orders"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            location.pathname === '/entrepreneur/dashboard' && location.search.includes('tab=orders')
                              ? 'text-[#c5a059] font-bold'
                              : 'text-stone-300 hover:text-[#c5a059]'
                          }`}
                        >
                          <ClipboardList className="w-4 h-4 mr-1 text-[#c5a059]" />
                          <span>Manage Orders</span>
                        </Link>
                      </>
                    )}

                    {/* ADMIN Links */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className={`text-sm font-medium flex items-center transition-colors ${
                          isActive('/admin')
                            ? 'text-[#c5a059] font-bold'
                            : 'text-stone-300 hover:text-[#c5a059]'
                        }`}
                      >
                        <Shield className="w-4 h-4 mr-1 text-[#c5a059]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  {/* Profile Section + Logout + Hamburger Button */}
                  <div className="flex items-center space-x-3 border-l border-[#242a38] pl-4">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-stone-200 bg-[#151924] px-3 py-1.5 rounded-lg border border-[#262c3b]">
                      <User className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{user.name}</span>
                      <span className="ml-1 text-[10px] font-bold uppercase bg-[#c5a059]/15 text-[#c5a059] px-1.5 py-0.5 rounded border border-[#c5a059]/20">
                        {user.role}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="text-xs">
                      <LogOut className="w-3.5 h-3.5 mr-1" />
                      Logout
                    </Button>
                    <button
                      onClick={toggleMenu}
                      className="p-2 rounded-lg text-stone-300 hover:text-[#c5a059] hover:bg-[#161a24] border border-[#242a38] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50"
                      aria-label="Toggle navigation menu"
                      aria-expanded={isMenuOpen}
                    >
                      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              ) : (
                /* GUEST Layout */
                <>
                  <div className="flex items-center space-x-5">
                    <Link
                      to="/"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/')
                          ? 'text-[#c5a059] font-bold'
                          : 'text-stone-300 hover:text-[#c5a059]'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/businesses"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/businesses')
                          ? 'text-[#c5a059] font-bold'
                          : 'text-stone-300 hover:text-[#c5a059]'
                      }`}
                    >
                      Explore Businesses
                    </Link>
                    <button
                      onClick={openCartDrawer}
                      className="relative p-2 text-stone-300 hover:text-[#c5a059] transition-colors rounded-lg hover:bg-[#161a24] border border-transparent hover:border-[#262c3b]"
                      title="Shopping Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#c5a059] text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 border-l border-[#242a38] pl-4">
                    <Link to="/auth/login" className="text-sm font-medium text-stone-300 hover:text-[#c5a059] transition-colors">
                      Login
                    </Link>
                    <Link to="/auth/register">
                      <Button variant="primary" size="sm">
                        Start Your Business
                      </Button>
                    </Link>
                    <button
                      onClick={toggleMenu}
                      className="p-2 rounded-lg text-stone-300 hover:text-[#c5a059] hover:bg-[#161a24] border border-[#242a38] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50"
                      aria-label="Toggle navigation menu"
                      aria-expanded={isMenuOpen}
                    >
                      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Mobile View Controls */}
            <div className="flex items-center space-x-2 md:hidden">
              {(isGuest || isCustomer) && (
                <button
                  onClick={openCartDrawer}
                  className="relative p-2 text-stone-300 hover:text-[#c5a059] transition-colors rounded-lg hover:bg-[#161a24]"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#c5a059] text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Hamburger Button (Mobile) */}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-stone-300 hover:text-[#c5a059] hover:bg-[#161a24] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#c5a059]"
                aria-expanded={isMenuOpen}
                aria-label="Open navigation menu"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Hamburger Menu */}
        {isMenuOpen && (
          <div className="border-t border-[#1f2533] bg-[#0f121a] shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Secondary / Public Links Section */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-3">
                    Secondary Navigation
                  </h4>
                  <div className="space-y-1">
                    {/* Mobile Only Links inside Hamburger */}
                    <div className="md:hidden space-y-1 mb-2 pb-2 border-b border-[#1f2533]">
                      <Link
                        to="/"
                        onClick={closeMenu}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive('/') ? 'text-[#c5a059] bg-[#161a24] font-bold' : 'text-stone-300 hover:text-[#c5a059]'
                        }`}
                      >
                        Home
                      </Link>

                      {isCustomer && (
                        <>
                          <Link
                            to="/orders"
                            onClick={closeMenu}
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                              isActive('/orders') ? 'text-[#c5a059] bg-[#161a24] font-bold' : 'text-stone-300 hover:text-[#c5a059]'
                            }`}
                          >
                            <Package className="w-4 h-4 mr-2 text-[#c5a059]" />
                            My Orders
                          </Link>
                        </>
                      )}

                      {isEntrepreneur && (
                        <>
                          <Link
                            to="/entrepreneur/dashboard?tab=details"
                            onClick={closeMenu}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-stone-300 hover:text-[#c5a059]"
                          >
                            <Building2 className="w-4 h-4 mr-2 text-[#c5a059]" />
                            My Business
                          </Link>
                          <Link
                            to="/entrepreneur/dashboard?tab=orders"
                            onClick={closeMenu}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-stone-300 hover:text-[#c5a059]"
                          >
                            <ClipboardList className="w-4 h-4 mr-2 text-[#c5a059]" />
                            Manage Orders
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-stone-300 hover:text-[#c5a059]"
                        >
                          <Shield className="w-4 h-4 mr-2 text-[#c5a059]" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Secondary Navigation Items */}
                    {secondaryLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={closeMenu}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(link.path)
                              ? 'text-[#c5a059] bg-[#161a24] font-bold'
                              : 'text-stone-300 hover:text-[#c5a059] hover:bg-[#161a24]'
                          }`}
                        >
                          {IconComponent && <IconComponent className="w-4 h-4 mr-2 text-[#c5a059]" />}
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Auth / Profile Info inside Dropdown */}
                <div className="md:hidden pt-2 border-t border-[#1f2533]">
                  {isAuthenticated ? (
                    <div className="space-y-3 p-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-200 bg-[#151924] p-3 rounded-lg border border-[#262c3b]">
                        <span>{user.name}</span>
                        <span className="text-[10px] font-bold uppercase bg-[#c5a059]/15 text-[#c5a059] px-1.5 py-0.5 rounded border border-[#c5a059]/20">
                          {user.role}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-center text-xs"
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                      <Link 
                        to="/auth/login" 
                        className="block text-center py-2 text-sm font-medium text-stone-300 hover:text-[#c5a059]"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/auth/register" 
                        className="block"
                        onClick={closeMenu}
                      >
                        <Button variant="primary" className="w-full justify-center text-sm">
                          Start Your Business
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
