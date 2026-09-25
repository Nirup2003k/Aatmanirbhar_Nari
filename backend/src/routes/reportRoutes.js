const express = require('express');
const router = express.Router();
const { createReport, getCustomerReports } = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken, authorizeRoles('CUSTOMER'));

router.post('/', createReport);
router.get('/', getCustomerReports);

module.exports = router;
