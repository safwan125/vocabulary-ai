import React, { useState, useRef, useEffect } from 'react';
import { generateVocabularyResponse } from '../services/geminiService';
import '../styles/ChatBot.css';

// Simple markdown-to-HTML converter for safe strings
const convertMarkdownToHTML = (markdown) => {
  if (!markdown) return '';
  
  // Safety measure - only process strings
  if (typeof markdown !== 'string') {
    return String(markdown);
  }

  let html = markdown;
  
  // Headers
  html = html.replace(/### (.*?)\n/g, '<h3>$1</h3>\n');
  html = html.replace(/## (.*?)\n/g, '<h2>$1</h2>\n');
  html = html.replace(/# (.*?)\n/g, '<h1>$1</h1>\n');
  
  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/<\/li>\n<li>/g, '</li><li>');
  html = html.replace(/<li>(.*?)(?=<\/li>|$)/g, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/g, '');
  
  // Code blocks
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Line breaks and paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '<p>&nbsp;</p>');
  
  return html;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "### Welcome to Vocabulary Assistant! 👋\n\nI'm a specialized chatbot that can **only** help with vocabulary-related questions such as:\n\n* Word definitions and meanings\n* Synonyms and antonyms\n* Etymology and word origins\n* Usage examples and grammar\n* Spelling and pronunciation\n\nPlease note that I cannot answer questions about other topics like current events, math, personal advice, or general knowledge. I'm here to help you expand your vocabulary!",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Call Gemini API
      const response = await generateVocabularyResponse(inputText);
      
      // Check if this is an error response
      const isErrorResponse = response.includes("I can only help with vocabulary-related questions");
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        isError: isErrorResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render message content with markdown for bot messages
  const renderMessageContent = (message) => {
    if (message.sender === 'bot') {
      // For error messages, render without markdown processing
      if (message.isError) {
        return (
          <div className="error-content">
            <p>{message.text}</p>
          </div>
        );
      }
      
      // For normal bot messages, render with markdown
      return (
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(message.text) }}
        />
      );
    } else {
      return <p>{message.text}</p>;
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        <span className="chatbot-icon">💬</span>
        <span className="chatbot-label">Vocabulary Assistant</span>
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <h3>Vocabulary Assistant</h3>
            <button 
              className="close-button" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-content">
                  {renderMessageContent(message)}
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about any vocabulary word..."
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
            >
              <span className="send-icon">▶</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 