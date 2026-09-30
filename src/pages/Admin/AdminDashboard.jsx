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
  AlertTriangle,
  Tag,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  BookOpen,
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
  getAdminReports,
  updateAdminReportStatus,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  toggleAdminCategoryStatus,
  deleteAdminCategory,
  getAdminLearningResources,
  createAdminLearningResource,
  updateAdminLearningResource,
  toggleAdminLearningResourceStatus,
  deleteAdminLearningResource,
} from '../../services/api';
import { getCategoryGuidance } from '../../constants/verificationGuidance';
import Button from '../../components/common/Button';

// Render Status Badge for Orders
const renderOrderStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
          Accepted
        </span>
      );
    case 'PREPARING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
          Preparing
        </span>
      );
    case 'READY':
      return (
        <span className="inline-flex items-center text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-500/40 px-2.5 py-0.5 rounded-full">
          Ready
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
          Completed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-300 bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
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
        <span className="inline-flex items-center text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
          Accepted
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-300 bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
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
        <span className="inline-flex items-center text-xs font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded">
          ADMIN
        </span>
      );
    case 'ENTREPRENEUR':
      return (
        <span className="inline-flex items-center text-xs font-bold text-[#c5a059] bg-[#c5a059]/15 border border-[#c5a059]/30 px-2 py-0.5 rounded">
          ENTREPRENEUR
        </span>
      );
    case 'CUSTOMER':
      return (
        <span className="inline-flex items-center text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/40 px-2 py-0.5 rounded">
          CUSTOMER
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2 py-0.5 rounded">
          {role}
        </span>
      );
  }
};

const renderVerificationStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
          Pending
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
          Approved
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-300 bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 rounded-full">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
          {status}
        </span>
      );
  }
};

// Render Status Badge for Reports
const renderReportStatusBadge = (status) => {
  switch (status) {
    case 'OPEN':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
          Open
        </span>
      );
    case 'REVIEWED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
          Reviewed
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
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

  // Reports State
  const [reports, setReports] = useState([]);
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updatingReportId, setUpdatingReportId] = useState(null);

  // Categories State
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Store',
    isActive: true,
  });
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState('');

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const data = await getAdminCategories();
      setCategoriesList(data || []);
    } catch (err) {
      console.error('Error fetching admin categories:', err);
      setCategoriesError(err.message || 'Failed to load categories.');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const handleOpenCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Store',
      isActive: true,
    });
    setCategoryFormError('');
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'Store',
      isActive: cat.isActive,
    });
    setCategoryFormError('');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setCategorySubmitting(true);
    setCategoryFormError('');
    setActionSuccess('');
    setActionError('');
    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, categoryFormData);
        setActionSuccess(`Category "${categoryFormData.name}" updated successfully.`);
      } else {
        await createAdminCategory(categoryFormData);
        setActionSuccess(`Category "${categoryFormData.name}" created successfully.`);
      }
      setCategoryModalOpen(false);
      fetchCategories();
    } catch (err) {
      setCategoryFormError(err.message || 'Failed to save category.');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleToggleCategoryStatus = async (cat) => {
    setActionSuccess('');
    setActionError('');
    try {
      await toggleAdminCategoryStatus(cat.id, !cat.isActive);
      setActionSuccess(`Category "${cat.name}" status updated.`);
      fetchCategories();
    } catch (err) {
      setActionError(err.message || 'Failed to update category status.');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete or deactivate category "${cat.name}"?`)) return;
    setActionSuccess('');
    setActionError('');
    try {
      const res = await deleteAdminCategory(cat.id);
      setActionSuccess(res.message || `Category "${cat.name}" deleted.`);
      fetchCategories();
    } catch (err) {
      setActionError(err.message || 'Failed to delete category.');
    }
  };

  // Learning Resources State
  const [learningList, setLearningList] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState(null);
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [editingLearning, setEditingLearning] = useState(null);
  const [learningFormData, setLearningFormData] = useState({
    title: '',
    slug: '',
    category: 'Business Basics',
    description: '',
    summary: '',
    readTime: '5 min read',
    author: 'Aatmanirbhar Nari Team',
    isPublished: true,
    keyTakeaways: [''],
    sections: [{ heading: '', content: '' }],
  });
  const [learningSubmitting, setLearningSubmitting] = useState(false);
  const [learningFormError, setLearningFormError] = useState('');

  const fetchLearningList = useCallback(async () => {
    setLearningLoading(true);
    setLearningError(null);
    try {
      const data = await getAdminLearningResources();
      setLearningList(data || []);
    } catch (err) {
      console.error('Error fetching admin learning resources:', err);
      setLearningError(err.message || 'Failed to load learning resources.');
    } finally {
      setLearningLoading(false);
    }
  }, []);

  const handleOpenCreateLearningModal = () => {
    setEditingLearning(null);
    setLearningFormData({
      title: '',
      slug: '',
      category: 'Business Basics',
      description: '',
      summary: '',
      readTime: '5 min read',
      author: 'Aatmanirbhar Nari Team',
      isPublished: true,
      keyTakeaways: [''],
      sections: [{ heading: '', content: '' }],
    });
    setLearningFormError('');
    setLearningModalOpen(true);
  };

  const handleOpenEditLearningModal = (article) => {
    setEditingLearning(article);
    setLearningFormData({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'Business Basics',
      description: article.description || '',
      summary: article.summary || '',
      readTime: article.readTime || '5 min read',
      author: article.author || 'Aatmanirbhar Nari Team',
      isPublished: article.isPublished ?? true,
      keyTakeaways: Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 ? article.keyTakeaways : [''],
      sections: Array.isArray(article.sections) && article.sections.length > 0 ? article.sections : [{ heading: '', content: '' }],
    });
    setLearningFormError('');
    setLearningModalOpen(true);
  };

  const handleSaveLearning = async (e) => {
    e.preventDefault();
    setLearningSubmitting(true);
    setLearningFormError('');
    setActionSuccess('');
    setActionError('');
    try {
      const payload = {
        ...learningFormData,
        keyTakeaways: learningFormData.keyTakeaways.filter((k) => k.trim() !== ''),
        sections: learningFormData.sections.filter((s) => s.heading.trim() !== '' || s.content.trim() !== ''),
      };

      if (editingLearning) {
        await updateAdminLearningResource(editingLearning.id, payload);
        setActionSuccess(`Learning article "${learningFormData.title}" updated successfully.`);
      } else {
        await createAdminLearningResource(payload);
        setActionSuccess(`Learning article "${learningFormData.title}" created successfully.`);
      }
      setLearningModalOpen(false);
      fetchLearningList();
    } catch (err) {
      setLearningFormError(err.message || 'Failed to save learning article.');
    } finally {
      setLearningSubmitting(false);
    }
  };

  const handleToggleLearningStatus = async (article) => {
    setActionSuccess('');
    setActionError('');
    try {
      await toggleAdminLearningResourceStatus(article.id, !article.isPublished);
      setActionSuccess(`Article "${article.title}" published status updated.`);
      fetchLearningList();
    } catch (err) {
      setActionError(err.message || 'Failed to update article status.');
    }
  };

  const handleDeleteLearning = async (article) => {
    if (!window.confirm(`Are you sure you want to delete learning article "${article.title}"?`)) return;
    setActionSuccess('');
    setActionError('');
    try {
      const res = await deleteAdminLearningResource(article.id);
      setActionSuccess(res.message || `Article "${article.title}" deleted.`);
      fetchLearningList();
    } catch (err) {
      setActionError(err.message || 'Failed to delete learning article.');
    }
  };

  const handleAddKeyTakeaway = () => {
    setLearningFormData((prev) => ({
      ...prev,
      keyTakeaways: [...prev.keyTakeaways, ''],
    }));
  };

  const handleRemoveKeyTakeaway = (index) => {
    setLearningFormData((prev) => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== index),
    }));
  };

  const handleKeyTakeawayChange = (index, value) => {
    setLearningFormData((prev) => {
      const updated = [...prev.keyTakeaways];
      updated[index] = value;
      return { ...prev, keyTakeaways: updated };
    });
  };

  const handleAddSection = () => {
    setLearningFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: '', content: '' }],
    }));
  };

  const handleRemoveSection = (index) => {
    setLearningFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setLearningFormData((prev) => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const fetchReports = useCallback(async (statusFilter) => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const data = await getAdminReports(statusFilter);
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReportsError(err.message || 'Failed to load reports.');
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    setUpdatingReportId(reportId);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await updateAdminReportStatus(reportId, newStatus);
      setActionSuccess(res.message || 'Report status updated successfully.');
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update report status.');
    } finally {
      setUpdatingReportId(null);
    }
  };

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

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports(reportStatusFilter);
    }
  }, [activeTab, reportStatusFilter, fetchReports]);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, fetchCategories]);

  useEffect(() => {
    if (activeTab === 'learning') {
      fetchLearningList();
    }
  }, [activeTab, fetchLearningList]);

  // Escape key handler for open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (categoryModalOpen) setCategoryModalOpen(false);
        else if (learningModalOpen) setLearningModalOpen(false);
        else if (selectedOrder) setSelectedOrder(null);
        else if (selectedInquiry) setSelectedInquiry(null);
        else if (selectedVerification) setSelectedVerification(null);
        else if (selectedReport) setSelectedReport(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoryModalOpen, learningModalOpen, selectedOrder, selectedInquiry, selectedVerification, selectedReport]);

  // Refresh current view
  const handleRefreshCurrent = () => {
    fetchStats();
    fetchVerifications(verificationStatusFilter);
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'learning') fetchLearningList();
    if (activeTab === 'users') fetchUsers(userRoleFilter);
    if (activeTab === 'businesses') fetchBusinesses();
    if (activeTab === 'orders') fetchOrders(orderStatusFilter);
    if (activeTab === 'inquiries') fetchInquiries(inquiryStatusFilter);
    if (activeTab === 'reports') fetchReports(reportStatusFilter);
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
        <nav aria-label="Admin dashboard section navigation" className="border-b border-brand-border flex overflow-x-auto space-x-2 pb-2 scroll-hint">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            aria-current={activeTab === 'overview' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            aria-current={activeTab === 'verifications' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
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
            type="button"
            onClick={() => setActiveTab('users')}
            aria-current={activeTab === 'users' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
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
            type="button"
            onClick={() => setActiveTab('businesses')}
            aria-current={activeTab === 'businesses' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
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
            type="button"
            onClick={() => setActiveTab('orders')}
            aria-current={activeTab === 'orders' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
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
            type="button"
            onClick={() => setActiveTab('inquiries')}
            aria-current={activeTab === 'inquiries' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
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

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            aria-current={activeTab === 'reports' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" />
            Reports
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            aria-current={activeTab === 'categories' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <Tag className="w-4 h-4 mr-2 text-brand-primary" />
            Categories
            {categoriesList.length > 0 && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {categoriesList.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learning')}
            aria-current={activeTab === 'learning' ? 'page' : undefined}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold flex items-center whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'learning'
                ? 'bg-brand-surface text-brand-primary border-t-2 border-x border-b-0 border-brand-primary shadow-xs'
                : 'text-brand-text hover:text-brand-primary hover:bg-brand-surface/50'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2 text-brand-primary" />
            Learning Content
            {learningList.length > 0 && (
              <span className="ml-2 bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {learningList.length}
              </span>
            )}
          </button>
        </nav>

        {/* SECTION A: OVERVIEW & KPIs */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Platform Key Performance Indicators (KPIs) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-brand-secondary flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-brand-primary" />
                    Platform Key Performance Indicators (KPIs)
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Real-time production metric calculations derived directly from database records
                  </p>
                </div>
                {stats?.period?.label && (
                  <span className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full w-fit">
                    Active Period: {stats.period.label}
                  </span>
                )}
              </div>

              {statsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-brand-surface border border-brand-border rounded-xl p-5 animate-pulse h-36"></div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* KPI 1: Registered Entrepreneurs */}
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">KPI 1 • Registered Entrepreneurs</p>
                        <h3 className="text-3xl font-extrabold text-brand-secondary mt-1">
                          {stats?.registeredEntrepreneurs ?? stats?.totalEntrepreneurs ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                        <Briefcase className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-brand-border/60">
                      Active registered entrepreneur accounts (excluding customer & admin accounts)
                    </p>
                  </div>

                  {/* KPI 2: Active Listings */}
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">KPI 2 • Active Listings</p>
                        <h3 className="text-3xl font-extrabold text-brand-secondary mt-1">
                          {stats?.activeListings ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-brand-border/60">
                      Approved & publicly visible business listings under platform verification rules
                    </p>
                  </div>

                  {/* KPI 3: Inquiry Rate */}
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">KPI 3 • Inquiry Rate</p>
                        <h3 className="text-3xl font-extrabold text-brand-secondary mt-1">
                          {stats?.inquiryRate?.percentage ?? 0}%
                        </h3>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-brand-border/60">
                      <p className="text-xs font-semibold text-brand-secondary">
                        {stats?.inquiryRate?.activeBusinessesWithInquiry ?? 0} of {stats?.inquiryRate?.totalActiveBusinesses ?? 0} active businesses received inquiries
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {stats?.inquiryRate?.inquiries ?? 0} total inquiries in {stats?.period?.label ?? 'current month'}
                      </p>
                    </div>
                  </div>

                  {/* KPI 4: Monthly Active Users (MAU) */}
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">KPI 4 • Monthly Active Users (MAU)</p>
                        <h3 className="text-3xl font-extrabold text-brand-secondary mt-1">
                          {stats?.monthlyActiveUsers ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-brand-border/60">
                      Distinct authenticated customers & entrepreneurs active in {stats?.period?.label ?? 'current month'}
                    </p>
                  </div>

                  {/* KPI 5: Profile Completion */}
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-brand-primary/30 transition-all sm:col-span-2 lg:col-span-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">KPI 5 • Profile Completion</p>
                        <div className="flex items-baseline space-x-3 mt-1">
                          <h3 className="text-3xl font-extrabold text-brand-secondary">
                            {stats?.profileCompletion?.averagePercentage ?? 0}%
                          </h3>
                          <span className="text-xs font-semibold text-brand-muted">Average score</span>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-brand-secondary">
                        {stats?.profileCompletion?.completeProfiles ?? 0} of {stats?.profileCompletion?.totalProfiles ?? 0} entrepreneurs have 100% complete business profiles
                      </p>
                      <p className="text-xs text-brand-muted">
                        Evaluated across 9 required business profile fields
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Platform Counts */}
            <div className="space-y-4 pt-4 border-t border-brand-border">
              <h2 className="text-md font-bold text-brand-secondary">
                Additional Platform Statistics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-xs flex items-center space-x-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Total Users</p>
                    <p className="text-xl font-extrabold text-brand-secondary">{stats?.totalUsers || 0}</p>
                  </div>
                </div>

                {/* Customers */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-xs flex items-center space-x-3">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-lg border border-teal-100">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Customers</p>
                    <p className="text-xl font-extrabold text-brand-secondary">{stats?.totalCustomers || 0}</p>
                  </div>
                </div>

                {/* Admins */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-xs flex items-center space-x-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Admins</p>
                    <p className="text-xl font-extrabold text-brand-secondary">{stats?.totalAdmins || 0}</p>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-brand-surface border border-brand-border rounded-xl p-4 shadow-xs flex items-center space-x-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Orders</p>
                    <p className="text-xl font-extrabold text-brand-secondary">{stats?.totalOrders || 0}</p>
                  </div>
                </div>
              </div>
            </div>
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

        {/* TAB 6: REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
              <div>
                <h2 className="text-xl font-bold text-brand-secondary flex items-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
                  Customer Reports Oversight
                </h2>
                <p className="text-xs text-brand-muted">Review and manage platform complaints and report tickets.</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-2 bg-brand-background border border-brand-border p-1 rounded-xl">
                {['ALL', 'OPEN', 'REVIEWED', 'RESOLVED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setReportStatusFilter(st);
                      fetchReports(st);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      reportStatusFilter === st
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-brand-muted hover:text-brand-secondary hover:bg-brand-surface'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {reportsLoading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-brand-muted">Loading reports...</p>
              </div>
            ) : reportsError ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 text-center">
                {reportsError}
              </div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center bg-brand-background/50 rounded-xl border border-dashed border-brand-border">
                <AlertTriangle className="w-8 h-8 text-brand-muted mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-brand-secondary mb-1">No reports found.</p>
                <p className="text-xs text-brand-muted">No reports match the selected status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border text-xs font-bold text-brand-muted uppercase tracking-wider bg-brand-background/60">
                      <th className="py-3.5 px-4">Report ID</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4">Target Type & Info</th>
                      <th className="py-3.5 px-4">Reporter</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-sm">
                    {reports.map((rpt) => {
                      let targetInfo = 'N/A';
                      if (rpt.business) targetInfo = `Business: ${rpt.business.businessName}`;
                      else if (rpt.order) targetInfo = `Order #${rpt.order.id}`;
                      else if (rpt.inquiry) targetInfo = `Inquiry #${rpt.inquiry.id}`;

                      return (
                        <tr key={rpt.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-muted">#R-{rpt.id}</td>
                          <td className="py-3.5 px-4 font-bold text-brand-secondary">{rpt.reason}</td>
                          <td className="py-3.5 px-4 text-xs font-medium text-brand-primary">{targetInfo}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-brand-secondary">{rpt.reporter?.name || 'Customer'}</div>
                            <div className="text-xs text-brand-muted">{rpt.reporter?.email}</div>
                          </td>
                          <td className="py-3.5 px-4">{renderReportStatusBadge(rpt.status)}</td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">{formatDate(rpt.createdAt)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedReport(rpt)}
                              className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-2.5 py-1 rounded-lg transition-colors"
                              title="Inspect Report Details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {/* READ-ONLY ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div role="dialog" aria-modal="true" aria-labelledby="admin-order-modal-title" className="bg-brand-surface border border-brand-border rounded-xl max-w-xl w-full p-6 shadow-xl relative my-8 max-h-[85vh] overflow-y-auto">
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
                <h3 id="admin-order-modal-title" className="text-lg font-bold text-brand-secondary">Order Inspection #{selectedOrder.id}</h3>
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
          <div role="dialog" aria-modal="true" aria-labelledby="admin-inquiry-modal-title" className="bg-brand-surface border border-brand-border rounded-xl max-w-xl w-full p-6 shadow-xl relative my-8 max-h-[85vh] overflow-y-auto">
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
                <h3 id="admin-inquiry-modal-title" className="text-lg font-bold text-brand-secondary">Inquiry Inspection #{selectedInquiry.id}</h3>
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
          <div role="dialog" aria-modal="true" aria-labelledby="admin-verification-modal-title" className="bg-brand-surface border border-brand-border rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[90vh] overflow-y-auto">
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
                <h3 id="admin-verification-modal-title" className="text-lg font-bold text-brand-secondary">
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

      {/* REPORT INSPECTION & STATUS CHANGE MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div role="dialog" aria-modal="true" aria-labelledby="admin-report-modal-title" className="bg-brand-surface border border-brand-border rounded-xl max-w-lg w-full p-6 shadow-xl relative my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-brand-secondary hover:bg-brand-background transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-brand-border pb-4 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 id="admin-report-modal-title" className="text-lg font-bold text-brand-secondary">Report Inspection #R-{selectedReport.id}</h3>
                <p className="text-xs text-brand-muted">Platform Complaint Details & Status Action</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-brand-text">
              <div className="grid grid-cols-2 gap-3 bg-brand-background p-3.5 rounded-xl border border-brand-border">
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Current Status:</span>
                  <div className="mt-1">{renderReportStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Reported Date:</span>
                  <span className="mt-1 block text-brand-muted">{formatDate(selectedReport.createdAt)}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Reason:</span>
                  <span className="font-bold text-amber-300">{selectedReport.reason}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">Reporter Info:</span>
                  <span className="font-medium text-brand-secondary block">{selectedReport.reporter?.name}</span>
                  <span className="text-brand-muted">{selectedReport.reporter?.email}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px] mb-1">Target Object Details:</span>
                <div className="bg-brand-background p-3 rounded-lg border border-brand-border text-brand-secondary font-medium">
                  {selectedReport.business && <div>Business: <strong>{selectedReport.business.businessName}</strong> ({selectedReport.business.category})</div>}
                  {selectedReport.order && <div>Order: <strong>#{selectedReport.order.id}</strong> (Total: ₹{Number(selectedReport.order.totalAmount).toFixed(2)}, Status: {selectedReport.order.status})</div>}
                  {selectedReport.inquiry && <div>Inquiry: <strong>#{selectedReport.inquiry.id}</strong> (Message: "{selectedReport.inquiry.message}")</div>}
                </div>
              </div>

              <div>
                <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px] mb-1">Description / Additional Notes:</span>
                <p className="bg-brand-background p-3 rounded-lg border border-brand-border text-brand-secondary min-h-[60px] whitespace-pre-wrap">
                  {selectedReport.description || 'No additional description provided.'}
                </p>
              </div>

              {/* Status Action Controls */}
              <div className="pt-3 border-t border-brand-border space-y-2">
                <span className="font-bold text-brand-secondary block uppercase tracking-wider text-[10px]">
                  Admin Status Transition:
                </span>

                {selectedReport.status === 'RESOLVED' ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-emerald-300 text-xs text-center font-semibold">
                    This report has been RESOLVED (Terminal State).
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {selectedReport.status === 'OPEN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingReportId === selectedReport.id}
                        onClick={() => handleUpdateReportStatus(selectedReport.id, 'REVIEWED')}
                        className="text-xs border-sky-500/40 text-sky-300 hover:bg-sky-950/50"
                      >
                        Mark as REVIEWED
                      </Button>
                    )}
                    {(selectedReport.status === 'OPEN' || selectedReport.status === 'REVIEWED') && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updatingReportId === selectedReport.id}
                        onClick={() => handleUpdateReportStatus(selectedReport.id, 'RESOLVED')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Mark as RESOLVED
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold">{actionSuccess}</span>
                <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold">{actionError}</span>
                <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-brand-primary" />
                  Platform Category Management
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Manage official marketplace categories, active status toggles, and business counts.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateCategoryModal}
                className="text-xs flex items-center shadow-md font-bold self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Category
              </Button>
            </div>

            {categoriesLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center animate-pulse text-brand-muted text-sm">
                Loading categories...
              </div>
            ) : categoriesError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{categoriesError}</p>
                <Button variant="outline" size="sm" onClick={fetchCategories} className="ml-auto text-xs">
                  Retry
                </Button>
              </div>
            ) : categoriesList.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center text-brand-muted text-sm">
                No categories found in system. Click "Add New Category" to create one.
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-brand-text">
                    <thead className="bg-brand-background text-brand-secondary font-bold text-xs uppercase tracking-wider border-b border-brand-border">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Category Name & Slug</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Assigned Businesses</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60 font-medium">
                      {categoriesList.map((cat, index) => (
                        <tr key={cat.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 text-xs font-mono text-brand-muted">{index + 1}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-brand-secondary text-sm">{cat.name}</div>
                            <div className="text-[11px] font-mono text-brand-muted">{cat.slug}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted max-w-xs truncate">
                            {cat.description || 'No description provided.'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {cat.isActive ? (
                              <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-background border border-brand-border px-2.5 py-1 rounded-md">
                              {cat.businessCount || 0} business(es)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryStatus(cat)}
                                title={cat.isActive ? 'Deactivate Category' : 'Activate Category'}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                  cat.isActive
                                    ? 'border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
                                    : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                                }`}
                              >
                                {cat.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategoryModal(cat)}
                                title="Edit Category"
                                className="p-1.5 rounded-lg border border-brand-border text-brand-text hover:text-brand-primary hover:bg-brand-background transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                title="Delete Category"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Category Create / Edit Modal */}
        {categoryModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          >
            <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <h3 id="category-modal-title" className="text-lg font-extrabold text-brand-secondary flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-brand-primary" />
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="p-1 text-brand-muted hover:text-brand-secondary rounded-lg hover:bg-brand-background"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {categoryFormError && (
                <div role="alert" className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{categoryFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCategory} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Handmade Pottery"
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. handmade-pottery (auto-generated if empty)"
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief summary of services offered under this category..."
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFormData.isActive}
                      onChange={(e) => setCategoryFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-brand-secondary">Active & Visible in Marketplace</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCategoryModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={categorySubmitting}
                    className="text-xs font-bold shadow-md"
                  >
                    {categorySubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SECTION G: LEARNING CONTENT MANAGEMENT */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold">{actionSuccess}</span>
                <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <span className="text-xs font-semibold">{actionError}</span>
                <button onClick={() => setActionError('')} className="text-red-600 hover:text-red-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-secondary flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-brand-primary" />
                  Learning Content Management
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Manage educational guides, articles, draft statuses, and resources for entrepreneurs and customers.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateLearningModal}
                className="text-xs flex items-center shadow-md font-bold self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Learning Article
              </Button>
            </div>

            {learningLoading ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center animate-pulse text-brand-muted text-sm">
                Loading learning resources...
              </div>
            ) : learningError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{learningError}</p>
                <Button variant="outline" size="sm" onClick={fetchLearningList} className="ml-auto text-xs">
                  Retry
                </Button>
              </div>
            ) : learningList.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center text-brand-muted text-sm">
                No learning articles found in database. Click "Add Learning Article" to create one.
              </div>
            ) : (
              <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-brand-text">
                    <thead className="bg-brand-background text-brand-secondary font-bold text-xs uppercase tracking-wider border-b border-brand-border">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Article Title & Slug</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Read Time & Author</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60 font-medium">
                      {learningList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-brand-background/50 transition-colors">
                          <td className="py-3.5 px-4 text-xs font-mono text-brand-muted">{index + 1}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-brand-secondary text-sm">{item.title}</div>
                            <div className="text-[11px] font-mono text-brand-muted">{item.slug}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-brand-muted">
                            <div>{item.readTime || '5 min read'}</div>
                            <div className="text-[11px] font-medium text-brand-secondary">{item.author || 'Aatmanirbhar Nari Team'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.isPublished ? (
                              <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-bold text-stone-400 bg-stone-900/90 border border-stone-700/50 px-2.5 py-0.5 rounded-full">
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => handleToggleLearningStatus(item)}
                                title={item.isPublished ? 'Unpublish Article' : 'Publish Article'}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                  item.isPublished
                                    ? 'border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
                                    : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                                }`}
                              >
                                {item.isPublished ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditLearningModal(item)}
                                title="Edit Article"
                                className="p-1.5 rounded-lg border border-brand-border text-brand-text hover:text-brand-primary hover:bg-brand-background transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLearning(item)}
                                title="Delete Article"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Learning Article Create / Edit Modal */}
        {learningModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="learning-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          >
            <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <h3 id="learning-modal-title" className="text-lg font-extrabold text-brand-secondary flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-brand-primary" />
                  {editingLearning ? 'Edit Learning Article' : 'Create New Learning Article'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLearningModalOpen(false)}
                  className="p-1 text-brand-muted hover:text-brand-secondary rounded-lg hover:bg-brand-background"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {learningFormError && (
                <div role="alert" className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{learningFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveLearning} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                      Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={learningFormData.title}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Starting Your Home Business"
                      className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                      URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      value={learningFormData.slug}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="e.g. starting-your-home-business"
                      className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={learningFormData.category}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Business Basics"
                      className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={learningFormData.readTime}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                      placeholder="e.g. 5 min read"
                      className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={learningFormData.author}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="e.g. Aatmanirbhar Nari Team"
                      className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                    Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={learningFormData.summary}
                    onChange={(e) => setLearningFormData((prev) => ({ ...prev, summary: e.target.value }))}
                    placeholder="Short overview card summary for Learning Hub preview..."
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-1">
                    Full Description / Intro
                  </label>
                  <textarea
                    rows={3}
                    value={learningFormData.description}
                    onChange={(e) => setLearningFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed introduction text for full article view..."
                    className="w-full bg-brand-background border border-brand-border rounded-lg px-3.5 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none"
                  />
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2 pt-2 border-t border-brand-border/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary">
                      Key Takeaways
                    </label>
                    <button
                      type="button"
                      onClick={handleAddKeyTakeaway}
                      className="text-xs text-brand-primary font-bold hover:underline flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Takeaway
                    </button>
                  </div>
                  {learningFormData.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={takeaway}
                        onChange={(e) => handleKeyTakeawayChange(idx, e.target.value)}
                        placeholder={`Takeaway #${idx + 1}`}
                        className="flex-1 bg-brand-background border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-secondary focus:border-brand-primary focus:outline-none"
                      />
                      {learningFormData.keyTakeaways.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyTakeaway(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300"
                          title="Remove takeaway"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Content Sections */}
                <div className="space-y-3 pt-2 border-t border-brand-border/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary">
                      Content Sections
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="text-xs text-brand-primary font-bold hover:underline flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
                    </button>
                  </div>
                  {learningFormData.sections.map((sec, idx) => (
                    <div key={idx} className="bg-brand-background p-3 rounded-xl border border-brand-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-primary">Section #{idx + 1}</span>
                        {learningFormData.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Section
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                        placeholder="Section Heading"
                        className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-secondary focus:border-brand-primary focus:outline-none font-bold"
                      />
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                        placeholder="Section Content paragraphs..."
                        className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-secondary focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-3 pt-2 border-t border-brand-border/60">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={learningFormData.isPublished}
                      onChange={(e) => setLearningFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-brand-secondary">Publish Immediately (Visible in Learning Hub)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLearningModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={learningSubmitting}
                    className="text-xs font-bold shadow-md"
                  >
                    {learningSubmitting ? 'Saving...' : editingLearning ? 'Update Resource' : 'Create Resource'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
