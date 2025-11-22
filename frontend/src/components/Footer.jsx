import React from 'react';
import { Activity, Phone } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-max footer-grid">
        <div className="footer-brand">
          <div className="logo-section white-text">
            <Activity size={24} />
            <span className="logo-text">MedQueue</span>
          </div>
          <p className="footer-desc">Connecting patients with care when it matters most.</p>
        </div>
        <div>
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><a href="#">Find Hospitals</a></li>
            <li><a href="#">Book Appointment</a></li>
            <li><a href="#">For Providers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Emergency</h4>
          <div className="emergency-contact">
            <Phone size={20} /> 108
          </div>
          <p className="emergency-note">For immediate life-threatening emergencies, always call emergency services.</p>
        </div>
      </div>
      <div className="container-max footer-bottom">
        © 2024 MedQueue Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
