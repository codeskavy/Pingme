import React from 'react';
import './Message.css';  // Ensure Message.css is present

const Message = ({ text, sender, profilePicture }) => {
  return (
    <div className={`message ${sender === 'You' ? 'sent' : 'received'}`}>
      {sender === 'You' ? null : <img src={profilePicture} alt={sender} className="profile-picture" />}
      <div>{text}</div>
    </div>
  );
};

export default Message;
