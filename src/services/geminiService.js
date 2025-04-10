import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
// Note: You'll need to replace this with your actual API key from Google AI Studio
const API_KEY = 'AIzaSyDPEjaX_xvkC2zJmzrvJMud8WfvwoJNq80';
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate a random difficulty level
const getRandomDifficulty = () => {
  const difficulties = ['easy', 'medium', 'advanced'];
  const randomIndex = Math.floor(Math.random() * difficulties.length);
  return difficulties[randomIndex];
};

// Fallback vocabulary words when API fails
const fallbackWords = {
  easy: [
    {
      word: "luminous",
      definition: "Giving off light; bright or shining, especially in the dark.",
      example: "The night sky was luminous with stars.",
      synonyms: ["bright", "radiant", "glowing"],
      antonyms: ["dark", "dim", "gloomy"],
      etymology: "From Latin 'luminosus', from 'lumen' meaning light.",
      difficulty: "easy",
      partOfSpeech: "adjective"
    },
    {
      word: "serene",
      definition: "Calm, peaceful, and untroubled; tranquil.",
      example: "The serene lake reflected the mountains perfectly.",
      synonyms: ["peaceful", "calm", "tranquil"],
      antonyms: ["agitated", "turbulent", "chaotic"],
      etymology: "From Latin 'serenus' meaning clear or unclouded (of weather).",
      difficulty: "easy",
      partOfSpeech: "adjective"
    }
  ],
  medium: [
    {
      word: "ephemeral",
      definition: "Lasting for a very short time; transitory.",
      example: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      synonyms: ["transient", "fleeting", "momentary"],
      antonyms: ["permanent", "enduring", "eternal"],
      etymology: "From Greek 'ephemeros' meaning lasting only a day.",
      difficulty: "medium",
      partOfSpeech: "adjective"
    },
    {
      word: "serendipity",
      definition: "The occurrence of events by chance in a happy or beneficial way.",
      example: "Finding this rare book was pure serendipity.",
      synonyms: ["chance", "fortuity", "luck"],
      antonyms: ["misfortune", "design", "intention"],
      etymology: "Coined by Horace Walpole in 1754 from the Persian fairy tale 'The Three Princes of Serendip'.",
      difficulty: "medium",
      partOfSpeech: "noun"
    }
  ],
  advanced: [
    {
      word: "quixotic",
      definition: "Exceedingly idealistic; unrealistic and impractical.",
      example: "His quixotic plan to eliminate world hunger in a year was admirable but unrealistic.",
      synonyms: ["idealistic", "romantic", "visionary"],
      antonyms: ["practical", "realistic", "pragmatic"],
      etymology: "From 'Don Quixote', the impractical idealist in Cervantes' novel.",
      difficulty: "advanced",
      partOfSpeech: "adjective"
    },
    {
      word: "perspicacious",
      definition: "Having keen mental perception and understanding; discerning.",
      example: "The perspicacious detective noticed the subtle clue everyone else had missed.",
      synonyms: ["astute", "insightful", "perceptive"],
      antonyms: ["unobservant", "undiscerning", "obtuse"],
      etymology: "From Latin 'perspicax', from 'perspicere' meaning to look through or see clearly.",
      difficulty: "advanced",
      partOfSpeech: "adjective"
    }
  ]
};

// Gets a random fallback word based on difficulty
const getFallbackWord = (difficulty = 'medium') => {
  // Default to medium if difficulty isn't recognized
  const level = ['easy', 'medium', 'advanced'].includes(difficulty) ? difficulty : 'medium';
  const words = fallbackWords[level];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

// Function to get a new vocabulary word and related data
export const getNewVocabularyWord = async (customDifficulty = null) => {
  try {
    console.log('Initializing Gemini API request...');
    // Use the standard gemini-pro model since flash version isn't available
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const difficulty = customDifficulty || getRandomDifficulty();
    console.log(`Requesting ${difficulty} level vocabulary word...`);
    
    // Create a prompt for generating a vocabulary word
    const prompt = `Generate a ${difficulty} level English vocabulary word that would help someone expand their vocabulary. 
    Return a JSON object with the following fields:
    - word: the vocabulary word
    - definition: a clear, concise definition
    - example: a sentence using the word correctly
    - synonyms: array of 3 synonyms
    - antonyms: array of 3 antonyms (if applicable)
    - etymology: brief origin of the word
    - difficulty: "${difficulty}"
    - partOfSpeech: the grammatical classification
    
    Format the response as a valid JSON object with no extra text.`;

    // Generate content from the model
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    
    if (!result) {
      console.error('No result returned from Gemini API');
      throw new Error('No result from API');
    }
    
    console.log('Response received from Gemini API');
    const response = await result.response;
    
    // Get the text from the response
    const text = response.text();
    console.log('Raw API response:', text.substring(0, 100) + '...');
    
    // Parse the JSON response
    // Find the JSON object in the response text (it might be surrounded by ```json or other text)
    const jsonMatch = text.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[0]) {
      try {
        const parsedData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON response');
        return parsedData;
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Attempted to parse:', jsonMatch[0]);
        throw new Error('Failed to parse API response as JSON');
      }
    }
    
    // If we can't find a JSON object in the response
    console.error('No valid JSON found in response');
    console.log('Full response:', text);
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching vocabulary word:', error);
    console.log('Using fallback word mechanism...');
    
    // Get a fallback word instead
    try {
      const fallbackWord = getFallbackWord(customDifficulty);
      console.log('Successfully retrieved fallback word:', fallbackWord.word);
      
      // Add a flag to indicate this is a fallback word
      return {
        ...fallbackWord,
        isOfflineMode: true
      };
    } catch (fallbackError) {
      console.error('Error getting fallback word:', fallbackError);
      
      // Return a more detailed error message if even fallback fails
      return {
        error: true,
        message: `Failed to generate vocabulary word: ${error.message || 'Unknown error'}. Please check your API key and try again.`
      };
    }
  }
};

// Create a named export object
const geminiService = {
  getNewVocabularyWord
};

export default geminiService; 