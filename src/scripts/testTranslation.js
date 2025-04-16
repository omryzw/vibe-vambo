require('dotenv').config();
const mongoose = require('mongoose');
const Language = require('../models/Language');
const translationService = require('../utils/translationService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for testing'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Test translation
async function testTranslation() {
  try {
    // Get English and Swahili languages
    const [english, swahili] = await Promise.all([
      Language.findOne({ code: 'en' }),
      Language.findOne({ code: 'sw' })
    ]);

    if (!english || !swahili) {
      console.error('Required languages not found. Please run the seed script first.');
      process.exit(1);
    }

    // Test text to translate
    const testText = 'Hello, how are you today?';
    console.log(`\nTesting translation from ${english.name} to ${swahili.name}`);
    console.log(`Original text: "${testText}"`);

    // Perform translation
    const translatedText = await translationService.translate(
      testText,
      english.name,
      swahili.name
    );

    console.log(`Translated text: "${translatedText}"`);
    console.log('\nTranslation test completed successfully!');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error testing translation:', error);
    process.exit(1);
  }
}

// Run the test
testTranslation(); 