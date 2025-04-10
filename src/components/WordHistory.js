import React, { useState } from 'react';
import '../styles/WordHistory.css';

const WordHistory = ({ history = [], onSelectWord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredHistory = searchTerm 
    ? history.filter(item => 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : history;

  return (
    <div className="word-history">
      <button 
        className="history-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Word History"
      >
        <span className="history-icon">📚</span>
        <span className="history-label">History</span>
      </button>

      {isOpen && (
        <div className="history-panel">
          <h2>Word History</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredHistory.length === 0 ? (
            <p className="empty-history">
              {searchTerm 
                ? 'No matching words found.' 
                : 'Your word history is empty. Start exploring new words!'}
            </p>
          ) : (
            <ul className="history-list">
              {filteredHistory.map((item, index) => (
                <li key={index} className="history-item">
                  <button
                    className="word-button"
                    onClick={() => {
                      onSelectWord(item);
                      setIsOpen(false);
                    }}
                  >
                    <span className="history-word">{item.word}</span>
                    <span className={`history-difficulty ${item.difficulty}`}>
                      {item.difficulty}
                    </span>
                    <span className="history-date">{formatDate(item.timestamp)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          <button 
            className="close-button" 
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default WordHistory; 