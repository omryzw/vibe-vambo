const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const translationController = require('../controllers/translationController');

// Validation middleware
const validateTranslation = [
  body('sourceText').trim().notEmpty().withMessage('Source text is required'),
  body('sourceLanguageCode').trim().notEmpty().withMessage('Source language code is required'),
  body('targetLanguageCode').trim().notEmpty().withMessage('Target language code is required')
];

// Routes
router.post('/translate', validateTranslation, translationController.translateText);
router.get('/history', translationController.getTranslationHistory);
router.get('/:id', translationController.getTranslationById);

module.exports = router; 