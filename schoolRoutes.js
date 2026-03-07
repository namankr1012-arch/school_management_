// src/routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('./schoolController');
const { validateAddSchool, validateListSchools } = require('./validation');

/**
 * @route  POST /addSchool
 * @desc   Add a new school
 * @access Public
 */
router.post('/addSchool', validateAddSchool, addSchool);

/**
 * @route  GET /listSchools
 * @desc   List all schools sorted by proximity
 * @access Public
 * @query  latitude  - user's latitude
 * @query  longitude - user's longitude
 */
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
