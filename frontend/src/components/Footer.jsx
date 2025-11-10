import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>🏠 Real Estate</h3>
            <p>Find your dream home with us. Professional real estate services you can trust.</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">Properties</Link></li>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📧 info@realestate.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Main St, New York, NY</p>
          </div>

          {/* Social */}
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Real Estate Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;