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
      { name: 'How It Works', path: '/#how-it-works', icon: HelpCircle },
      { name: 'About', path: '/about', icon: Info },
    ];

    if (isGuest || isEntrepreneur) {
      defaultPublic.splice(1, 0, { name: 'Learning', path: '/learning', icon: BookOpen });
    }

    if (isAuthenticated) {
      return [
        { name: 'Explore Businesses', path: '/businesses', icon: Store },
        ...defaultPublic,
      ];
    }

    return defaultPublic;
  };

  const secondaryLinks = getSecondaryLinks();

  return (
    <>
      <nav ref={navRef} className="bg-brand-surface border-b border-brand-border sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo (Left side) */}
            <div className="flex items-center">
              <Link to="/" onClick={closeMenu} className="flex items-center flex-shrink-0">
                <Store className="h-8 w-8 text-brand-primary mr-2" />
                <span className="font-bold text-xl text-brand-secondary tracking-tight">
                  Aatmanirbhar Nari
                </span>
              </Link>
            </div>

            {/* Desktop Navigation & Actions (Right side) */}
            <div className="hidden md:flex md:items-center md:space-x-5">
              
              {/* Authenticated Role Layout */}
              {isAuthenticated ? (
                <>
                  {/* Primary Role-Specific Links - Positioned immediately to the left of the Profile Section */}
                  <div className="flex items-center space-x-5">
                    {/* Home Link */}
                    <Link
                      to="/"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/')
                          ? 'text-brand-primary font-bold'
                          : 'text-brand-text hover:text-brand-primary'
                      }`}
                    >
                      Home
                    </Link>

                    {/* CUSTOMER Links: My Orders & Cart */}
                    {isCustomer && (
                      <>
                        <Link
                          to="/orders"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            isActive('/orders')
                              ? 'text-brand-primary font-bold'
                              : 'text-brand-text hover:text-brand-primary'
                          }`}
                        >
                          <Package className="w-4 h-4 mr-1 text-brand-primary" />
                          <span>My Orders</span>
                        </Link>

                        <button
                          onClick={openCartDrawer}
                          className="relative p-2 text-brand-text hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-background border border-transparent hover:border-brand-border"
                          title="Shopping Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale">
                              {cartCount}
                            </span>
                          )}
                        </button>
                      </>
                    )}

                    {/* ENTREPRENEUR Links: My Business & Manage Orders */}
                    {isEntrepreneur && (
                      <>
                        <Link
                          to="/entrepreneur/dashboard?tab=details"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            location.pathname === '/entrepreneur/dashboard' && (!location.search || location.search.includes('tab=details'))
                              ? 'text-brand-primary font-bold'
                              : 'text-brand-text hover:text-brand-primary'
                          }`}
                        >
                          <Building2 className="w-4 h-4 mr-1 text-brand-primary" />
                          <span>My Business</span>
                        </Link>
                        <Link
                          to="/entrepreneur/dashboard?tab=orders"
                          className={`text-sm font-medium flex items-center transition-colors ${
                            location.pathname === '/entrepreneur/dashboard' && location.search.includes('tab=orders')
                              ? 'text-brand-primary font-bold'
                              : 'text-brand-text hover:text-brand-primary'
                          }`}
                        >
                          <ClipboardList className="w-4 h-4 mr-1 text-brand-primary" />
                          <span>Manage Orders</span>
                        </Link>
                      </>
                    )}

                    {/* ADMIN Links: Admin Dashboard */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className={`text-sm font-medium flex items-center transition-colors ${
                          isActive('/admin')
                            ? 'text-brand-primary font-bold'
                            : 'text-brand-text hover:text-brand-primary'
                        }`}
                      >
                        <Shield className="w-4 h-4 mr-1 text-brand-primary" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  {/* Profile Section + Logout + Hamburger Button (Grouped on far right) */}
                  <div className="flex items-center space-x-3 border-l border-brand-border pl-4">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-brand-secondary bg-brand-background px-3 py-1.5 rounded-lg border border-brand-border">
                      <User className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{user.name}</span>
                      <span className="ml-1 text-[10px] font-bold uppercase bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="text-xs">
                      <LogOut className="w-3.5 h-3.5 mr-1" />
                      Logout
                    </Button>
                    <button
                      onClick={toggleMenu}
                      className="p-2 rounded-lg text-brand-text hover:text-brand-primary hover:bg-brand-background border border-brand-border/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
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
                          ? 'text-brand-primary font-bold'
                          : 'text-brand-text hover:text-brand-primary'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/businesses"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/businesses')
                          ? 'text-brand-primary font-bold'
                          : 'text-brand-text hover:text-brand-primary'
                      }`}
                    >
                      Explore Businesses
                    </Link>
                    <button
                      onClick={openCartDrawer}
                      className="relative p-2 text-brand-text hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-background border border-transparent hover:border-brand-border"
                      title="Shopping Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 border-l border-brand-border pl-4">
                    <Link to="/auth/login" className="text-sm font-medium text-brand-text hover:text-brand-primary transition-colors">
                      Login
                    </Link>
                    <Link to="/auth/register">
                      <Button variant="primary" size="sm">
                        Start Your Business
                      </Button>
                    </Link>
                    <button
                      onClick={toggleMenu}
                      className="p-2 rounded-lg text-brand-text hover:text-brand-primary hover:bg-brand-background border border-brand-border/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
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
                  className="relative p-2 text-brand-text hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-background"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* 3-Line Hamburger Button (Mobile) */}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-text hover:text-brand-primary hover:bg-brand-background focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
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

        {/* Dropdown Hamburger Menu (Desktop & Mobile) */}
        {isMenuOpen && (
          <div className="border-t border-brand-border bg-brand-surface shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Secondary / Public Links Section */}
                <div>
                  <h4 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 px-3">
                    Secondary Navigation
                  </h4>
                  <div className="space-y-1">
                    {/* Mobile Only Links inside Hamburger */}
                    <div className="md:hidden space-y-1 mb-2 pb-2 border-b border-brand-border/50">
                      <Link
                        to="/"
                        onClick={closeMenu}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive('/') ? 'text-brand-primary bg-brand-primary/5 font-bold' : 'text-brand-text hover:text-brand-primary'
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
                              isActive('/orders') ? 'text-brand-primary bg-brand-primary/5 font-bold' : 'text-brand-text hover:text-brand-primary'
                            }`}
                          >
                            <Package className="w-4 h-4 mr-2 text-brand-primary" />
                            My Orders
                          </Link>
                        </>
                      )}

                      {isEntrepreneur && (
                        <>
                          <Link
                            to="/entrepreneur/dashboard?tab=details"
                            onClick={closeMenu}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary"
                          >
                            <Building2 className="w-4 h-4 mr-2 text-brand-primary" />
                            My Business
                          </Link>
                          <Link
                            to="/entrepreneur/dashboard?tab=orders"
                            onClick={closeMenu}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary"
                          >
                            <ClipboardList className="w-4 h-4 mr-2 text-brand-primary" />
                            Manage Orders
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-brand-text hover:text-brand-primary"
                        >
                          <Shield className="w-4 h-4 mr-2 text-brand-primary" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Secondary Navigation Items (Explore Businesses, How It Works, Learning, About) */}
                    {secondaryLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={closeMenu}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(link.path)
                              ? 'text-brand-primary bg-brand-primary/5 font-bold'
                              : 'text-brand-text hover:text-brand-primary hover:bg-brand-background'
                          }`}
                        >
                          {IconComponent && <IconComponent className="w-4 h-4 mr-2 text-brand-primary" />}
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Auth / Profile Info inside Dropdown */}
                <div className="md:hidden pt-2 border-t border-brand-border">
                  {isAuthenticated ? (
                    <div className="space-y-3 p-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-brand-secondary bg-brand-background p-3 rounded-lg border border-brand-border">
                        <span>{user.name}</span>
                        <span className="text-[10px] font-bold uppercase bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded">
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
                        className="block text-center py-2 text-sm font-medium text-brand-text hover:text-brand-primary"
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
