import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import Button from '../../../components/common/Button';
import { createInquiry } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

// Validate Indian mobile number after normalizing input
const validateIndianPhone = (phoneStr) => {
  if (!phoneStr) return false;
  let cleaned = phoneStr.replace(/[\s-()]/g, '');
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  return /^[6-9]\d{9}$/.test(cleaned);
};

const validateEmail = (emailStr) => {
  if (!emailStr) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
};

const InquiryForm = ({ businessId, services, selectedServiceId, businessName }) => {
  const { user, isAuthenticated, role } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [serviceId, setServiceId] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync user info into form fields if user changes or logs in
  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.name || '');
      setEmail((prev) => prev || user.email || '');
      setPhone((prev) => prev || user.phone || '');
    }
  }, [user]);

  // Sync serviceId if selected from external service card "Inquire About This Service"
  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(String(selectedServiceId));
    } else if (services && services.length > 0) {
      setServiceId(String(services[0].id));
    }
  }, [selectedServiceId, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (!validateIndianPhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!serviceId) {
      newErrors.serviceId = 'Please select a service.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please tell the entrepreneur what you are looking for.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await createInquiry({
          businessId,
          serviceId,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          message: message.trim(),
        });

        setIsSubmitted(true);
      } catch (err) {
        console.error('Error submitting inquiry to API:', err);
        if (err.status === 401) {
          setApiError('Please log in as a Customer to send an inquiry.');
        } else if (err.status === 403) {
          setApiError('Only Customer accounts can submit service inquiries.');
        } else {
          setApiError(err.message || 'Failed to send inquiry. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setMessage('');
    setErrors({});
    setApiError(null);
    setIsSubmitted(false);
  };

  // Requirement 30: Unauthenticated Customer UX Handling
  if (!isAuthenticated) {
    return (
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-6 text-center space-y-4">
        <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-amber-900 mb-1">
            Customer Login Required
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            Please log in as a Customer to send a direct inquiry to <strong>{businessName}</strong>.
          </p>
        </div>
        <Link to="/auth/login" className="inline-block w-full">
          <Button variant="primary" className="w-full justify-center text-xs py-2.5">
            Log In to Send Inquiry
          </Button>
        </Link>
      </div>
    );
  }

  // Non-Customer Role Warning
  if (role !== 'CUSTOMER') {
    return (
      <div className="bg-brand-background border border-brand-border rounded-xl p-6 text-center space-y-3">
        <div className="w-10 h-10 bg-brand-surface text-brand-muted rounded-full flex items-center justify-center mx-auto border border-brand-border">
          <ShieldAlert className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brand-secondary mb-1">
            Customer Account Required
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Only Customer accounts can send service inquiries. You are logged in as <strong>{role}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Success UI
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 border border-green-300 rounded-full flex items-center justify-center text-green-700 mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-green-900 mb-2">
          Inquiry sent successfully
        </h3>
        <p className="text-sm text-green-800 mb-5 leading-relaxed">
          Thank you for reaching out to <strong>{businessName}</strong>. Your inquiry has been sent to the entrepreneur.
        </p>

        <Button variant="outline" size="sm" onClick={handleReset} className="bg-white">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Inline API Error alert */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="inquiry-name" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          disabled={isSubmitting}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
            errors.name ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="inquiry-email" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="inquiry-email"
          type="email"
          disabled={isSubmitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
            errors.email ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="inquiry-phone" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="inquiry-phone"
          type="tel"
          disabled={isSubmitting}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
            errors.phone ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="inquiry-service" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
          Service Required <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiry-service"
          disabled={isSubmitting}
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
            errors.serviceId ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <option value="">Select a service...</option>
          {services && services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.price})
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {errors.serviceId}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="inquiry-message" className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="inquiry-message"
          rows={4}
          disabled={isSubmitting}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the entrepreneur what you are looking for..."
          className={`w-full bg-brand-background border rounded-lg px-3.5 py-2.5 text-sm text-brand-text focus:outline-none transition-colors ${
            errors.message ? 'border-red-500 bg-red-50/20' : 'border-brand-border focus:border-brand-primary'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className={`w-full justify-center py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending Inquiry...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Inquiry
          </>
        )}
      </Button>
    </form>
  );
};

export default InquiryForm;
