import React from 'react';

const Message = ({ text, sender, profilePicture }) => {
  const isSentMessage = sender === 'You';

  return (
    <div className={`message ${isSentMessage ? 'sent' : 'received'}`}>
      <img src={profilePicture} alt={sender} className="profile-picture" />
      <div className="message-content">
        <span className="message-text">{text}</span>
        <span className="message-sender">{sender}</span>
      </div>
    </div>
  );
};

export default Message;
