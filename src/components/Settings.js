import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = ({ onSave, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    difficulty: initialSettings.difficulty || 'random',
    showDaily: initialSettings.showDaily !== false,
    reminderEnabled: initialSettings.reminderEnabled || false,
    ...initialSettings
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
    setIsOpen(false);
  };

  return (
    <div className="settings-container">
      <button 
        className="settings-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <span className="settings-icon">⚙️</span>
      </button>

      {isOpen && (
        <div className="settings-panel">
          <h2>Vocabulary Settings</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="difficulty">Word Difficulty:</label>
              <select 
                id="difficulty" 
                name="difficulty" 
                value={settings.difficulty} 
                onChange={handleChange}
              >
                <option value="random">Random</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group checkbox">
              <input 
                type="checkbox" 
                id="showDaily" 
                name="showDaily" 
                checked={settings.showDaily} 
                onChange={handleChange}
              />
              <label htmlFor="showDaily">Show Word of the Day</label>
            </div>

            <div className="form-group checkbox">
              <input 
                type="checkbox" 
                id="reminderEnabled" 
                name="reminderEnabled" 
                checked={settings.reminderEnabled} 
                onChange={handleChange}
              />
              <label htmlFor="reminderEnabled">Enable Daily Reminders</label>
            </div>

            <div className="settings-actions">
              <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings; 