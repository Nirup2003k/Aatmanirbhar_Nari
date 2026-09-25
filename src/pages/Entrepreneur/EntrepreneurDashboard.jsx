import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Plus,
  Edit3,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  AlertCircle,
  Calendar,
  Layers,
  Save,
  Check,
  XCircle,
  Package,
  Eye,
  RefreshCw,
  MapPin,
  User,
} from 'lucide-react';
import Button from '../../components/common/Button';
import SmoothInput from '../../components/common/SmoothInput';
import {
  getEntrepreneurBusinesses,
  createBusiness,
  updateBusiness,
  createService,
  updateService,
  updateAvailability,
  getEntrepreneurInquiries,
  updateInquiryStatus,
  getEntrepreneurOrders,
  updateEntrepreneurOrderStatus,
  resubmitVerificationDetails,
} from '../../services/api';
import { CATEGORY_NAMES as CATEGORIES } from '../../constants/categories';
import { getCategoryGuidance } from '../../constants/verificationGuidance';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EntrepreneurDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const validTabs = ['details', 'services', 'availability', 'inquiries', 'orders'];
  const activeTab = validTabs.includes(urlTab) ? urlTab : 'details';

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const [business, setBusiness] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Form states for business details
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    category: '',
    description: '',
    experienceLevel: '',
    location: '',
    serviceArea: '',
    pricingRange: '',
  });

  // Business registration modal state (for no-business case)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newBusinessForm, setNewBusinessForm] = useState({
    businessName: '',
    category: CATEGORIES[0],
    description: '',
    experienceLevel: '',
    location: '',
    serviceArea: '',
    pricingRange: '',
    verificationDetails: '',
  });

  const [resubmitDetails, setResubmitDetails] = useState('');
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Service modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null for create, object for edit
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    availability: 'Available',
  });

  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  // Fetch entrepreneur's business and inquiries
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedBusinesses, fetchedInquiries] = await Promise.all([
        getEntrepreneurBusinesses(),
        getEntrepreneurInquiries(),
      ]);

      const ownedBusiness = Array.isArray(fetchedBusinesses) && fetchedBusinesses.length > 0
        ? fetchedBusinesses[0]
        : null;

      setBusiness(ownedBusiness);
      setInquiries(fetchedInquiries || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load entrepreneur dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch Orders ONLY when the Orders tab is active
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const fetchedOrders = await getEntrepreneurOrders();
      setOrders(fetchedOrders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError(err.message || 'Failed to load entrepreneur orders.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  // Sync business data into form states when business changes
  useEffect(() => {
    if (business) {
      setBusinessForm({
        businessName: business.businessName || '',
        category: business.category || '',
        description: business.description || '',
        experienceLevel: business.experienceLevel || '',
        location: business.location || '',
        serviceArea: business.serviceArea || '',
        pricingRange: business.pricingRange || '',
      });

      // Build 7-day schedule state from database availability
      const existingAvailMap = new Map();
      if (Array.isArray(business.availability)) {
        business.availability.forEach((a) => {
          existingAvailMap.set(a.dayOfWeek, a);
        });
      }

      const schedule = DAYS_OF_WEEK.map((day) => {
        const existing = existingAvailMap.get(day);
        return {
          dayOfWeek: day,
          isAvailable: existing ? existing.isAvailable : true,
          startTime: existing ? existing.startTime : '09:00 AM',
          endTime: existing ? existing.endTime : '07:00 PM',
        };
      });

      setWeeklySchedule(schedule);
    }
  }, [business]);

  const showSuccessNotice = (msg) => {
    setActionSuccess(msg);
    setActionError('');
  };

  const showErrorNotice = (msg) => {
    setActionError(msg);
    setActionSuccess('');
  };

  // --- BUSINESS DETAILS HANDLERS ---
  const handleUpdateBusinessSubmit = async (e) => {
    e.preventDefault();
    if (!business) return;
    setActionError('');
    setActionSuccess('');

    try {
      const updated = await updateBusiness(business.id, businessForm);
      setBusiness((prev) => ({ ...prev, ...updated }));
      showSuccessNotice('Business information updated successfully!');
    } catch (err) {
      showErrorNotice(err.message || 'Failed to update business details.');
    }
  };

  const handleRegisterBusinessSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    try {
      const created = await createBusiness(newBusinessForm);
      setBusiness(created);
      setIsRegisterModalOpen(false);
      showSuccessNotice('Business registered successfully! Submitted for admin verification.');
    } catch (err) {
      showErrorNotice(err.message || 'Failed to register business.');
    }
  };

  const handleResubmitVerification = async () => {
    if (!resubmitDetails.trim()) return;
    setIsResubmitting(true);
    setActionError('');
    setActionSuccess('');

    try {
      const res = await resubmitVerificationDetails(resubmitDetails.trim());
      if (res.data) {
        setBusiness(res.data);
      }
      showSuccessNotice('Verification details resubmitted for admin review!');
      setResubmitDetails('');
    } catch (err) {
      showErrorNotice(err.message || 'Failed to resubmit verification details.');
    } finally {
      setIsResubmitting(false);
    }
  };

  // --- SERVICES HANDLERS ---
  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        availability: service.availability || 'Available',
        imageUrl: service.imageUrl || '',
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        price: '',
        availability: 'Available',
        imageUrl: '',
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!business) return;
    setActionError('');
    setActionSuccess('');

    try {
      if (editingService) {
        const updated = await updateService(business.id, editingService.id, serviceForm);
        setBusiness((prev) => {
          const updatedServices = (prev.services || []).map((s) =>
            s.id === updated.id ? updated : s
          );
          return { ...prev, services: updatedServices };
        });
        showSuccessNotice('Service updated successfully!');
      } else {
        const created = await createService(business.id, serviceForm);
        setBusiness((prev) => ({
          ...prev,
          services: [...(prev.services || []), created],
        }));
        showSuccessNotice('New service added successfully!');
      }
      setIsServiceModalOpen(false);
    } catch (err) {
      showErrorNotice(err.message || 'Failed to save service.');
    }
  };

  // --- AVAILABILITY SCHEDULE HANDLERS ---
  const handleToggleDayAvailability = (dayIndex) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) =>
        idx === dayIndex ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleTimeChange = (dayIndex, field, value) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) =>
        idx === dayIndex ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveAvailability = async () => {
    if (!business) return;
    setActionError('');
    setActionSuccess('');

    for (const dayItem of weeklySchedule) {
      if (dayItem.isAvailable) {
        if (!dayItem.startTime || !dayItem.endTime || dayItem.startTime === '-' || dayItem.endTime === '-') {
          showErrorNotice(`Please specify valid start and end times for ${dayItem.dayOfWeek}.`);
          return;
        }
      }
    }

    try {
      const updatedList = await updateAvailability(business.id, weeklySchedule);
      setBusiness((prev) => ({ ...prev, availability: updatedList }));
      showSuccessNotice('Weekly availability schedule saved successfully!');
    } catch (err) {
      showErrorNotice(err.message || 'Failed to save availability schedule.');
    }
  };

  // --- INQUIRY STATUS HANDLER ---
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    setActionError('');
    setActionSuccess('');
    try {
      const updated = await updateInquiryStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === updated.id ? { ...inq, status: updated.status } : inq))
      );
      showSuccessNotice(`Inquiry status updated to ${newStatus}.`);
    } catch (err) {
      showErrorNotice(err.message || 'Failed to update inquiry status.');
    }
  };

  // --- ORDER STATUS UPDATE HANDLER ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionError('');
    setActionSuccess('');
    setUpdatingOrderId(orderId);
    try {
      await updateEntrepreneurOrderStatus(orderId, newStatus);
      showSuccessNotice(`Order #${orderId} status updated to ${newStatus}.`);
      await fetchOrders();
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showErrorNotice(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter inquiries for this business
  const businessInquiries = inquiries.filter(
    (inq) => business && inq.businessId === business.id
  );

  // Active Order Count (PENDING, ACCEPTED, PREPARING, READY only)
  const activeOrdersCount = orders.filter((o) =>
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
  ).length;

  // Filtered Orders List
  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  // Helper for Order Status Badge
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <Clock className="w-3 h-3 mr-1 text-amber-400" /> Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-500/40">
            <CheckCircle className="w-3 h-3 mr-1 text-sky-400" /> Accepted
          </span>
        );
      case 'PREPARING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40">
            <Clock className="w-3 h-3 mr-1 text-purple-400" /> Preparing
          </span>
        );
      case 'READY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
            <CheckCircle className="w-3 h-3 mr-1 text-indigo-400" /> Ready
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <Check className="w-3 h-3 mr-1 text-emerald-400" /> Completed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-500/40">
            <XCircle className="w-3 h-3 mr-1 text-red-400" /> Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-900/90 text-stone-400 border border-stone-700/50">
            <XCircle className="w-3 h-3 mr-1 text-stone-500" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-900/90 text-stone-400 border border-stone-700/50">
            {status}
          </span>
        );
    }
  };

  // Helper for Order Action Buttons based on state machine
  const renderOrderActionButtons = (order) => {
    const isUpdating = updatingOrderId === order.id;

    switch (order.status) {
      case 'PENDING':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept Order
            </button>
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'REJECTED')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject Order
            </button>
          </div>
        );
      case 'ACCEPTED':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5 mr-1" /> Start Preparing
            </button>
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-600 hover:bg-gray-700 text-white transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel Order
            </button>
          </div>
        );
      case 'PREPARING':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'READY')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Ready
            </button>
          </div>
        );
      case 'READY':
        return (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isUpdating}
              onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 mr-1" /> Complete Order
            </button>
          </div>
        );
      case 'COMPLETED':
      case 'REJECTED':
      case 'CANCELLED':
      default:
        return (
          <span className="text-xs font-medium text-brand-muted italic">
            Terminal State (No actions available)
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-brand-secondary mb-1">Loading Dashboard...</h3>
          <p className="text-sm text-brand-muted">Fetching your business profile and inquiries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Alerts */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
              {actionSuccess}
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-800">
              &times;
            </button>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
              {actionError}
            </div>
            <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-800">
              &times;
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
            <p>{error}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1">
                Entrepreneur Portal
              </span>
              <h1 className="text-2xl font-bold text-brand-secondary">
                {business ? business.businessName : 'Business Management Dashboard'}
              </h1>
              <p className="text-sm text-brand-muted mt-0.5">
                {business
                  ? `${business.category} • ${business.location}`
                  : 'Register your business to start receiving customer inquiries & orders.'}
              </p>
            </div>
            {!business && (
              <Button variant="primary" onClick={() => setIsRegisterModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Register Your Business
              </Button>
            )}
          </div>
        </div>

        {!business ? (
          /* NO BUSINESS STATE */
          <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-brand-secondary mb-2">No Business Profile Registered</h2>
            <p className="text-sm text-brand-muted mb-6 leading-relaxed">
              You haven't set up a business profile yet. Register your business today to list your services, set operating hours, and receive customer inquiries and orders.
            </p>
            <Button variant="primary" size="lg" onClick={() => setIsRegisterModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Register Business Profile
            </Button>
          </div>
        ) : (
          <div>
            {/* Tab Header Navigation */}
            <nav aria-label="Business dashboard section navigation" className="flex border-b border-brand-border mb-6 space-x-2 overflow-x-auto scroll-hint pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                aria-current={activeTab === 'details' ? 'page' : undefined}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-secondary'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Business Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                aria-current={activeTab === 'services' ? 'page' : undefined}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center cursor-pointer ${
                  activeTab === 'services'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-secondary'
                }`}
              >
                <Layers className="w-4 h-4 mr-2" />
                Services Offered ({business.services?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('availability')}
                aria-current={activeTab === 'availability' ? 'page' : undefined}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center cursor-pointer ${
                  activeTab === 'availability'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-secondary'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Operating Schedule
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                aria-current={activeTab === 'inquiries' ? 'page' : undefined}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-secondary'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Customer Inquiries ({businessInquiries.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                aria-current={activeTab === 'orders' ? 'page' : undefined}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-secondary'
                }`}
              >
                <Package className="w-4 h-4 mr-2" />
                Customer Orders {orders.length > 0 ? `(${activeOrdersCount})` : ''}
              </button>
            </nav>

            {/* TAB 1: BUSINESS DETAILS */}
            {activeTab === 'details' && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl font-bold text-brand-secondary">Business Information</h2>
                    <p className="text-xs text-brand-muted">Update public profile and coverage information for your business.</p>
                  </div>
                  <span className="text-xs font-mono text-brand-muted">ID: {business.id}</span>
                </div>

                {/* VERIFICATION STATUS CARD */}
                <div className="mb-8">
                  {(!business.verificationStatus || business.verificationStatus === 'APPROVED') && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm flex items-start space-x-4">
                      <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl flex-shrink-0">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-emerald-900 text-base">Business Verified</h3>
                          <span className="bg-emerald-200 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-md uppercase">Approved</span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-1">
                          Your business has been verified by the Aatmanirbhar Nari team. Your micro-enterprise is publicly listed in the business directory and discoverable by customers.
                        </p>
                      </div>
                    </div>
                  )}

                  {business.verificationStatus === 'PENDING' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm flex items-start space-x-4">
                      <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl flex-shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-amber-900 text-base">Verification Pending</h3>
                          <span className="bg-amber-200 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-md uppercase">Under Review</span>
                        </div>
                        <p className="text-xs text-amber-800 mt-1">
                          Your business profile is awaiting verification by our Admin team. Once approved, your business will automatically appear in public search results and listings.
                        </p>
                        {business.verificationDetails && (
                          <div className="mt-3 bg-white/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                            <span className="font-bold block mb-0.5">Submitted Verification Proof / Details:</span>
                            <p className="whitespace-pre-wrap text-amber-800">{business.verificationDetails}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {business.verificationStatus === 'REJECTED' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm flex items-start space-x-4">
                      <div className="bg-red-100 text-red-700 p-2.5 rounded-xl flex-shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-red-900 text-base">Verification Rejected</h3>
                          <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-md uppercase">Action Required</span>
                        </div>
                        <p className="text-xs text-red-800 mt-1">
                          Your business verification was not approved. Please review the reason below, update your details, and resubmit for admin review.
                        </p>

                        {business.verificationReason && (
                          <div className="mt-3 bg-red-100/60 border border-red-200 rounded-lg p-3 text-xs text-red-900">
                            <span className="font-bold block mb-0.5">Admin Rejection Reason:</span>
                            <p className="whitespace-pre-wrap">{business.verificationReason}</p>
                          </div>
                        )}

                        {/* RESUBMISSION FORM */}
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
                            Resubmit Verification Proof & Details
                          </h4>
                          <textarea
                            rows={3}
                            value={resubmitDetails}
                            onChange={(e) => setResubmitDetails(e.target.value)}
                            placeholder="Provide updated business details, location info, experience, or registration proof..."
                            className="w-full bg-white border border-red-300 rounded-lg p-3 text-xs text-brand-secondary focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isResubmitting || !resubmitDetails.trim()}
                            onClick={handleResubmitVerification}
                          >
                            {isResubmitting ? 'Submitting...' : 'Resubmit For Verification'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateBusinessSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={businessForm.category}
                        onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Location / Area *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessForm.location}
                        onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Service Area Coverage
                      </label>
                      <input
                        type="text"
                        value={businessForm.serviceArea}
                        onChange={(e) => setBusinessForm({ ...businessForm, serviceArea: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Pricing Range
                      </label>
                      <input
                        type="text"
                        value={businessForm.pricingRange}
                        onChange={(e) => setBusinessForm({ ...businessForm, pricingRange: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                        Experience Level
                      </label>
                      <input
                        type="text"
                        value={businessForm.experienceLevel}
                        onChange={(e) => setBusinessForm({ ...businessForm, experienceLevel: e.target.value })}
                        className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={businessForm.description}
                      onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                      className="w-full bg-brand-background border border-brand-border rounded-lg p-3.5 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-border">
                    <Button type="submit" variant="primary" className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: SERVICES OFFERED */}
            {activeTab === 'services' && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl font-bold text-brand-secondary">Services Offered</h2>
                    <p className="text-xs text-brand-muted">Manage the specific services, pricing, and descriptions for your business.</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleOpenServiceModal(null)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Service
                  </Button>
                </div>

                {!business.services || business.services.length === 0 ? (
                  <div className="py-12 text-center bg-brand-background/50 rounded-xl border border-dashed border-brand-border">
                    <Layers className="w-10 h-10 text-brand-muted mx-auto mb-2 opacity-60" />
                    <p className="text-sm font-semibold text-brand-secondary mb-1">No services added yet.</p>
                    <p className="text-xs text-brand-muted mb-4">Click below to add services your business offers to local customers.</p>
                    <Button variant="outline" size="sm" onClick={() => handleOpenServiceModal(null)}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {business.services.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-brand-background border border-brand-border rounded-xl p-4 flex flex-col justify-between hover:border-brand-primary/40 transition-colors shadow-2xs"
                      >
                        <div>
                          {srv.imageUrl && (
                            <div className="mb-3 overflow-hidden rounded-lg border border-brand-border/60 bg-brand-surface h-36 flex items-center justify-center">
                              <img
                                src={srv.imageUrl}
                                alt={srv.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.parentElement.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-brand-secondary text-sm leading-snug">{srv.name}</h3>
                            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded whitespace-nowrap">
                              {srv.price}
                            </span>
                          </div>
                          {srv.description && (
                            <p className="text-xs text-brand-muted line-clamp-3 mb-3 leading-relaxed">
                              {srv.description}
                            </p>
                          )}
                          {srv.availability && (
                            <div className="text-[11px] font-semibold text-brand-secondary/80 bg-brand-surface px-2.5 py-1 rounded border border-brand-border inline-block mb-3">
                              Turnaround: {srv.availability}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-brand-border/60 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenServiceModal(srv)}
                            className="text-xs"
                          >
                            <Edit3 className="w-3 h-3 mr-1" /> Edit Service
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: OPERATING SCHEDULE */}
            {activeTab === 'availability' && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl font-bold text-brand-secondary">Weekly Operating Schedule</h2>
                    <p className="text-xs text-brand-muted">Set your weekly business hours and available days for customers.</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {weeklySchedule.map((item, idx) => (
                    <div
                      key={item.dayOfWeek}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors gap-3 ${
                        item.isAvailable
                          ? 'bg-brand-background border-brand-border'
                          : 'bg-brand-background/40 border-brand-border/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-40">
                        <input
                          type="checkbox"
                          id={`day-${idx}`}
                          checked={item.isAvailable}
                          onChange={() => handleToggleDayAvailability(idx)}
                          className="w-4 h-4 text-brand-primary rounded border-brand-border focus:ring-brand-primary"
                        />
                        <label htmlFor={`day-${idx}`} className="text-sm font-bold text-brand-secondary cursor-pointer">
                          {item.dayOfWeek}
                        </label>
                      </div>

                      {item.isAvailable ? (
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-brand-muted font-semibold">From:</span>
                            <input
                              type="text"
                              value={item.startTime}
                              onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                              placeholder="09:00 AM"
                              className="bg-brand-surface border border-brand-border rounded px-2.5 py-1.5 text-xs text-brand-secondary w-28 focus:outline-none focus:border-brand-primary"
                            />
                          </div>
                          <span className="text-brand-muted font-bold">-</span>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-brand-muted font-semibold">To:</span>
                            <input
                              type="text"
                              value={item.endTime}
                              onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                              placeholder="07:00 PM"
                              className="bg-brand-surface border border-brand-border rounded px-2.5 py-1.5 text-xs text-brand-secondary w-28 focus:outline-none focus:border-brand-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-brand-muted italic">Closed / Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-brand-border">
                  <Button variant="primary" onClick={handleSaveAvailability} className="flex items-center">
                    <Save className="w-4 h-4 mr-2" /> Save Operating Schedule
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOMER INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl font-bold text-brand-secondary">Customer Inquiries</h2>
                    <p className="text-xs text-brand-muted">View and respond to direct service requests sent by local customers.</p>
                  </div>
                  <span className="text-xs font-semibold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">
                    {businessInquiries.length} Total Inquiries
                  </span>
                </div>

                {businessInquiries.length === 0 ? (
                  <div className="py-12 text-center bg-brand-background/50 rounded-xl border border-dashed border-brand-border">
                    <Mail className="w-10 h-10 text-brand-muted mx-auto mb-2 opacity-60" />
                    <p className="text-sm font-semibold text-brand-secondary mb-1">No customer inquiries received yet.</p>
                    <p className="text-xs text-brand-muted">When customers submit inquiry forms on your business page, they will show up here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businessInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-brand-background border border-brand-border rounded-xl p-5 hover:border-brand-primary/40 transition-colors shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border/60 mb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-brand-secondary text-base">{inq.customerName}</h3>
                              {inq.service?.name && (
                                <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                                  {inq.service.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-brand-muted mt-0.5">
                              Received on {new Date(inq.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              className="text-xs font-semibold rounded-lg bg-brand-surface border border-brand-border px-2.5 py-1.5 text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            >
                              <option value="PENDING">Status: PENDING</option>
                              <option value="ACCEPTED">Status: ACCEPTED</option>
                              <option value="REJECTED">Status: REJECTED</option>
                              <option value="COMPLETED">Status: COMPLETED</option>
                            </select>
                          </div>
                        </div>

                        {inq.message && (
                          <div className="text-xs text-brand-text bg-brand-surface p-3 rounded-lg border border-brand-border/50 mb-3 leading-relaxed">
                            "{inq.message}"
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-1">
                          {inq.customerPhone && (
                            <a
                              href={`tel:${inq.customerPhone}`}
                              className="flex items-center text-brand-primary hover:underline font-semibold"
                            >
                              <Phone className="w-3.5 h-3.5 mr-1" /> {inq.customerPhone}
                            </a>
                          )}
                          {inq.customerEmail && (
                            <a
                              href={`mailto:${inq.customerEmail}`}
                              className="flex items-center hover:text-brand-secondary"
                            >
                              <Mail className="w-3.5 h-3.5 mr-1" /> {inq.customerEmail}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header & Refresh */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-xl font-bold text-brand-secondary">Customer Orders</h2>
                    <p className="text-xs text-brand-muted">
                      Manage incoming orders for your business and update their status.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchOrders}
                      disabled={ordersLoading}
                      className="text-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1 ${ordersLoading ? 'animate-spin' : ''}`} />
                      Refresh Orders
                    </Button>
                  </div>
                </div>

                {/* Status Filter Bar */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-brand-border/60">
                  {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((status) => {
                    const count = status === 'ALL' ? orders.length : orders.filter((o) => o.status === status).length;
                    const isSelected = statusFilter === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-brand-background text-brand-text border-brand-border hover:bg-brand-surface'
                        }`}
                      >
                        {status === 'ALL' ? 'All Orders' : status} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Orders List / State Views */}
                {ordersLoading && (
                  <div className="py-16 text-center">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-brand-muted font-medium">Loading customer orders...</p>
                  </div>
                )}

                {!ordersLoading && ordersError && (
                  <div className="my-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                      {ordersError}
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchOrders} className="text-xs">
                      Retry
                    </Button>
                  </div>
                )}

                {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
                  <div className="py-16 text-center bg-brand-background/40 rounded-xl border border-dashed border-brand-border my-6">
                    <Package className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-bold text-brand-secondary mb-1">
                      {statusFilter === 'ALL' ? 'No Orders Received Yet' : `No Orders in ${statusFilter} Status`}
                    </h3>
                    <p className="text-xs text-brand-muted max-w-sm mx-auto">
                      {statusFilter === 'ALL'
                        ? 'When customers place orders for your services, they will appear here.'
                        : `There are currently no orders with the status "${statusFilter}".`}
                    </p>
                  </div>
                )}

                {!ordersLoading && !ordersError && filteredOrders.length > 0 && (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-brand-background border border-brand-border rounded-xl p-5 hover:border-brand-primary/40 transition-colors shadow-2xs"
                      >
                        {/* Order Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border/60 mb-4">
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-sm font-bold text-brand-secondary">
                                Order #{order.id}
                              </span>
                              {getOrderStatusBadge(order.status)}
                            </div>
                            <p className="text-xs text-brand-muted mt-1">
                              Placed on {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-brand-muted block">Total Amount</span>
                            <span className="text-lg font-bold text-brand-primary">
                              ₹{Number(order.totalAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Card Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          {/* Customer Details */}
                          <div className="space-y-2 text-xs">
                            <h4 className="font-bold text-brand-secondary uppercase tracking-wider text-[11px] flex items-center">
                              <User className="w-3.5 h-3.5 mr-1 text-brand-primary" /> Customer Details
                            </h4>
                            <p className="text-brand-text font-medium">{order.customer?.name || 'Customer'}</p>
                            {order.customer?.phone && (
                              <p className="text-brand-muted flex items-center">
                                <Phone className="w-3 h-3 mr-1" /> {order.customer.phone}
                              </p>
                            )}
                            {order.customer?.email && (
                              <p className="text-brand-muted flex items-center">
                                <Mail className="w-3 h-3 mr-1" /> {order.customer.email}
                              </p>
                            )}
                            <p className="text-brand-muted flex items-start mt-1">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-primary shrink-0 mt-0.5" />
                              <span>{order.deliveryAddress}</span>
                            </p>
                          </div>

                          {/* Items Summary */}
                          <div className="space-y-2 text-xs">
                            <h4 className="font-bold text-brand-secondary uppercase tracking-wider text-[11px]">
                              Ordered Items ({order.items?.length || 0})
                            </h4>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                              {order.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-brand-surface p-2 rounded border border-brand-border/50"
                                >
                                  <span className="font-medium text-brand-secondary truncate max-w-[180px]">
                                    {item.service?.name || `Service #${item.serviceId}`}
                                  </span>
                                  <span className="text-brand-muted font-mono text-[11px]">
                                    {item.quantity} x ₹{Number(item.unitPrice).toFixed(2)} = ₹
                                    {Number(item.itemTotal || item.quantity * item.unitPrice).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Card Actions */}
                        <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          {renderOrderActionButtons(order)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrderDetails(order)}
                            className="text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View Full Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* REGISTER BUSINESS MODAL */}
        {isRegisterModalOpen && !business && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-surface border border-brand-border rounded-xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                <h3 className="text-lg font-bold text-brand-secondary">Register Your Business</h3>
                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="text-brand-muted hover:text-brand-secondary text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterBusinessSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Business Name *
                  </label>
                  <SmoothInput
                    type="text"
                    required
                    placeholder="e.g. Sahana Tailoring Studio"
                    value={newBusinessForm.businessName}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, businessName: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={newBusinessForm.category}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, category: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Location / Area *
                  </label>
                  <SmoothInput
                    type="text"
                    required
                    placeholder="e.g. Gokul Road, Hubli"
                    value={newBusinessForm.location}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, location: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Service Area Coverage
                  </label>
                  <SmoothInput
                    type="text"
                    placeholder="e.g. Serving Gokul Road and Akshay Park"
                    value={newBusinessForm.serviceArea}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, serviceArea: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Pricing Range
                  </label>
                  <SmoothInput
                    type="text"
                    placeholder="e.g. Starts from ₹300"
                    value={newBusinessForm.pricingRange}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, pricingRange: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Experience Level
                  </label>
                  <SmoothInput
                    type="text"
                    placeholder="e.g. 8+ years experience"
                    value={newBusinessForm.experienceLevel}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, experienceLevel: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of your business..."
                    value={newBusinessForm.description}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, description: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg p-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                {/* VERIFICATION PROOF & DETAILS */}
                <div className="pt-2">
                  <div className="bg-brand-background/70 border border-brand-border/80 rounded-xl p-4 mb-3">
                    <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2 flex items-center">
                      <Clock className="w-4 h-4 text-brand-primary mr-1.5" />
                      {getCategoryGuidance(newBusinessForm.category).title}
                    </h4>
                    <p className="text-xs text-brand-muted mb-2">
                      Please provide details to help our Admin team verify your business:
                    </p>
                    <ul className="list-disc list-inside text-xs text-brand-text/90 space-y-1 mb-2">
                      {getCategoryGuidance(newBusinessForm.category).prompts.map((prompt, pIdx) => (
                        <li key={pIdx}>{prompt}</li>
                      ))}
                    </ul>
                  </div>

                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Verification Details / Proof *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={getCategoryGuidance(newBusinessForm.category).placeholder}
                    value={newBusinessForm.verificationDetails}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, verificationDetails: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg p-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                  <p className="text-[11px] text-brand-muted mt-1">
                    Your business will be submitted to the Admin team for review. It will become publicly visible once approved.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                  <Button type="button" variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Business
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SERVICE MODAL (ADD / EDIT) */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-surface border border-brand-border rounded-xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                <h3 className="text-lg font-bold text-brand-secondary">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="text-brand-muted hover:text-brand-secondary text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Service Name *
                  </label>
                  <SmoothInput
                    type="text"
                    required
                    placeholder="e.g. Designer Blouse Stitching"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Price Tag / Rate *
                  </label>
                  <SmoothInput
                    type="text"
                    required
                    placeholder="e.g. ₹450 - ₹800"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Availability / Turnaround Time
                  </label>
                  <SmoothInput
                    type="text"
                    placeholder="e.g. Monday - Saturday or 3-5 days delivery"
                    value={serviceForm.availability}
                    onChange={(e) => setServiceForm({ ...serviceForm, availability: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what is included in this service..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg p-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                    Service Image URL (Optional)
                  </label>
                  <SmoothInput
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={serviceForm.imageUrl || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                  <p className="text-[11px] text-brand-muted mt-1">
                    Direct image link for this service.
                  </p>
                  {serviceForm.imageUrl && serviceForm.imageUrl.trim() !== '' && (
                    <div className="mt-2 p-2 bg-brand-background border border-brand-border rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block mb-1">Preview</span>
                      <img
                        src={serviceForm.imageUrl.trim()}
                        alt="Service Preview"
                        className="max-h-28 rounded object-cover border border-brand-border/50"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                  <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingService ? 'Save Changes' : 'Add Service'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-surface border border-brand-border rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                <div>
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                    Order Details
                  </span>
                  <h3 className="text-xl font-bold text-brand-secondary">
                    Order #{selectedOrderDetails.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="text-brand-muted hover:text-brand-secondary text-2xl font-semibold leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                {/* Status & Date */}
                <div className="bg-brand-background p-4 rounded-lg border border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs text-brand-muted block">Status</span>
                    <div className="mt-1">{getOrderStatusBadge(selectedOrderDetails.status)}</div>
                  </div>
                  <div>
                    <span className="text-xs text-brand-muted block">Order Placed At</span>
                    <span className="text-xs font-medium text-brand-secondary">
                      {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Lifecycle Progression Tracker */}
                <div>
                  <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-3">
                    Status Progression
                  </h4>
                  {selectedOrderDetails.status === 'REJECTED' || selectedOrderDetails.status === 'CANCELLED' ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-medium">
                      This order was {selectedOrderDetails.status.toLowerCase()} and is in a terminal state.
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'].map((st, idx) => {
                        const statusOrder = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
                        const currentIdx = statusOrder.indexOf(selectedOrderDetails.status);
                        const isPassed = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;

                        return (
                          <div key={st} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                isCurrent
                                  ? 'bg-brand-primary text-white border-brand-primary'
                                  : isPassed
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-brand-background text-brand-muted border-brand-border'
                              }`}
                            >
                              {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span className="text-[10px] font-semibold text-brand-secondary mt-1 tracking-tight">
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Customer & Delivery Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-background p-4 rounded-lg border border-brand-border">
                  <div>
                    <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                      Customer Details
                    </h4>
                    <p className="text-xs font-semibold text-brand-secondary">{selectedOrderDetails.customer?.name}</p>
                    {selectedOrderDetails.customer?.phone && (
                      <p className="text-xs text-brand-muted mt-1">Phone: {selectedOrderDetails.customer.phone}</p>
                    )}
                    {selectedOrderDetails.customer?.email && (
                      <p className="text-xs text-brand-muted mt-0.5">Email: {selectedOrderDetails.customer.email}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-xs text-brand-text leading-relaxed">{selectedOrderDetails.deliveryAddress}</p>
                  </div>
                </div>

                {/* Itemized Services Table */}
                <div>
                  <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-3">
                    Ordered Services / Items
                  </h4>
                  <div className="border border-brand-border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-brand-background border-b border-brand-border text-brand-secondary uppercase font-semibold">
                        <tr>
                          <th className="p-3">Service</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Unit Price</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border">
                        {selectedOrderDetails.items?.map((item) => (
                          <tr key={item.id}>
                            <td className="p-3 font-medium text-brand-secondary">
                              {item.service?.name || `Service #${item.serviceId}`}
                            </td>
                            <td className="p-3 text-center text-brand-text">{item.quantity}</td>
                            <td className="p-3 text-right font-mono text-brand-text">₹{Number(item.unitPrice).toFixed(2)}</td>
                            <td className="p-3 text-right font-mono text-brand-secondary font-semibold">
                              ₹{Number(item.itemTotal || item.quantity * item.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-brand-background border-t border-brand-border font-bold">
                        <tr>
                          <td colSpan={3} className="p-3 text-right text-brand-secondary uppercase">
                            Total Amount
                          </td>
                          <td className="p-3 text-right font-mono text-brand-primary text-sm">
                            ₹{Number(selectedOrderDetails.totalAmount).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  {renderOrderActionButtons(selectedOrderDetails)}
                  <Button variant="outline" onClick={() => setSelectedOrderDetails(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
