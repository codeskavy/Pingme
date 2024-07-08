// src/App.jsx
import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import ProfilePage from './ProfilePage';
import LandingPage from './LandingPage'; // Import the LandingPage component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // landing, login, chat, profile
  const [selectedUser, setSelectedUser] = useState(null);

  const handleStart = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('chat');
  };

  const navigateToProfile = (user) => {
    setSelectedUser(user);
    setCurrentPage('profile');
  };

  const navigateToChat = () => {
    setCurrentPage('chat');
  };

  return (
    <div className="App">
      {currentPage === 'landing' ? (
        <LandingPage onStart={handleStart} />
      ) : !isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : currentPage === 'chat' ? (
        <Chat onLogout={handleLogout} onProfile={navigateToProfile} />
      ) : (
        <ProfilePage onLogout={handleLogout} onBackToChat={navigateToChat} user={selectedUser} />
      )}
    </div>
  );
};

export default App;
