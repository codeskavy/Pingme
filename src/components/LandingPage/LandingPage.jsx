import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onStartChat }) => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav className="navbar">
          <div className="logo-container" onClick={onStartChat}>
            <img src={'src/assets/user-icon.jpg'} alt="User Profile" className="user-icon" />
          </div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="landing-main">
        <img src={'src/assets/chat-icon.gif'} alt="Ping Me GIF" className="ping-me-gif" onClick={onStartChat} />
        <h1 className="landing-title">Ping Me!</h1>
        <p className="landing-description">
          Connect with friends and family in a fun and easy way. Start chatting now!
        </p>
        <button className="get-started-button" onClick={onStartChat}>
          Get Started
        </button>
      </main>

      <section id="about" className="about-section">
        <h2>About Ping Me</h2>
        <p>
          Ping Me is a state-of-the-art messaging platform that allows you to stay connected with your loved ones. With a user-friendly interface and seamless integration, chatting has never been easier.
        </p>
      </section>

      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Instant Messaging</h3>
            <p>Send and receive messages in real-time with our fast and reliable messaging system.</p>
          </div>
          <div className="feature-item">
            <h3>Media Sharing</h3>
            <p>Share photos, videos, and documents with your contacts effortlessly.</p>
          </div>
          <div className="feature-item">
            <h3>Group Chats</h3>
            <p>Create and join group chats to stay connected with multiple friends and family members.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"Ping Me has revolutionized the way I communicate with my friends. It's fast, reliable, and easy to use!"</p>
          <cite>– Alex Johnson</cite>
        </div>
        <div className="testimonial">
          <p>"I love the group chat feature! It's perfect for planning events and staying in touch with my family."</p>
          <cite>– Sarah Lee</cite>
        </div>
        <div className="testimonial">
          <p>"The best messaging app I've ever used. Highly recommended!"</p>
          <cite>– Michael Smith</cite>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
          
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
          
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" required></textarea>
          
          <button type="submit">Send Message</button>
        </form>
      </section>

      <div className="info-container">
        <div className="info-box">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="info-box">
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="info-box">
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </div>
      </div>

      <footer className="landing-footer">
        <p>&copy; 2024 Ping Me. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
