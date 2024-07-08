// src/Notification.jsx
import React from 'react';
import './Notification.css';

const Notification = ({ notifications, onClose }) => {
  return (
    <div className="notification-container">
      <button className="notification-close" onClick={onClose}>X</button>
      <ul className="notification-list">
        {notifications.map((notification, index) => (
          <li key={index} className="notification-item">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
