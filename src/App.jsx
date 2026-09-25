import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home/Home';
import Businesses from './pages/Businesses/Businesses';
import BusinessDetails from './pages/BusinessDetails/BusinessDetails';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import Contact from './pages/Legal/Contact';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded heavy route components
const LearningHub = lazy(() => import('./pages/Learning/LearningHub'));
const LearningArticle = lazy(() => import('./pages/Learning/LearningArticle'));
const EntrepreneurDashboard = lazy(() => import('./pages/Entrepreneur/EntrepreneurDashboard'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const Checkout = lazy(() => import('./pages/Orders/Checkout'));
const MyOrders = lazy(() => import('./pages/Orders/MyOrders'));
const OrderDetails = lazy(() => import('./pages/Orders/OrderDetails'));

// Scroll to top or specific hash on route change
const ScrollToAnchor = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
};

// 404 Page Component
const NotFoundPage = () => (
  <div className="flex-grow flex items-center justify-center bg-brand-background py-32">
    <div className="text-center max-w-md px-4">
      <h1 className="text-4xl font-extrabold text-brand-secondary mb-3">404 - Page Not Found</h1>
      <p className="text-sm text-brand-muted mb-6">The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="inline-flex items-center text-xs font-bold text-brand-primary border border-brand-border bg-brand-surface px-4 py-2 rounded-lg hover:bg-brand-background">
        Return to Home Page
      </a>
    </div>
  </div>
);

// Page route fallback component for Suspense
const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center min-h-[50vh] bg-brand-background py-20">
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      <p className="text-xs font-semibold text-brand-muted tracking-wide">Loading content...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToAnchor />
          <div className="flex flex-col min-h-screen font-sans">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/businesses" element={<Businesses />} />
                  <Route path="/businesses/:id" element={<BusinessDetails />} />
                  <Route path="/learning" element={<LearningHub />} />
                  <Route path="/learning/:id" element={<LearningArticle />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute allowedRoles={['CUSTOMER']}>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/entrepreneur/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ENTREPRENEUR']}>
                        <EntrepreneurDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
