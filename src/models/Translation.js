const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  sourceText: {
    type: String,
    required: true,
    trim: true
  },
  translatedText: {
    type: String,
    required: true,
    trim: true
  },
  sourceLanguage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  targetLanguage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
translationSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
translationSchema.index({ userId: 1 });

module.exports = mongoose.model('Translation', translationSchema); 