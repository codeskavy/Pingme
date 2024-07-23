import React from 'react';
import './Message.css';  // Ensure Message.css is present

const Message = ({ text, sender, profilePicture, file }) => {
  return (
    <div className={`message ${sender === 'You' ? 'sent' : 'received'}`}>
      {sender === 'You' ? null : <img src={profilePicture} alt={sender} className="profile-picture" />}
      <div className="message-content">
        {text && <div>{text}</div>}
        {file && (
          file.type.startsWith('image/') ? (
            <img src={URL.createObjectURL(file)} alt="uploaded" className="uploaded-file" />
          ) : (
            <video controls className="uploaded-file">
              <source src={URL.createObjectURL(file)} type={file.type} />
            </video>
          )
        )}
      </div>
    </div>
  );
};

export default Message;
