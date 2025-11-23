import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, Linkedin, Twitter, Facebook, Instagram, AlertCircle, Shield, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: "#2dd4bf", // teal-400
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand Column */}
          <motion.div className="footer-column brand-column" variants={itemVariants}>
            <div className="footer-logo">
              <Activity size={28} />
              <span className="logo-text">MedQueue</span>
            </div>
            <p className="footer-tagline">
              Connecting patients with care when it matters most. Real-time availability, instant bookings.
            </p>

            {/* Contact Info */}
            <div className="footer-contact">
              <a href="mailto:support@medqueue.com" className="contact-link">
                <Mail size={16} />
                <span>support@medqueue.com</span>
              </a>
              <a href="tel:1800MEDQUEUE" className="contact-link">
                <Phone size={16} />
                <span>1800-MEDQUEUE</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="footer-social">
              {[
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  variants={socialVariants}
                  whileHover="hover"
                >
                  <social.Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* For Patients Column */}
          <motion.div className="footer-column" variants={itemVariants}>
            <h4 className="footer-heading">For Patients</h4>
            <ul className="footer-links">
              {[
                { name: "Find Hospitals", path: "/dashboard" },
                { name: "Search Beds", path: "/dashboard" },
                { name: "My Bookings", path: "/my-bookings" },
                { name: "FAQs", path: "/faq" }
              ].map((link, index) => (
                <motion.li key={index} whileHover="hover" variants={linkVariants}>
                  <Link to={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* For Hospitals Column */}
          <motion.div className="footer-column" variants={itemVariants}>
            <h4 className="footer-heading">For Hospitals</h4>
            <ul className="footer-links">
              {[
                { name: "Hospital Login", path: "/login" },
                { name: "Pricing", path: "/pricing" },
                { name: "Resources", path: "/resources" }
              ].map((link, index) => (
                <motion.li key={index} whileHover="hover" variants={linkVariants}>
                  <Link to={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </ul>

            {/* Emergency Helpline Card */}
            <motion.div
              className="emergency-card"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <AlertCircle size={20} />
              <div className="emergency-content">
                <a href="tel:108" className="emergency-link">
                  <div className="emergency-title">🚨 Emergency: Call 108</div>
                  <div className="emergency-subtitle">24/7 Helpline</div>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Company Column */}
          <motion.div className="footer-column" variants={itemVariants}>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {[
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "/blog" },
                { name: "Contact Us", path: "/contact" }
              ].map((link, index) => (
                <motion.li key={index} whileHover="hover" variants={linkVariants}>
                  <Link to={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="trust-section">
              <p className="trust-text">Trusted by leading healthcare providers</p>
              <div className="trust-badges">
                <motion.div className="trust-badge" whileHover={{ scale: 1.1 }} title="NABH Accredited">
                  <Shield size={24} color="#9ca3af" />
                </motion.div>
                <motion.div className="trust-badge" whileHover={{ scale: 1.1 }} title="ISO Certified">
                  <Award size={24} color="#9ca3af" />
                </motion.div>
                <motion.div className="trust-badge" whileHover={{ scale: 1.1 }} title="Verified Partners">
                  <CheckCircle size={24} color="#9ca3af" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Legal Column */}
          <motion.div className="footer-column" variants={itemVariants}>
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Data Security", path: "/security" }
              ].map((link, index) => (
                <motion.li key={index} whileHover="hover" variants={linkVariants}>
                  <Link to={link.path}>{link.name}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container bottom-container">
          <div className="copyright">
            <span>© {currentYear} MedQueue Inc. All rights reserved.</span>
            <span className="made-in-india">Made with ❤️ in India 🇮🇳</span>
          </div>
          <div className="language-selector">
            <select className="language-select">
              <option value="en">English</option>
              <option value="hi">हिंदी (Coming Soon)</option>
            </select>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
