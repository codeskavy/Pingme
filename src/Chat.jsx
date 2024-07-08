// src/Chat.jsx
import React, { useState, useEffect } from 'react';
import Message from './Message';
import './Chat.css';

const defaultProfilePicture = 'src/assets/user-icon.jpg';

const users = [
  { id: 1, name: 'Alice', profilePicture: defaultProfilePicture },
  { id: 2, name: 'Bob', profilePicture: defaultProfilePicture },
  { id: 3, name: 'Charlie', profilePicture: defaultProfilePicture }
];

const Chat = ({ onLogout, onProfile }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    const receiveMessage = () => {
      const receivedMessage = { text: 'Hello!', sender: selectedUser.name, profilePicture: selectedUser.profilePicture };
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
      document.querySelector('.message-list').scrollTop = document.querySelector('.message-list').scrollHeight;
    };

    const receiveMessagesInterval = setInterval(() => {
      receiveMessage();
    }, 10000);

    return () => clearInterval(receiveMessagesInterval);
  }, [selectedUser]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'You', profilePicture: defaultProfilePicture }]);
      setMessage('');
      document.querySelector('.message-list').scrollTop = document.querySelector('.message-list').scrollHeight;
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
  };

  return (
    <div className="container chat-container">
      <div className="chat-header">
        <h2>Chat with {selectedUser.name}</h2>
        <button className="profile-button" onClick={() => onProfile(selectedUser)}>Profile</button>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
      <div className="chat-body">
        <div className="user-list">
          {users.map(user => (
            <div
              key={user.id}
              className={`user ${user.id === selectedUser.id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.profilePicture || defaultProfilePicture} alt={user.name} className="profile-picture" />
              {user.name}
            </div>
          ))}
        </div>
        <div className="message-container">
          <div className="message-list">
            {messages.map((msg, index) => (
              <Message
                key={index}
                text={msg.text}
                sender={msg.sender}
                profilePicture={msg.profilePicture || defaultProfilePicture}
              />
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
          <div className="emoji-picker">
            <span role="img" aria-label="Grinning Face" onClick={() => handleEmojiClick('😀')}>😀</span>
            <span role="img" aria-label="Heart Eyes" onClick={() => handleEmojiClick('😍')}>😍</span>
            <span role="img" aria-label="Thumbs Up" onClick={() => handleEmojiClick('👍')}>👍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
