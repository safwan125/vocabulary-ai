import React, { useState, useEffect } from 'react';
import './App.css';
import VocabularyCard from './components/VocabularyCard';
import Settings from './components/Settings';
import WordHistory from './components/WordHistory';
import { getNewVocabularyWord } from './services/geminiService';
import { 
  saveSettings, 
  getSettings, 
  saveWordToHistory, 
  getWordHistory,
  shouldShowDailyWord
} from './utils/storageUtils';

function App() {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ difficulty: 'random' });
  const [history, setHistory] = useState([]);

  // Load saved settings and history on initial load
  useEffect(() => {
    const savedSettings = getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }

    const wordHistory = getWordHistory();
    if (wordHistory) {
      setHistory(wordHistory);
    }

    // Check if we should show a new word
    const showDaily = savedSettings?.showDaily !== false;
    if (showDaily && shouldShowDailyWord()) {
      fetchNewWord(savedSettings?.difficulty || 'random');
    }
  }, []);

  const fetchNewWord = async (selectedDifficulty = null) => {
    setLoading(true);
    
    try {
      const difficulty = selectedDifficulty === 'random' ? null : selectedDifficulty;
      const data = await getNewVocabularyWord(difficulty);
      
      setWordData(data);
      
      // Save to history if it's a valid word (not an error)
      if (!data.error) {
        saveWordToHistory(data);
        // Update history state
        setHistory(prevHistory => [
          { ...data, timestamp: new Date().toISOString() },
          ...prevHistory
        ]);
      }
    } catch (error) {
      console.error('Error fetching word:', error);
      setWordData({
        error: true,
        message: 'Failed to generate vocabulary word. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    
    // If difficulty changed, fetch a new word
    if (newSettings.difficulty !== settings.difficulty) {
      fetchNewWord(newSettings.difficulty);
    }
  };

  const handleSelectFromHistory = (word) => {
    setWordData(word);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vocabulary Enhancer</h1>
        <p className="tagline">Expand your vocabulary one word at a time</p>
        <div className="model-badge">Powered by Gemini Flash 2.0</div>
      </header>

      <main className="App-main">
        <div className="controls">
          <button 
            className="new-word-button"
            onClick={() => fetchNewWord(settings.difficulty)}
            disabled={loading}
          >
            Generate New Word
          </button>
          
          <div className="tools">
            <WordHistory 
              history={history} 
              onSelectWord={handleSelectFromHistory}
            />
            <Settings 
              onSave={handleSaveSettings}
              initialSettings={settings}
            />
          </div>
        </div>

        <VocabularyCard wordData={wordData} loading={loading} />
        
        <div className="info-section">
          <p>
            This app uses AI to generate vocabulary words to help expand your lexicon.
            You can customize the difficulty level in settings and browse your word history.
          </p>
          <p className="api-note">
            
          </p>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Vocabulary Enhancer App</p>
      </footer>
    </div>
  );
}

export default App;
