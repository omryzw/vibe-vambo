const Translation = require('../models/Translation');
const Language = require('../models/Language');
const translationService = require('../utils/translationService');

// Translate text
exports.translateText = async (req, res) => {
  try {
    const { sourceText, sourceLanguageCode, targetLanguageCode } = req.body;

    // Validate languages exist
    const [sourceLanguage, targetLanguage] = await Promise.all([
      Language.findOne({ code: sourceLanguageCode, isActive: true }),
      Language.findOne({ code: targetLanguageCode, isActive: true })
    ]);

    if (!sourceLanguage || !targetLanguage) {
      return res.status(400).json({ message: 'Invalid language code(s)' });
    }

    // Check for cached translation
    const cachedTranslation = await Translation.findOne({
      sourceText,
      sourceLanguage: sourceLanguage._id,
      targetLanguage: targetLanguage._id
    });

    if (cachedTranslation) {
      return res.json(cachedTranslation);
    }

    // Use LangChain translation service
    const translatedText = await translationService.translate(
      sourceText,
      sourceLanguage.name,
      targetLanguage.name
    );

    // Save new translation
    const translation = new Translation({
      sourceText,
      translatedText,
      sourceLanguage: sourceLanguage._id,
      targetLanguage: targetLanguage._id,
      userId: req.user?.id // If user authentication is implemented
    });

    const savedTranslation = await translation.save();
    res.status(201).json(savedTranslation);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Failed to translate text' });
  }
};

// Get translation history
exports.getTranslationHistory = async (req, res) => {
  try {
    const translations = await Translation.find({ userId: req.user?.id })
      .populate('sourceLanguage targetLanguage', 'code name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get translation by ID
exports.getTranslationById = async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id)
      .populate('sourceLanguage targetLanguage', 'code name');
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    res.json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 