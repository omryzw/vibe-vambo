# African Language Translator API

A RESTful API for translating text between various African languages using the MEAN stack (MongoDB, Express.js, Angular, Node.js) and OpenAI's GPT-3.5.

## Features

- Translate text between different African languages using ChatGPT
- Cache translations for improved performance
- Track translation history
- Manage supported languages
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd african-translator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/african-translator
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Languages

- `GET /api/languages` - Get all supported languages
- `GET /api/languages/:code` - Get language by code
- `POST /api/languages` - Add a new language
- `PUT /api/languages/:id` - Update a language
- `DELETE /api/languages/:id` - Delete a language

### Translations

- `POST /api/translations/translate` - Translate text using ChatGPT
- `GET /api/translations/history` - Get translation history
- `GET /api/translations/:id` - Get translation by ID

## Request Examples

### Translate Text
```http
POST /api/translations/translate
Content-Type: application/json

{
  "sourceText": "Hello, how are you?",
  "sourceLanguageCode": "en",
  "targetLanguageCode": "sw"
}
```

### Add Language
```http
POST /api/languages
Content-Type: application/json

{
  "code": "sw",
  "name": "Swahili",
  "region": "East Africa"
}
```

## Translation Service

The application uses OpenAI's GPT-3.5-turbo model for translations. The translation service:
- Uses the OpenAI API directly
- Implements caching to avoid redundant API calls
- Provides high-quality translations for African languages
- Handles errors gracefully

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error description"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 