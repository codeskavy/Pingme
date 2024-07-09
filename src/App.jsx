// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import ProfilePage from './components/ProfilePage/ProfilePage';
import LandingPage from './components/LandingPage/LandingPage';  // Import the LandingPage component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // landing, chat, profile
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  const navigateToProfile = (user) => {
    setSelectedUser(user);
    setCurrentPage('profile');
  };

  const navigateToChat = () => {
    setCurrentPage('chat');
  };

  const startChat = () => {
    setCurrentPage('chat');
  };

  return (
    <div className="App">
      {currentPage === 'landing' ? (
        <LandingPage onStartChat={startChat} />  // Pass the startChat function as a prop
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
