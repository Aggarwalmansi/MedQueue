import "../styles/Footer.css"

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
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#security">Security</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Company</h5>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
            <li>
              <a href="#careers">Careers</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Legal</h5>
          <ul>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Service</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
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
