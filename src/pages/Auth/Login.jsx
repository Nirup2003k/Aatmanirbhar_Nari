import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError(null);
    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Please enter your registered email address.';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await login({
          email: emailOrPhone.trim(),
          password,
        });

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/businesses');
        }, 1200);
      } catch (err) {
        console.error('Login error:', err);
        setApiError(err.message || 'Invalid email or password');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmailOrPhone(demoEmail);
    setPassword(demoPassword || 'EntrepreneurPass123!');
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="bg-brand-background min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Brand Badge & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-extrabold text-brand-secondary mb-3">
            <span className="bg-brand-primary text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              AN
            </span>
            <span>Aatmanirbhar Nari</span>
          </Link>
          <h1 className="text-2xl font-bold text-brand-secondary">
            User & Entrepreneur Login
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Sign in to send inquiries or manage your micro-business listing.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-700 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Welcome Back!</h3>
              <p className="text-xs text-emerald-800">
                Logged in successfully. Redirecting...
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>

              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}
              
              {/* Email / Phone */}
              <div>
                <label htmlFor="login-identifier" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-identifier"
                    type="email"
                    disabled={isSubmitting}
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full bg-brand-background border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
                      errors.emailOrPhone ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.emailOrPhone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary">
                    Password <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type="password"
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-brand-background border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
                      errors.password ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full justify-center py-3 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

            </form>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-6 border-t border-brand-border/60">
            <div className="text-xs font-bold text-brand-secondary flex items-center mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary mr-1" />
              Quick Fill Seed Accounts:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('customer@aatmanirbharnari.com', 'CustomerPass123!')}
                className="text-[11px] bg-brand-background hover:bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-brand-text transition-colors"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('annapurna@aatmanirbharnari.com', 'EntrepreneurPass123!')}
                className="text-[11px] bg-brand-background hover:bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-brand-text transition-colors"
              >
                Annapurna (Entrepreneur)
              </button>
            </div>
          </div>

        </div>

        {/* Redirect to Register */}
        <div className="text-center mt-6 text-xs sm:text-sm text-brand-muted">
          Don't have an account yet?{' '}
          <Link to="/auth/register" className="font-bold text-brand-primary hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
