import { CATEGORY_MAP } from '../constants/categories';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch list of businesses from backend with search and filter parameters
 * @param {Object} params - { search, location, category, availability }
 */
export async function getBusinesses(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.search && params.search.trim()) {
    queryParams.set('search', params.search.trim());
  }

  if (params.location && params.location.trim()) {
    queryParams.set('location', params.location.trim());
  }

  if (params.category && params.category !== 'all') {
    const categoryName = CATEGORY_MAP[params.category] || params.category;
    queryParams.set('category', categoryName);
  }

  if (params.availability && params.availability !== 'all') {
    queryParams.set('availability', params.availability);
  }

  const url = `${API_BASE_URL}/businesses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to load businesses from API (${response.status})`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch a single business details by ID from backend
 * @param {string|number} id
 */
export async function getBusinessById(id) {
  const url = `${API_BASE_URL}/businesses/${id}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (response.status === 404) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Business not found');
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`Failed to load business details (${response.status})`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data;
}

/**
 * Send an inquiry to the backend (Requires Customer Authentication)
 * @param {Object} inquiryData - { businessId, serviceId, customerName, customerEmail, customerPhone, message }
 */
export async function createInquiry(inquiryData) {
  const url = `${API_BASE_URL}/inquiries`;

  const payload = {
    businessId: parseInt(inquiryData.businessId, 10),
    serviceId: parseInt(inquiryData.serviceId, 10),
    customerName: inquiryData.customerName,
    customerEmail: inquiryData.customerEmail,
    customerPhone: inquiryData.customerPhone,
    message: inquiryData.message,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || response.status !== 201) {
    const error = new Error(data.message || `Failed to send inquiry (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Register a new User (CUSTOMER or ENTREPRENEUR)
 * @param {Object} userData - { name, email, phone, password, role }
 */
export async function registerUser(userData) {
  const url = `${API_BASE_URL}/auth/register`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || response.status !== 201) {
    const error = new Error(data.message || 'Registration failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Login an existing User
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const url = `${API_BASE_URL}/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || response.status !== 200) {
    const error = new Error(data.message || 'Invalid email or password');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Logout current User
 */
export async function logoutUser() {
  const url = `${API_BASE_URL}/auth/logout`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Logout failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Fetch current authenticated user profile
 */
export async function getCurrentUser() {
  const url = `${API_BASE_URL}/auth/me`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch auth state (${response.status})`);
  }

  const data = await response.json();
  return data.data || null;
}

/**
 * Fetch all businesses owned by the authenticated entrepreneur
 */
export async function getEntrepreneurBusinesses() {
  const url = `${API_BASE_URL}/entrepreneur/businesses`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch entrepreneur businesses (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Create a new business for the authenticated entrepreneur
 * @param {Object} businessData
 */
export async function createBusiness(businessData) {
  const url = `${API_BASE_URL}/businesses`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(businessData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || response.status !== 201) {
    const error = new Error(data.message || `Failed to create business (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Update an existing business owned by the authenticated entrepreneur
 * @param {number|string} id
 * @param {Object} businessData
 */
export async function updateBusiness(id, businessData) {
  const url = `${API_BASE_URL}/businesses/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(businessData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to update business (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Add a new service to an owned business
 * @param {number|string} businessId
 * @param {Object} serviceData
 */
export async function createService(businessId, serviceData) {
  const url = `${API_BASE_URL}/businesses/${businessId}/services`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(serviceData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || response.status !== 201) {
    const error = new Error(data.message || `Failed to create service (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Update an existing service of an owned business
 * @param {number|string} businessId
 * @param {number|string} serviceId
 * @param {Object} serviceData
 */
export async function updateService(businessId, serviceId, serviceData) {
  const url = `${API_BASE_URL}/businesses/${businessId}/services/${serviceId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(serviceData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to update service (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Update 7-day operating availability schedule for an owned business
 * @param {number|string} businessId
 * @param {Array} availabilityData - List of { dayOfWeek, isAvailable, startTime, endTime }
 */
export async function updateAvailability(businessId, availabilityData) {
  const url = `${API_BASE_URL}/businesses/${businessId}/availability`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ availability: availabilityData }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to update availability schedule (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Fetch inquiries for all businesses owned by the authenticated entrepreneur
 */
export async function getEntrepreneurInquiries() {
  const url = `${API_BASE_URL}/entrepreneur/inquiries`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch inquiries (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Update inquiry status (PENDING, ACCEPTED, REJECTED, COMPLETED)
 * @param {number|string} inquiryId
 * @param {string} status
 */
export async function updateInquiryStatus(inquiryId, status) {
  const url = `${API_BASE_URL}/inquiries/${inquiryId}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to update inquiry status (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Fetch orders for all businesses owned by the authenticated entrepreneur
 */
export async function getEntrepreneurOrders() {
  const url = `${API_BASE_URL}/entrepreneur/orders`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch entrepreneur orders (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Fetch detailed view of an entrepreneur order by ID
 * @param {number|string} id
 */
export async function getEntrepreneurOrderById(id) {
  const url = `${API_BASE_URL}/entrepreneur/orders/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch entrepreneur order details (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Update entrepreneur order status
 * @param {number|string} id
 * @param {string} status
 */
export async function updateEntrepreneurOrderStatus(id, status) {
  const url = `${API_BASE_URL}/entrepreneur/orders/${id}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to update order status (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}


/**
 * Create a new customer order
 * @param {Object} orderData - { businessId, deliveryAddress, items: [{ serviceId, quantity }] }
 */
export async function createOrder(orderData) {
  const url = `${API_BASE_URL}/orders`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(orderData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || response.status !== 201) {
    const error = new Error(data.message || `Failed to create order (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Fetch all orders for authenticated customer
 */
export async function getCustomerOrders() {
  const url = `${API_BASE_URL}/orders`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch customer orders (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Fetch detailed view of a customer order by ID
 * @param {number|string} id
 */
export async function getCustomerOrderById(id) {
  const url = `${API_BASE_URL}/orders/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch order details (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Cancel a PENDING or ACCEPTED customer order
 * @param {number|string} id
 */
export async function cancelOrder(id) {
  const url = `${API_BASE_URL}/orders/${id}/cancel`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to cancel order (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Fetch platform overview statistics for admin
 */
export async function getAdminStats() {
  const url = `${API_BASE_URL}/admin/stats`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch admin stats (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Fetch platform users for admin
 * @param {string} [role] Optional role filter (CUSTOMER, ENTREPRENEUR, ADMIN)
 */
export async function getAdminUsers(role) {
  const queryParams = new URLSearchParams();
  if (role && role !== 'ALL') {
    queryParams.set('role', role);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch admin users (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Fetch all platform businesses for admin
 */
export async function getAdminBusinesses() {
  const url = `${API_BASE_URL}/admin/businesses`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch admin businesses (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Fetch platform orders for admin
 * @param {string} [status] Optional status filter
 */
export async function getAdminOrders(status) {
  const queryParams = new URLSearchParams();
  if (status && status !== 'ALL') {
    queryParams.set('status', status);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/admin/orders${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch admin orders (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Fetch platform inquiries for admin
 * @param {string} [status] Optional status filter
 */
export async function getAdminInquiries(status) {
  const queryParams = new URLSearchParams();
  if (status && status !== 'ALL') {
    queryParams.set('status', status);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/admin/inquiries${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch admin inquiries (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data || [];
}

/**
 * Update and resubmit business verification details for entrepreneur
 * @param {string} verificationDetails
 */
export async function resubmitVerificationDetails(verificationDetails) {
  const response = await fetch(`${API_BASE_URL}/entrepreneur/business/verification`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ verificationDetails }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to submit verification details.');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Fetch business verifications list for admin
 * @param {Object} params - { status }
 */
export async function getBusinessVerifications(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.status && params.status !== 'ALL') {
    queryParams.set('status', params.status);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/admin/business-verifications${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch business verifications (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Fetch specific business verification profile for admin
 * @param {number|string} id
 */
export async function getBusinessVerificationById(id) {
  const response = await fetch(`${API_BASE_URL}/admin/business-verifications/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Failed to fetch business verification details (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data.data;
}

/**
 * Approve business verification
 * @param {number|string} id
 * @param {string} [verificationReason]
 */
export async function approveBusinessVerification(id, verificationReason = '') {
  const response = await fetch(`${API_BASE_URL}/admin/business-verifications/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ verificationReason }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to approve business.');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Reject business verification
 * @param {number|string} id
 * @param {string} rejectionReason
 */
export async function rejectBusinessVerification(id, rejectionReason) {
  const response = await fetch(`${API_BASE_URL}/admin/business-verifications/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ rejectionReason }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to reject business.');
    error.status = response.status;
    throw error;
  }

  return data;
}
