import React, { useState } from 'react';
import Message from './Message';
import './Chat.css';

// Default profile picture URL
const defaultProfilePicture = 'src/assets/user icon.jpg';

const users = [
  { id: 1, name: 'Alice', profilePicture: 'src/assets/user icon.jpg' },
  { id: 2, name: 'Bob', profilePicture: 'src/assets/user icon.jpg' },
  { id: 3, name: 'Charlie', profilePicture: 'src/assets/user icon.jpg'}
];

const Chat = ({ onLogout }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'You', profilePicture: defaultProfilePicture }]);
      setMessage('');
      // Scroll to the bottom of the messages
      document.querySelector('.message-list').scrollTop = document.querySelector('.message-list').scrollHeight;
    }
  };

  return (
    <div className="container chat-container">
      <div className="chat-header">
        <h2>Chat with {selectedUser.name}</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Chat;
