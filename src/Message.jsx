import React from 'react';

const Message = ({ text, sender, profilePicture }) => {
  return (
    <div className={`message ${sender === 'You' ? 'sent' : 'received'}`}>
      <img src={profilePicture} alt="Profile" className="profile-picture" />
      <span>{text}</span>
    </div>
  );
};

export default Message;
