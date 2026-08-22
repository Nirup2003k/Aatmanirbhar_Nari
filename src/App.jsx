import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home/Home';
import Businesses from './pages/Businesses/Businesses';
import BusinessDetails from './pages/BusinessDetails/BusinessDetails';
import LearningHub from './pages/Learning/LearningHub';
import LearningArticle from './pages/Learning/LearningArticle';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EntrepreneurDashboard from './pages/Entrepreneur/EntrepreneurDashboard';
import Checkout from './pages/Orders/Checkout';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from './pages/Orders/OrderDetails';
import ProtectedRoute from './components/common/ProtectedRoute';

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

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToAnchor />
          <div className="flex flex-col min-h-screen font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/businesses" element={<Businesses />} />
                <Route path="/businesses/:id" element={<BusinessDetails />} />
                <Route path="/learning" element={<LearningHub />} />
                <Route path="/learning/:id" element={<LearningArticle />} />
                <Route path="/about" element={<About />} />
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
