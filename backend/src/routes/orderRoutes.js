const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('CUSTOMER'), createOrder);
router.get('/', authenticateToken, authorizeRoles('CUSTOMER'), getCustomerOrders);
router.get('/:id', authenticateToken, authorizeRoles('CUSTOMER'), getCustomerOrderById);
router.patch('/:id/cancel', authenticateToken, authorizeRoles('CUSTOMER'), cancelOrder);

module.exports = router;
