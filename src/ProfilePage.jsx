// src/ProfilePage.jsx
import React, { useState } from 'react';
import './ProfilePage.css'; // Import the new CSS file

const ProfilePage = ({ onLogout, onBackToChat, user }) => {
  const [username, setUsername] = useState(user.name);
  const [email, setEmail] = useState('john.doe@example.com'); // Placeholder email, replace with actual data

  const handleSave = () => {
    // Handle save logic here
    alert('Profile updated!');
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Profile Page</h1>
      </div>
      <div className="profile-form">
        <form>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="back-to-chat-button"
              onClick={onBackToChat}
            >
              Back to Chat
            </button>
            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={handleSave}
          className="save-button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
