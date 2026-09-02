const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminUsers,
  getAdminBusinesses,
  getAdminOrders,
  getAdminInquiries,
  getBusinessVerifications,
  getBusinessVerificationById,
  approveBusiness,
  rejectBusiness,
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/businesses', getAdminBusinesses);
router.get('/orders', getAdminOrders);
router.get('/inquiries', getAdminInquiries);

// Business Verification endpoints
router.get('/business-verifications', getBusinessVerifications);
router.get('/business-verifications/:id', getBusinessVerificationById);
router.patch('/business-verifications/:id/approve', approveBusiness);
router.patch('/business-verifications/:id/reject', rejectBusiness);

module.exports = router;
