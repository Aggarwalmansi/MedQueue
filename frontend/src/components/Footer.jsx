import { Link } from "react-router-dom"
import "../styles/Footer.css"
import React from "react"
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>MedQueue</h4>
          <p>Real-time hospital bed availability system saving lives every day.</p>
        </div>

        <div className="footer-section">
          <h5>Product</h5>
          <ul>
            <li>
              <Link to="#features">Features</Link>
            </li>
            <li>
              <Link to="#pricing">Pricing</Link>
            </li>
            <li>
              <Link to="#security">Security</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Company</h5>
          <ul>
            <li>
              <Link to="#about">About</Link>
            </li>
            <li>
              <Link to="#blog">Blog</Link>
            </li>
            <li>
              <Link to="#careers">Careers</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Legal</h5>
          <ul>
            <li>
              <Link to="#privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="#terms">Terms of Service</Link>
            </li>
            <li>
              <Link to="#contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MedQueue. All rights reserved. Built to save lives.</p>
      </div>
    </footer>
  )
}
