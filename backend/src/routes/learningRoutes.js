const express = require('express');
const router = express.Router();
const {
  getLearningResources,
  getLearningResourceBySlugOrId,
} = require('../controllers/learningController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Public route to fetch published learning resources
router.get('/', getLearningResources);

// Public route to fetch single published learning resource by slug or ID
router.get('/:slugOrId', optionalAuth, getLearningResourceBySlugOrId);

module.exports = router;
