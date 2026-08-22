const express = require('express');
const router = express.Router();
const { createInquiry, updateInquiryStatus } = require('../controllers/inquiryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('CUSTOMER'), createInquiry);
router.patch('/:id/status', authenticateToken, authorizeRoles('ENTREPRENEUR'), updateInquiryStatus);

module.exports = router;
