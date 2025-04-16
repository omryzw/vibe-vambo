require('dotenv').config();
const mongoose = require('mongoose');
const Language = require('../models/Language');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Read sample languages from file
const sampleLanguages = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../sample_languages.json'), 'utf8')
);

// Seed the database
async function seedLanguages() {
  try {
    // Clear existing languages
    await Language.deleteMany({});
    console.log('Cleared existing languages');

    // Insert sample languages
    const insertedLanguages = await Language.insertMany(sampleLanguages);
    console.log(`Successfully seeded ${insertedLanguages.length} languages`);

    // Log the inserted languages
    insertedLanguages.forEach(lang => {
      console.log(`- ${lang.name} (${lang.code}) - ${lang.region}`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding languages:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedLanguages(); 