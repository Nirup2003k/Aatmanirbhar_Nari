const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { handleConnection } = require('../services/realtimeService');

router.get('/stream', authenticateToken, handleConnection);

module.exports = router;
