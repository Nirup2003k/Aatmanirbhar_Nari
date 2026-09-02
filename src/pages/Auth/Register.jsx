import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building, MapPin, Tag, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

import { OFFICIAL_CATEGORIES } from '../../constants/categories';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('ENTREPRENEUR'); // CUSTOMER or ENTREPRENEUR only

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    // Step 2: Business Info
    businessName: '',
    categoryId: '1',
    location: 'Vidya Nagar, Hubli',
    description: '',
    serviceArea: 'Serving Vidya Nagar and surrounding 3 km radius',
    pricingRange: '₹100 - ₹200',
    // Step 3: Service Listing
    serviceName: '',
    servicePrice: '',
    serviceDescription: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.ownerName.trim()) errs.ownerName = 'Please enter your full name.';
    if (!formData.phone.trim()) errs.phone = 'Please enter a valid 10-digit mobile number.';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!formData.email.trim()) errs.email = 'Please enter your email.';
    if (!formData.password || formData.password.length < 10) {
      errs.password = 'Password must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (role === 'ENTREPRENEUR') {
      if (!formData.businessName.trim()) errs.businessName = 'Please enter your business name.';
      if (!formData.description.trim()) errs.description = 'Please provide a brief description of your craft or home kitchen.';
      if (!formData.location.trim()) errs.location = 'Please select or enter your area location.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (role === 'ENTREPRENEUR') {
      if (!formData.serviceName.trim()) errs.serviceName = 'Please enter a primary service or product name.';
      if (!formData.servicePrice.trim()) errs.servicePrice = 'Please specify the price (e.g. ₹90 per meal or ₹300).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterUser = async () => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await register({
        name: formData.ownerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: role, // CUSTOMER or ENTREPRENEUR
      });

      setStep(4);
    } catch (err) {
      console.error('Registration failed:', err);
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      if (role === 'CUSTOMER') {
        // Complete customer registration immediately
        await handleRegisterUser();
      } else {
        setStep(2);
      }
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      await handleRegisterUser();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    navigate('/businesses');
  };

  const categoryObj = OFFICIAL_CATEGORIES.find((c) => String(c.id) === String(formData.categoryId)) || OFFICIAL_CATEGORIES[0];

  return (
    <div className="bg-brand-background min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-extrabold text-brand-secondary mb-3">
            <span className="bg-brand-primary text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              AN
            </span>
            <span>Aatmanirbhar Nari</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-secondary">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Register as a Customer to request services, or as an Entrepreneur to list your micro-business.
          </p>
        </div>

        {/* Account Role Selector */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 mb-6 shadow-sm flex items-center justify-center space-x-4">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
              role === 'CUSTOMER'
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-background text-brand-text border-brand-border hover:border-brand-primary/40'
            }`}
          >
            Register as Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('ENTREPRENEUR')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all border ${
              role === 'ENTREPRENEUR'
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-background text-brand-text border-brand-border hover:border-brand-primary/40'
            }`}
          >
            Register as Entrepreneur
          </button>
        </div>

        {/* Stepper Progress Bar (for Entrepreneur) */}
        {role === 'ENTREPRENEUR' && (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-4 mb-8 flex items-center justify-between shadow-sm">
            {[
              { num: 1, label: 'Entrepreneur' },
              { num: 2, label: 'Business Profile' },
              { num: 3, label: 'Services' },
              { num: 4, label: 'Complete' },
            ].map((s, idx) => {
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-brand-background text-brand-muted border border-brand-border'
                      }`}
                    >
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline ${isActive ? 'text-brand-secondary' : 'text-brand-muted'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && <div className="flex-1 h-[2px] bg-brand-border/60 mx-2" />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Main Card Form */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-10 shadow-sm">

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 text-xs text-red-700 flex items-start mb-6">
              <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-secondary border-b border-brand-border/60 pb-3 flex items-center">
                <User className="w-5 h-5 text-brand-primary mr-2" />
                Step 1: Account Information ({role})
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="e.g. Annapurna Patil"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.ownerName ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  WhatsApp / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  disabled={isSubmitting}
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  disabled={isSubmitting}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="At least 10 characters"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.password ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" disabled={isSubmitting} onClick={handleNext}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : role === 'CUSTOMER' ? (
                    <>
                      Complete Customer Registration
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next: Business Info
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Business Profile */}
          {step === 2 && role === 'ENTREPRENEUR' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-secondary border-b border-brand-border/60 pb-3 flex items-center">
                <Building className="w-5 h-5 text-brand-primary mr-2" />
                Step 2: Business Information
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="e.g. Annapurna Home Kitchen"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.businessName ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Craft / Industry Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {OFFICIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateField('categoryId', String(cat.id))}
                      className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        String(formData.categoryId) === String(cat.id)
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-bold shadow-sm'
                          : 'bg-brand-background border-brand-border text-brand-text hover:border-brand-primary/40'
                      }`}
                    >
                      <span className="text-xs">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Location / Locality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. Vidya Nagar, Hubli"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.location ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your special dishes, stitching expertise, salon services, or crafts..."
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.description ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Next: Add Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Initial Service Listing */}
          {step === 3 && role === 'ENTREPRENEUR' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-secondary border-b border-brand-border/60 pb-3 flex items-center">
                <Tag className="w-5 h-5 text-brand-primary mr-2" />
                Step 3: List Your Primary Service or Product
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Service / Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => updateField('serviceName', e.target.value)}
                  placeholder="e.g. South Indian Daily Lunch Tiffin"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.serviceName ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.serviceName && <p className="mt-1 text-xs text-red-600">{errors.serviceName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Pricing <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.servicePrice}
                  onChange={(e) => updateField('servicePrice', e.target.value)}
                  placeholder="e.g. ₹90 per meal or ₹300 per blouse"
                  className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm ${
                    errors.servicePrice ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors.servicePrice && <p className="mt-1 text-xs text-red-600">{errors.servicePrice}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  Service Details / Inclusions
                </label>
                <textarea
                  rows={3}
                  value={formData.serviceDescription}
                  onChange={(e) => updateField('serviceDescription', e.target.value)}
                  placeholder="e.g. Steamed rice, sambar, rasam, 2 chapatis, veggie curry, and buttermilk."
                  className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:border-brand-primary"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" disabled={isSubmitting} onClick={handleNext}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Live Card Preview */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-700 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-secondary mb-2">
                  Welcome to Aatmanirbhar Nari, {formData.ownerName}!
                </h2>
                <p className="text-sm text-brand-muted max-w-md mx-auto">
                  Your account ({role}) has been created successfully.
                </p>
              </div>

              {role === 'ENTREPRENEUR' && (
                <div className="bg-brand-background border border-brand-border rounded-xl p-6 text-left shadow-sm max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-primary bg-brand-surface px-2.5 py-1 rounded-md border border-brand-border">
                      {categoryObj.name}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      Available Today
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-secondary mb-1">
                    {formData.businessName || 'Your Micro-Business'}
                  </h3>
                  <div className="flex items-center text-xs text-brand-muted mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-brand-primary/70" />
                    {formData.location}
                  </div>
                  <p className="text-xs text-brand-text line-clamp-2 mb-4">
                    {formData.description}
                  </p>
                  <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-secondary">{formData.servicePrice || 'Contact for Pricing'}</span>
                    <span className="text-brand-primary font-semibold">By {formData.ownerName}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="primary" onClick={handleFinish}>
                  Explore Businesses
                </Button>
                <Link to="/learning">
                  <Button variant="outline">
                    Read Business Starter Guides
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Register;
