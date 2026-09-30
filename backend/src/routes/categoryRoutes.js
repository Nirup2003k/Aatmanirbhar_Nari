const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// Public route to fetch active categories
router.get('/', getCategories);

module.exports = router;
