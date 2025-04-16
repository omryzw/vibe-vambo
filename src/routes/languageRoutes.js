const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const languageController = require('../controllers/languageController');

// Validation middleware
const validateLanguage = [
  body('code').trim().notEmpty().withMessage('Language code is required'),
  body('name').trim().notEmpty().withMessage('Language name is required'),
  body('region').trim().notEmpty().withMessage('Region is required')
];

// Routes
router.get('/', languageController.getAllLanguages);
router.get('/:code', languageController.getLanguageByCode);
router.post('/', validateLanguage, languageController.createLanguage);
router.put('/:id', validateLanguage, languageController.updateLanguage);
router.delete('/:id', languageController.deleteLanguage);

module.exports = router; 