const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/', searchController.searchHospitals);
router.get('/suggestions', searchController.getSuggestions);
router.get('/trending', searchController.getTrendingHospitals);
router.get('/recommended', searchController.getRecommendedHospitals);

module.exports = router;
