import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Users,
  Building2,
  Package,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  Filter,
  UserCheck,
  Briefcase,
  Layers,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  getAdminStats,
  getAdminUsers,
  getAdminBusinesses,
  getAdminOrders,
  getAdminInquiries,
  getBusinessVerifications,
  approveBusinessVerification,
  rejectBusinessVerification,
} from '../../services/api';
import { getCategoryGuidance } from '../../constants/verificationGuidance';
import Button from '../../components/common/Button';

// Render Status Badge for Orders
const renderOrderStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full">
          Accepted
        </span>
      );
    case 'PREPARING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full">
          Preparing
        </span>
      );
    case 'READY':
      return (
        <span className="inline-flex items-center text-xs font-bold text-teal-800 bg-teal-100 border border-teal-300 px-2.5 py-0.5 rounded-full">
          Ready
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
          Completed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-full">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-full">
          {status}
        </span>
      );
  }
};

// Render Status Badge for Inquiries
const renderInquiryStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full">
          Accepted
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-full">
          {status}
        </span>
      );
  }
};

// Render Role Badge
const renderRoleBadge = (role) => {
  switch (role) {
    case 'ADMIN':
      return (
        <span className="inline-flex items-center text-xs font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded">
          ADMIN
        </span>
      );
    case 'ENTREPRENEUR':
      return (
        <span className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/30 px-2 py-0.5 rounded">
          ENTREPRENEUR
        </span>
      );
    case 'CUSTOMER':
      return (
        <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
          CUSTOMER
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded">
          {role}
        </span>
      );
  }
};

const renderVerificationStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
          Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-full">
          {status}
        </span>
      );
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Users State
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Businesses State
  const [businesses, setBusinesses] = useState([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [businessesError, setBusinessesError] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Verifications State
  const [verifications, setVerifications] = useState([]);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState('ALL');
  const [pendingCount, setPendingCount] = useState(0);
  const [verificationsLoading, setVerificationsLoading] = useState(false);
  const [verificationsError, setVerificationsError] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchVerifications = useCallback(async (statusFilter) => {
    setVerificationsLoading(true);
    setVerificationsError(null);
    try {
      const res = await getBusinessVerifications({ status: statusFilter });
      setVerifications(res.data || []);
      if (typeof res.pendingCount === 'number') {
        setPendingCount(res.pendingCount);
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setVerificationsError(err.message || 'Failed to load business verifications.');
    } finally {
      setVerificationsLoading(false);
    }
  }, []);

  const handleApproveVerification = async (id, reason = '') => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await approveBusinessVerification(id, reason);
      setActionSuccess(res.message || 'Business approved successfully!');
      setSelectedVerification(null);
      fetchVerifications(verificationStatusFilter);
      fetchStats();
    } catch (err) {
      setActionError(err.message || 'Failed to approve business.');
    }
  };

  const handleRejectVerification = async (id) => {
    if (!rejectionReasonInput.trim()) {
      setActionError('Rejection reason is required.');
      return;
    }
    setActionError('');
    setActionSuccess('');
    try {
      const res = await rejectBusinessVerification(id, rejectionReasonInput.trim());
      setActionSuccess(res.message || 'Business verification rejected.');
      setSelectedVerification(null);
      setRejectionReasonInput('');
      fetchVerifications(verificationStatusFilter);
      fetchStats();
    } catch (err) {
      setActionError(err.message || 'Failed to reject business verification.');
    }
  };

  // Fetch Overview Stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setStatsError(err.message || 'Failed to load platform statistics.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async (role) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = await getAdminUsers(role);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setUsersError(err.message || 'Failed to load platform users.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch Businesses
  const fetchBusinesses = useCallback(async () => {
    setBusinessesLoading(true);
    setBusinessesError(null);
    try {
      const data = await getAdminBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error('Error fetching admin businesses:', err);
      setBusinessesError(err.message || 'Failed to load platform businesses.');
    } finally {
      setBusinessesLoading(false);
    }
  }, []);

  // Fetch Orders
  const fetchOrders = useCallback(async (status) => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await getAdminOrders(status);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setOrdersError(err.message || 'Failed to load platform orders.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async (status) => {
    setInquiriesLoading(true);
    setInquiriesError(null);
    try {
      const data = await getAdminInquiries(status);
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
      setInquiriesError(err.message || 'Failed to load platform inquiries.');
    } finally {
      setInquiriesLoading(false);
    }
  }, []);

  // Initial Load & Tab switching effects
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(userRoleFilter);
    }
  }, [activeTab, userRoleFilter, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'businesses') {
      fetchBusinesses();
    }
  }, [activeTab, fetchBusinesses]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(orderStatusFilter);
    }
  }, [activeTab, orderStatusFilter, fetchOrders]);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries(inquiryStatusFilter);
    }
  }, [activeTab, inquiryStatusFilter, fetchInquiries]);

  useEffect(() => {
    fetchVerifications('ALL');
  }, [fetchVerifications]);

  useEffect(() => {
    if (activeTab === 'verifications') {
      fetchVerifications(verificationStatusFilter);
    }
  }, [activeTab, verificationStatusFilter, fetchVerifications]);

  // Refresh current view
  const handleRefreshCurrent = () => {
    fetchStats();
    fetchVerifications(verificationStatusFilter);
    if (activeTab === 'users') fetchUsers(userRoleFilter);
    if (activeTab === 'businesses') fetchBusinesses();
    if (activeTab === 'orders') fetchOrders(orderStatusFilter);
    if (activeTab === 'inquiries') fetchInquiries(inquiryStatusFilter);
  };

  return (
    <div className="bg-brand-background min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-brand-secondary">
                  Admin Dashboard
                </h1>
                <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-2 py-0.5 rounded uppercase">
                  Platform Admin
                </span>
              </div>
              <p className="text-sm text-brand-muted mt-0.5">
                Comprehensive platform overview, business verifications, and data management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshCurrent}
              className="text-xs flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-brand-border flex overflow-x-auto space-x-2 pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'verifications'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Business Verification
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'users'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
            {stats && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {stats.totalUsers}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'businesses'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Businesses
            {stats && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {stats.totalBusinesses}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Orders
            {stats && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {stats.totalOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Inquiries
            {stats && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {stats.totalInquiries}
              </span>
            )}
          </button>
        </div>

        {/* SECTION A: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-brand-secondary flex items-center">
              <Layers className="w-5 h-5 mr-2 text-brand-primary" />
              Platform Overview Statistics
            </h2>

            {statsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border rounded-xl p-5 animate-pulse h-28"></div>
                ))}
              </div>
            ) : statsError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{statsError}</p>
                <Button variant="outline" size="sm" onClick={fetchStats} className="ml-auto text-xs">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Total Users</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalUsers || 0}</p>
                  </div>
                </div>

                {/* Customers */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Customers</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalCustomers || 0}</p>
                  </div>
                </div>

                {/* Entrepreneurs */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Entrepreneurs</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalEntrepreneurs || 0}</p>
                  </div>
                </div>

                {/* Admins */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Admins</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalAdmins || 0}</p>
                  </div>
                </div>

                {/* Businesses */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Businesses</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalBusinesses || 0}</p>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Orders</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalOrders || 0}</p>
                  </div>
                </div>

                {/* Inquiries */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex items-center space-x-4 sm:col-span-2 lg:col-span-2">
                  <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Customer Inquiries</p>
                    <p className="text-2xl font-extrabold text-brand-secondary">{stats?.totalInquiries || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION: BUSINESS VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold">{actionSuccess}</span>
                <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold">{actionError}</span>
                <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-brand-primary" />
                  Business Verification Requests
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Review submitted verification details and approve genuine women-led micro-enterprises
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-brand-surface border border-brand-border p-1 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-brand-muted ml-2 mr-1" />
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setVerificationStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      verificationStatusFilter === st
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-brand-text hover:bg-brand-background'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {verificationsLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-brand-secondary">Loading business verifications...</p>
              </div>
            ) : verificationsError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{verificationsError}</p>
              </div>
            ) : verifications.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <Shield className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-brand-secondary mb-1">No verifications found</h3>
                <p className="text-xs text-brand-muted">No business records matched your current verification status filter.</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
                        <th className="py-3 px-4">Business & Owner</th>
                        <th className="py-3 px-4">Category & Location</th>
                        <th className="py-3 px-4">Submitted Date</th>
                        <th className="py-3 px-4">Verification Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-sm">
                      {verifications.map((item) => (
                        <tr key={item.id} className="hover:bg-brand-background/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-brand-secondary text-sm">{item.businessName}</p>
                            <p className="text-xs text-brand-muted">{item.ownerName} ({item.owner?.email || 'N/A'})</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold text-brand-primary bg-brand-surface px-2 py-0.5 rounded border border-brand-border block w-fit mb-0.5">
                              {item.category}
                            </span>
                            <span className="text-xs text-brand-muted">{item.location}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="py-3.5 px-4">
                            {renderVerificationStatusBadge(item.verificationStatus)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVerification(item);
                                setRejectionReasonInput('');
                                setActionError('');
                              }}
                              className="text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <Users className="w-5 h-5 mr-2 text-brand-primary" />
                  Registered Users
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Safe user directory excluding authentication credentials
                </p>
              </div>

              {/* Role Filters */}
              <div className="flex items-center space-x-1.5 bg-brand-surface border border-brand-border p-1 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-brand-muted ml-2 mr-1" />
                {['ALL', 'CUSTOMER', 'ENTREPRENEUR', 'ADMIN'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      userRoleFilter === role
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-brand-text hover:bg-brand-background'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {usersLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-brand-secondary">Loading users list...</p>
              </div>
            ) : usersError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{usersError}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <Users className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-brand-secondary mb-1">No users found</h3>
                <p className="text-xs text-brand-muted">No user accounts matched your current role filter.</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
                        <th className="py-3.5 px-4">User ID</th>
                        <th className="py-3.5 px-4">Full Name</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-sm">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-muted">#{u.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-brand-secondary">{u.name}</td>
                          <td className="py-3.5 px-4 text-brand-text flex items-center">
                            <Mail className="w-3.5 h-3.5 text-brand-muted mr-1.5" />
                            {u.email}
                          </td>
                          <td className="py-3.5 px-4">{renderRoleBadge(u.role)}</td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">{formatDate(u.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION C: BUSINESSES */}
        {activeTab === 'businesses' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-brand-primary" />
                Platform Businesses
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                All registered women-led micro-enterprises across categories
              </p>
            </div>

            {businessesLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-brand-secondary">Loading businesses list...</p>
              </div>
            ) : businessesError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{businessesError}</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <Building2 className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-brand-secondary mb-1">No businesses found</h3>
                <p className="text-xs text-brand-muted">There are no businesses registered on the platform yet.</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
                        <th className="py-3.5 px-4">Business ID</th>
                        <th className="py-3.5 px-4">Business Name</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Owner Name</th>
                        <th className="py-3.5 px-4">Owner Email</th>
                        <th className="py-3.5 px-4">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-sm">
                      {businesses.map((b) => (
                        <tr key={b.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-muted">#{b.id}</td>
                          <td className="py-3.5 px-4 font-bold text-brand-secondary">{b.businessName}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                              {b.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-brand-text text-xs">
                            <span className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 text-brand-muted mr-1" />
                              {b.location}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-brand-secondary">
                            {b.owner?.name || b.ownerName || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-brand-text">
                            {b.owner?.email || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">{formatDate(b.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION D: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <Package className="w-5 h-5 mr-2 text-brand-primary" />
                  Platform Orders
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Read-only view of all orders placed across businesses
                </p>
              </div>

              {/* Order Status Filters */}
              <div className="flex items-center space-x-1.5 bg-brand-surface border border-brand-border p-1 rounded-lg overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-brand-muted ml-2 mr-1 flex-shrink-0" />
                {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-brand-text hover:bg-brand-background'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-brand-secondary">Loading orders list...</p>
              </div>
            ) : ordersError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{ordersError}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <Package className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-brand-secondary mb-1">No orders found</h3>
                <p className="text-xs text-brand-muted">No customer orders matched your selected status filter.</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Business</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Order Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-sm">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-muted">#{o.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-brand-secondary">{o.customer?.name || o.customerName}</div>
                            <div className="text-xs text-brand-muted">{o.customer?.email || ''}</div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-brand-secondary">
                            {o.business?.businessName || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-brand-primary">
                            ₹{parseFloat(o.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">{renderOrderStatusBadge(o.status)}</td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">{formatDate(o.createdAt)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-2.5 py-1 rounded-lg transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION E: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-brand-primary" />
                  Customer Inquiries
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Read-only view of customer service inquiries
                </p>
              </div>

              {/* Inquiry Status Filters */}
              <div className="flex items-center space-x-1.5 bg-brand-surface border border-brand-border p-1 rounded-lg overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-brand-muted ml-2 mr-1 flex-shrink-0" />
                {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                      inquiryStatusFilter === st
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-brand-text hover:bg-brand-background'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {inquiriesLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-brand-secondary">Loading inquiries list...</p>
              </div>
            ) : inquiriesError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{inquiriesError}</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center">
                <MessageSquare className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-brand-secondary mb-1">No inquiries found</h3>
                <p className="text-xs text-brand-muted">No customer inquiries matched your selected status filter.</p>
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-background border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider">
                        <th className="py-3.5 px-4">Inquiry ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Business</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-sm">
                      {inquiries.map((iq) => (
                        <tr key={iq.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-muted">#{iq.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-brand-secondary">{iq.customer?.name || iq.customerName}</div>
                            <div className="text-xs text-brand-muted">{iq.customerEmail || iq.customer?.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-brand-secondary">
                            {iq.business?.businessName || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-brand-primary">
                            {iq.service?.name || 'Service'}
                          </td>
                          <td className="py-3.5 px-4">{renderInquiryStatusBadge(iq.status)}</td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">{formatDate(iq.createdAt)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedInquiry(iq)}
                              className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-2.5 py-1 rounded-lg transition-colors"
                              title="View Inquiry Details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* READ-ONLY ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-brand-surface border border-brand-border rounded-xl max-w-xl w-full p-6 shadow-xl relative my-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-brand-secondary hover:bg-brand-background transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-brand-border pb-4 mb-4">
              <Package className="w-6 h-6 text-brand-primary" />
              <div>
                <h3 className="text-lg font-bold text-brand-secondary">Order Inspection #{selectedOrder.id}</h3>
                <p className="text-xs text-brand-muted">Read-Only Platform Order View</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-brand-background p-3.5 rounded-lg border border-brand-border">
                <div>
                  <span className="text-xs font-semibold text-brand-muted block uppercase">Status</span>
                  <div className="mt-1">{renderOrderStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-muted block uppercase">Order Date</span>
                  <div className="text-xs font-medium text-brand-secondary mt-1">{formatDate(selectedOrder.createdAt)}</div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-brand-background p-3.5 rounded-lg border border-brand-border space-y-1">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">Customer Summary</span>
                <div className="font-semibold text-brand-secondary">{selectedOrder.customerName || selectedOrder.customer?.name}</div>
                {selectedOrder.customer?.email && <div className="text-xs text-brand-muted">Email: {selectedOrder.customer.email}</div>}
                {selectedOrder.customerPhone && <div className="text-xs text-brand-muted">Phone: {selectedOrder.customerPhone}</div>}
                {selectedOrder.deliveryAddress && (
                  <div className="text-xs text-brand-text flex items-start mt-1 pt-1 border-t border-brand-border/60">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary mr-1 flex-shrink-0 mt-0.5" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="bg-brand-background p-3.5 rounded-lg border border-brand-border space-y-1">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">Business Summary</span>
                <div className="font-semibold text-brand-secondary">{selectedOrder.business?.businessName || 'N/A'}</div>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center bg-brand-primary/10 border border-brand-primary/20 p-3.5 rounded-lg">
                <span className="font-bold text-brand-secondary text-sm">Total Order Value</span>
                <span className="text-xl font-extrabold text-brand-primary">
                  ₹{parseFloat(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* READ-ONLY INQUIRY DETAIL MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-brand-surface border border-brand-border rounded-xl max-w-xl w-full p-6 shadow-xl relative my-8">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-brand-secondary hover:bg-brand-background transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-brand-border pb-4 mb-4">
              <MessageSquare className="w-6 h-6 text-brand-primary" />
              <div>
                <h3 className="text-lg font-bold text-brand-secondary">Inquiry Inspection #{selectedInquiry.id}</h3>
                <p className="text-xs text-brand-muted">Read-Only Platform Inquiry View</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-brand-background p-3.5 rounded-lg border border-brand-border">
                <div>
                  <span className="text-xs font-semibold text-brand-muted block uppercase">Status</span>
                  <div className="mt-1">{renderInquiryStatusBadge(selectedInquiry.status)}</div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-muted block uppercase">Submitted Date</span>
                  <div className="text-xs font-medium text-brand-secondary mt-1">{formatDate(selectedInquiry.createdAt)}</div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="bg-brand-background p-3.5 rounded-lg border border-brand-border space-y-1">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">Customer Details</span>
                <div className="font-semibold text-brand-secondary">{selectedInquiry.customerName || selectedInquiry.customer?.name}</div>
                {selectedInquiry.customerEmail && <div className="text-xs text-brand-muted">Email: {selectedInquiry.customerEmail}</div>}
                {selectedInquiry.customerPhone && <div className="text-xs text-brand-muted">Phone: {selectedInquiry.customerPhone}</div>}
              </div>

              {/* Business & Service */}
              <div className="bg-brand-background p-3.5 rounded-lg border border-brand-border space-y-1">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">Target Business & Service</span>
                <div className="font-semibold text-brand-secondary">{selectedInquiry.business?.businessName || 'N/A'}</div>
                <div className="text-xs font-bold text-brand-primary">{selectedInquiry.service?.name} ({selectedInquiry.service?.price})</div>
              </div>

              {/* Inquiry Message */}
              <div className="bg-brand-background p-3.5 rounded-lg border border-brand-border">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Message Content
                </span>
                <p className="text-sm text-brand-text whitespace-pre-wrap leading-relaxed mt-1">
                  {selectedInquiry.message || 'No message provided.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION DETAIL & APPROVAL/REJECTION MODAL */}
      {selectedVerification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVerification(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-brand-secondary hover:bg-brand-background transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-brand-border pb-4 mb-4">
              <Shield className="w-6 h-6 text-brand-primary" />
              <div>
                <h3 className="text-lg font-bold text-brand-secondary">
                  Verification Review: {selectedVerification.businessName}
                </h3>
                <p className="text-xs text-brand-muted">Review submitted details and verify women-led micro-business</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-brand-text">
              {/* Business Overview */}
              <div className="grid grid-cols-2 gap-3 bg-brand-background p-3.5 rounded-xl border border-brand-border">
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Category:</span>
                  <span className="font-semibold text-brand-primary">{selectedVerification.category}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Location:</span>
                  <span>{selectedVerification.location}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Owner Name:</span>
                  <span className="font-semibold">{selectedVerification.ownerName}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Owner Contact:</span>
                  <span>{selectedVerification.owner?.email || 'N/A'} {selectedVerification.owner?.phone ? `• ${selectedVerification.owner.phone}` : ''}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px] mb-1">Business Description:</span>
                <p className="bg-brand-background p-3 rounded-lg border border-brand-border text-brand-secondary">{selectedVerification.description || 'No description provided.'}</p>
              </div>

              {/* Guidance reference for Category */}
              <div className="bg-brand-background/70 border border-brand-border/80 rounded-xl p-3.5">
                <h4 className="font-bold text-brand-secondary uppercase tracking-wider text-[11px] mb-1">
                  {getCategoryGuidance(selectedVerification.category).title}
                </h4>
                <ul className="list-disc list-inside text-[11px] text-brand-muted space-y-0.5">
                  {getCategoryGuidance(selectedVerification.category).prompts.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Submitted Proof / Details */}
              <div>
                <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px] mb-1">
                  Submitted Verification Proof & Details:
                </span>
                <p className="bg-amber-50/80 border border-amber-200 text-amber-950 p-3.5 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {selectedVerification.verificationDetails || 'No verification details submitted.'}
                </p>
              </div>

              {/* Current Status */}
              <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                <span className="font-bold text-brand-secondary text-xs">Current Verification Status:</span>
                {renderVerificationStatusBadge(selectedVerification.verificationStatus)}
              </div>

              {selectedVerification.verificationReason && (
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs">
                  <span className="font-bold block text-gray-700 mb-0.5">Existing Admin Note / Reason:</span>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedVerification.verificationReason}</p>
                </div>
              )}

              {/* Rejection Form & Actions */}
              <div className="pt-3 border-t border-brand-border space-y-3">
                <div>
                  <label className="block font-bold text-brand-secondary uppercase tracking-wider text-[10px] mb-1">
                    Rejection Reason (Required if Rejecting):
                  </label>
                  <textarea
                    rows={2}
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    placeholder="Provide clear reason if rejecting (e.g., missing location proof or incomplete details)..."
                    className="w-full bg-brand-background border border-brand-border rounded-lg p-2.5 text-xs text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVerification(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectVerification(selectedVerification.id)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject Verification
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveVerification(selectedVerification.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Approve Business
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
