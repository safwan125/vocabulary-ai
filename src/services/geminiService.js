import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
// Note: You'll need to replace this with your actual API key from Google AI Studio
const API_KEY = 'AIzaSyD5An0TWboetUB7Jf1X34VyrwIHLQb_8vE';
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
    const prompt = `You are a vocabulary expert. Generate a ${difficulty} level English vocabulary word that would be valuable for expanding someone's vocabulary.

The word should be appropriate for the ${difficulty} difficulty level:
- For 'easy': Common words that educated English speakers should know
- For 'medium': More sophisticated words used in academic or professional contexts
- For 'advanced': Rare, specialized, or particularly nuanced words

Return a JSON object with the following fields ONLY:
- word: the vocabulary word (a single word, not a phrase)
- definition: a clear, concise definition that captures the primary meaning
- example: an illustrative sentence showing proper usage in context
- synonyms: array of exactly 3 synonyms, ordered from most to least common
- antonyms: array of exactly 3 antonyms (if applicable), ordered from most to least common
- etymology: brief origin of the word (language of origin and root meaning)
- difficulty: "${difficulty}"
- partOfSpeech: the grammatical classification (noun, verb, adjective, adverb, etc.)

Format the response as a valid, parseable JSON object with no markdown, extra text, or explanations.
Example format: {"word": "example", "definition": "...", ...}`;

    // Generate content from the model
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log(result)
    
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

// Function to generate responses for the chatbot
// Only responds to vocabulary-related queries
export const generateVocabularyResponse = async (query) => {
  try {
    console.log('Generating vocabulary response for:', query);
    
    // Basic pre-filtering for obvious non-vocabulary topics
    const normalizedQuery = query.toLowerCase().trim();
    
    // Common non-vocabulary topics that should be rejected immediately
    const nonVocabTopics = [
      // Weather related
      'weather', 'temperature', 'forecast', 'rain', 'sunny', 'cloudy', 'climate', 
      // Math expressions
      'what is 1+1', 'what is 2+2', 'calculate', 'equals', 'plus', 'minus', 'multiply', 
      // General non-vocabulary
      'how are you', 'who is the president', 'where is', 'when was', 'how do i fix', 
      'tell me a joke'
    ];
    
    // Check if query contains obvious non-vocabulary topics
    if (nonVocabTopics.some(topic => normalizedQuery.includes(topic))) {
      console.log('Non-vocabulary query detected, returning error message');
      return "I can only help with vocabulary-related questions. Please ask me about word meanings, definitions, synonyms, language usage, or similar topics.";
    }
    
    // Also detect math expressions with simple regex
    if (/\d+\s*[+\-*\/=]\s*\d+/.test(normalizedQuery)) {
      console.log('Math expression detected, returning error message');
      return "I can only help with vocabulary-related questions. Please ask me about word meanings, definitions, synonyms, language usage, or similar topics.";
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // The system prompt ensures the AI only responds to vocabulary-related queries
    const systemPrompt = `You are a vocabulary assistant chatbot with strict limitations. Your purpose is to help users with vocabulary-related questions.

UNDERSTANDING VOCABULARY QUERIES:
Vocabulary questions include:
1. Word definitions, meanings, and usages
2. Synonyms, antonyms, and related words
3. Word etymology and origins
4. Grammar, parts of speech, and syntax
5. Spelling and pronunciation
6. Idioms, phrases, and expressions
7. Examples and sample sentences for words
8. Language learning and vocabulary building
9. Word roots, prefixes, and suffixes
10. Differences between similar words

EXAMPLES OF VOCABULARY QUERIES YOU SHOULD ANSWER:
- "What does [word] mean?"
- "Define [word]"
- "What is the definition of [word]?"
- "What are synonyms for [word]?"
- "What are antonyms for [word]?"
- "What is the etymology of [word]?"
- "How do you pronounce [word]?"
- "What is the correct usage of [word/phrase]?"
- "What is the difference between [word] and [word]?"
- "Is [word] a noun/verb/adjective/etc.?"
- "What is the origin of [word/phrase]?"
- "What does the idiom [idiom] mean?"
- "How do you spell [word]?"
- "What are some words that mean [concept]?"
- "What is the plural/past tense/comparative form of [word]?"
- "Can you give me an example sentence with [word]?"
- "How is [word] used in a sentence?"
- "Provide example sentences for [word]"

NON-VOCABULARY QUERIES THAT YOU MUST NEVER ANSWER:
- Math questions (e.g., "What is 1+1?")
- Current events (e.g., "Who is the president?")
- Personal advice (e.g., "Should I buy a car?")
- General knowledge (e.g., "Where is France located?")
- Coding or technology help
- Medical or legal advice
- Weather, news, or sports information
- Jokes, stories, or creative writing not related to language
- Personal opinions on politics, religion, etc.

For ANY non-vocabulary topic, you MUST respond EXACTLY with: "I can only help with vocabulary-related questions. Please ask me about word meanings, definitions, synonyms, language usage, or similar topics."

RESPONSE FORMAT:
Use markdown to format your responses:
- Use **bold** for word definitions
- Use *italics* for examples
- Use bullet lists for synonyms, antonyms
- Use ### for section headings

CRITICAL: Your ONLY function is to help with vocabulary. Non-vocabulary questions MUST receive the exact error message.`;

    // Create the chat configuration with system instructions
    const generationConfig = {
      temperature: 0.1, // Lower temperature for more consistent rule enforcement
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 800,
    };

    // Set up the chat session with the system prompt
    const chat = model.startChat({
      generationConfig,
      systemInstruction: systemPrompt,
    });

    // Send the user query to the chat
    console.log('Sending request to Gemini API...');
    const result = await chat.sendMessage(query);
    
    if (!result) {
      console.error('No result returned from Gemini API');
      throw new Error('No result from API');
    }
    
    console.log('Response received from Gemini API');
    const text = result.response.text();
    console.log('Generated response successfully');
    
    return text;
  } catch (error) {
    console.error('Error generating vocabulary response:', error);
    return "I'm having trouble answering your question right now. Please try again in a moment.";
  }
};

// Create named export object
const geminiService = {
  getNewVocabularyWord,
  generateVocabularyResponse
};

export default geminiService; 