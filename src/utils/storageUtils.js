const STORAGE_KEYS = {
  SETTINGS: 'vocab_app_settings',
  HISTORY: 'vocab_app_history',
  LAST_UPDATED: 'vocab_app_last_updated'
};

// Save settings to local storage
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Get settings from local storage
export const getSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

// Save word to history
export const saveWordToHistory = (wordData) => {
  try {
    // Get existing history
    const history = getWordHistory() || [];
    
    // Add new word with timestamp
    const wordWithTimestamp = {
      ...wordData,
      timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(wordWithTimestamp);
    
    // Limit history to 100 items
    const limitedHistory = history.slice(0, 100);
    
    // Save back to storage
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    
    // Update last updated timestamp
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('Error saving word to history:', error);
    return false;
  }
};

// Get word history
export const getWordHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting word history:', error);
    return [];
  }
};

// Check if daily word has been shown today
export const shouldShowDailyWord = () => {
  try {
    const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
    if (!lastUpdated) return true;
    
    const lastDate = new Date(lastUpdated).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    
    // If last update was before today, show new word
    return lastDate < today;
  } catch (error) {
    console.error('Error checking daily word status:', error);
    return true; // Default to showing the word if there's an error
  }
};

// Create named export object to fix ESLint warning
const storageUtils = {
  saveSettings,
  getSettings,
  saveWordToHistory,
  getWordHistory,
  shouldShowDailyWord
};

export default storageUtils; 