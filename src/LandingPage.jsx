// src/LandingPage.jsx
import React from 'react';
import './LandingPage.css';
import chaticonGif from './assets/chat-icon.gif'; // Import the GIF
import userIcon from './assets/user icon.jpg'; // Import the user profile icon

const LandingPage = ({ onStartChat }) => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav className="navbar">
          <div className="logo-container" onClick={onStartChat}>
            <img src={userIcon} alt="User Profile" className="user-icon" />
          </div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="landing-main">
        <img src={chaticonGif} alt="Ping Me GIF" className="ping-me-gif" onClick={onStartChat} />
        <h1 className="landing-title">Ping Me!</h1>
        <p className="landing-description">
          Connect with friends and family in a fun and easy way. Start chatting now!
        </p>
        <button className="get-started-button" onClick={onStartChat}>
          Get Started
        </button>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2024 Ping Me. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
