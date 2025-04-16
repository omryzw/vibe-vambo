const Language = require('../models/Language');

// Get all languages
exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get language by code
exports.getLanguageByCode = async (req, res) => {
  try {
    const language = await Language.findOne({ code: req.params.code, isActive: true });
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new language
exports.createLanguage = async (req, res) => {
  try {
    const language = new Language(req.body);
    const savedLanguage = await language.save();
    res.status(201).json(savedLanguage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update language
exports.updateLanguage = async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json(language);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete language (soft delete)
exports.deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json({ message: 'Language deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 