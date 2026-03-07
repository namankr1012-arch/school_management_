// src/middleware/validation.js
const { body, query, validationResult } = require('express-validator');

/**
 * Shared handler — returns 400 with error details if validation failed.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

/** Validation rules for POST /addSchool */
const validateAddSchool = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
    .trim(),

  body('address')
    .notEmpty().withMessage('Address is required')
    .isString().withMessage('Address must be a string')
    .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters')
    .trim(),

  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),

  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

  handleValidationErrors,
];

/** Validation rules for GET /listSchools */
const validateListSchools = [
  query('latitude')
    .notEmpty().withMessage('Latitude query parameter is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),

  query('longitude')
    .notEmpty().withMessage('Longitude query parameter is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

  handleValidationErrors,
];

module.exports = { validateAddSchool, validateListSchools };
