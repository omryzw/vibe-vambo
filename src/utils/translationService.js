const OpenAI = require('openai');

class TranslationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translate(text, sourceLanguage, targetLanguage) {
    try {
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
                     Provide only the translation without any explanations or additional text.
                     
                     Text: ${text}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }
}

module.exports = new TranslationService(); 