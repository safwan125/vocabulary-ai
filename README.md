# AI Vocabulary Enhancement Bot

An intelligent vocabulary enhancement application built with React.js and Google's Gemini API. This app helps users expand their vocabulary by presenting new words daily with comprehensive information including definitions, examples, synonyms, antonyms, and etymology.

## Features

- Generate vocabulary words of varying difficulty levels (easy, medium, advanced)
- Detailed word information with definitions, usage examples, synonyms, and antonyms
- Save words to history for later review
- Customizable settings for word difficulty and daily reminders
- Responsive design that works on desktop and mobile devices

## Screenshots

(Add screenshots of your app here after running it)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd vocabulary_app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Gemini API key:
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `src/services/geminiService.js`
   - Replace `'YOUR_GEMINI_API_KEY'` with your actual API key

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Troubleshooting API Issues

If you're experiencing problems with the Gemini API:

1. **API Key Problems**:
   - Make sure your API key is correctly entered in `src/services/geminiService.js`
   - Verify your API key is active in [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Check that you haven't exceeded your API quota limits

2. **Network Issues**:
   - The app has a built-in offline mode that activates automatically when the API can't be reached
   - You'll see an "Offline Mode" indicator when using words from the offline collection
   - Check your internet connection if consistently in offline mode

3. **Console Errors**:
   - Open your browser's developer console (F12 in most browsers)
   - Look for error messages related to the API calls
   - These errors can provide more specific information about what's going wrong

4. **Content Safety Issues**:
   - Google's Gemini API has built-in content filters
   - If you're seeing errors, the API might be filtering content based on safety settings
   - Try modifying difficulty levels or try again for a different word

## How to Use

1. **Generate a New Word**: Click the "Generate New Word" button to get a random vocabulary word based on your difficulty settings.

2. **Customize Settings**: Click the gear icon to:
   - Change the word difficulty level
   - Toggle daily word display
   - Enable or disable daily reminders

3. **View Word History**: Click the "History" button to see words you've previously viewed. You can search and filter your word history.

4. **Review Word Details**: Each vocabulary card includes:
   - The word and its part of speech
   - Definition
   - Example usage
   - Synonyms and antonyms
   - Etymology information

## Technical Implementation

- **React.js**: Frontend framework for building the user interface
- **Google's Gemini API**: AI model for generating vocabulary words and related information
- **Local Storage**: Used to save user settings and word history
- **CSS3**: Custom styling with modern design patterns

## License

[MIT](LICENSE)

## Acknowledgments

- Google for providing the Gemini API
- React team for the amazing framework

---

**Note**: This project is for educational purposes. Make sure to follow Google's API usage guidelines.
