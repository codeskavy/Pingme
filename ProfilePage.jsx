// src/ProfilePage.jsx
import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user, onBackToChat, onLogout }) => {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={onBackToChat}>Back to Chat</button>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </header>
      <main className="profile-main">
        <img src={user.profilePicture} alt={user.name} className="profile-picture" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">Email: {user.email || 'example@example.com'}</p>
        {/* Add more user details here */}
      </main>
    </div>
  );
};

export default ProfilePage;
