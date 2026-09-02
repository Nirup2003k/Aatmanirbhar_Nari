const express = require('express');
const router = express.Router();
const {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  createService,
  updateService,
  updateAvailability,
  createInquiry,
} = require('../controllers/businessController');
const { authenticateToken, optionalAuth, authorizeRoles } = require('../middleware/authMiddleware');

// Public GET routes
router.get('/', getAllBusinesses);
router.get('/:id', optionalAuth, getBusinessById);

// Protected Entrepreneur Business routes
router.post('/', authenticateToken, authorizeRoles('ENTREPRENEUR'), createBusiness);
router.put('/:id', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateBusiness);

// Protected Entrepreneur Service routes
router.post('/:id/services', authenticateToken, authorizeRoles('ENTREPRENEUR'), createService);
router.put('/:id/services/:serviceId', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateService);

// Protected Entrepreneur Availability route
router.put('/:id/availability', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateAvailability);

// Public/Legacy Inquiry route
router.post('/:id/inquiries', createInquiry);

module.exports = router;
