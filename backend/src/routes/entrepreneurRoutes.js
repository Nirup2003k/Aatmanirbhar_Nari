const express = require('express');
const router = express.Router();
const {
  getEntrepreneurBusinesses,
  getEntrepreneurInquiries,
  getEntrepreneurOrders,
  getEntrepreneurOrderById,
  updateOrderStatus,
  updateVerificationDetails,
} = require('../controllers/entrepreneurController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/businesses', authenticateToken, authorizeRoles('ENTREPRENEUR'), getEntrepreneurBusinesses);
router.put('/business/verification', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateVerificationDetails);
router.get('/inquiries', authenticateToken, authorizeRoles('ENTREPRENEUR'), getEntrepreneurInquiries);
router.get('/orders', authenticateToken, authorizeRoles('ENTREPRENEUR'), getEntrepreneurOrders);
router.get('/orders/:id', authenticateToken, authorizeRoles('ENTREPRENEUR'), getEntrepreneurOrderById);
router.patch('/orders/:id/status', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateOrderStatus);

module.exports = router;
