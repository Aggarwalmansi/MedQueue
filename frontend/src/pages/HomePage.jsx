import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Activity, Search, Shield, Clock, ArrowRight, MapPin, Phone, Zap, CheckCircle } from 'lucide-react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container-max navbar-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Activity size={20} />
            </div>
            <span className="logo-text">MedQueue</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#hospitals">For Hospitals</a>
          </div>
          <div className="nav-actions">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="container-max hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="pulse-dot"></span>
            <span>Live Bed Availability in Your Area</span>
          </div>

          <h1 className="hero-title animate-slide-up">
            Emergency Care,<br />
            <span className="gradient-text">Simplified.</span>
          </h1>

          <p className="hero-subtitle animate-slide-up">
            Instantly find available hospital beds, book appointments, and coordinate emergency response. Every second counts.
          </p>

          <div className="hero-buttons animate-slide-up">
            <Link to="/patient" className="w-full-mobile">
              <Button size="lg" className="shadow-lg" icon={Search}>
                Find a Bed Now
              </Button>
            </Link>
            <Link to="/login" className="w-full-mobile">
              <Button variant="secondary" size="lg">
                Hospital Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container-max stats-grid">
          <StatItem number="24/7" label="Real-time Availability" />
          <StatItem number="500+" label="Partner Hospitals" />
          <StatItem number="< 2m" label="Average Response" />
          <StatItem number="10k+" label="Lives Impacted" />
        </div>
      </section>

      {/* Features Grid */}
      {/* The Golden Hour Guaranteed Section */}
      <section id="features" className="golden-hour-section">
        <div className="container-max">
          <div className="section-header text-center">
            <h2 className="section-title">The Golden Hour Guaranteed</h2>
            <p className="section-subtitle">
              In medical emergencies, the first hour is critical. MedQueue ensures you reach the right hospital with available resources, instantly.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={Zap}
              title="Instant Matching"
              description="Our algorithm instantly identifies the nearest hospital with available beds, ICU capacity, and required equipment."
            />
            <FeatureCard
              icon={MapPin}
              title="Smart Routing"
              description="GPS-based viability scoring considers both distance and bed availability, not just proximity."
            />
            <FeatureCard
              icon={Shield}
              title="Digital Entry Pass"
              description="Secure your spot with a QR-coded digital ticket. Hospitals are notified before you arrive."
            />
          </div>
        </div>
      </section>

      {/* Three Steps to Care Section */}
      <section id="how-it-works" className="three-steps-section">
        <div className="container-max">
          <div className="section-header text-center" style={{ textAlign: 'center' }}>
            <h2 className="section-title2">Three Steps to Care</h2>
            <p className="section-subtitle">Simple, fast, and designed for emergencies</p>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Enable Location</h3>
              <p className="step-desc">Allow GPS access to instantly find nearby hospitals with real-time bed availability</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Choose & Notify</h3>
              <p className="step-desc">Select a hospital and submit basic details. The hospital is instantly alerted.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Navigate & Arrive</h3>
              <p className="step-desc">Get your digital ticket with QR code and navigate directly via Google Maps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Streamline Emergency Admissions Section */}
      <section id="hospitals" className="streamline-section">
        <div className="container-max streamline-content">
          <div className="streamline-text">
            <div className="badge-pill">For Healthcare Providers</div>
            <h2 className="streamline-title">Streamline Emergency Admissions</h2>
            <p className="streamline-desc">
              MedQueue's command center gives hospital managers real-time control over bed inventory and incoming patient notifications. Update capacity in seconds, not minutes.
            </p>

            <ul className="streamline-list">
              <li>
                <CheckCircle className="check-icon" size={20} />
                <div>
                  <strong>2-Second Updates</strong>
                  <p>Simple +/- controls for bed counts</p>
                </div>
              </li>
              <li>
                <CheckCircle className="check-icon" size={20} />
                <div>
                  <strong>Live Patient Queue</strong>
                  <p>See incoming patients with severity levels</p>
                </div>
              </li>
              <li>
                <CheckCircle className="check-icon" size={20} />
                <div>
                  <strong>Acknowledge or Divert</strong>
                  <p>One-tap actions for rapid triage</p>
                </div>
              </li>
            </ul>

            <Link to="/signup">
              <Button size="lg" className="mt-6">Join as Hospital Partner</Button>
            </Link>
          </div>
          <div className="streamline-image">
            {/* Placeholder for the UI screenshot from the user's request */}
            <div className="mock-ui-card">
              <div className="mock-header">
                <span>Live Capacity</span>
                <span className="mock-badge">Active</span>
              </div>
              <div className="mock-stats">
                <div className="mock-row"><span>General Beds</span><strong>12</strong></div>
                <div className="mock-row"><span>ICU Beds</span><strong>5</strong></div>
                <div className="mock-row"><span>Oxygen Beds</span><strong>8</strong></div>
              </div>
              <div className="mock-queue">
                <div className="mock-queue-title">Incoming Patients (3)</div>
                <div className="mock-patient-card critical">
                  <span>Sarah Johnson</span>
                  <span className="tag-critical">Critical</span>
                </div>
                <div className="mock-patient-card moderate">
                  <span>Michael Chen</span>
                  <span className="tag-moderate">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg-pattern"></div>
        <div className="container-max cta-content">
          <h2 className="cta-title">Ready to prioritize your health?</h2>
          <p className="cta-subtitle">
            Join thousands of users who trust MedQueue for their emergency medical needs.
          </p>
          <Link to="/signup">
            <Button variant="accent" size="lg" className="shadow-lg" icon={ArrowRight}>
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="stat-item text-center">
    <div className="stat-number">{number}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="feature-card">
    <div className="feature-icon">
      <Icon size={24} />
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </Card>
);

export default HomePage;
