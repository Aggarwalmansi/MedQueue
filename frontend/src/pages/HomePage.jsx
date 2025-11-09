"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../styles/HomePage.css"

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFindBeds = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="home-page">
      <Header scrolled={scrolled} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Hospital Beds Near You</h1>
          <p className="hero-subtitle">Real-time bed availability. Emergency-ready. Save lives.</p>

          <button onClick={handleFindBeds} className="cta-button">
            <span className="button-text">Find Beds Near Me</span>
            <span className="button-arrow">→</span>
          </button>

          <p className="hero-cta-subtext">
            {isAuthenticated ? "View hospitals in your area now" : "Sign in to search hospitals near you"}
          </p>
        </div>

        <div className="hero-background">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2>The Problem We Solve</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-number">1</div>
              <h3>Wasted Time</h3>
              <p>Patients and families waste crucial minutes moving between hospitals searching for available beds</p>
            </div>
            <div className="problem-card">
              <div className="problem-number">2</div>
              <h3>Lost Lives</h3>
              <p>Every minute counts in emergencies. Delays can mean the difference between recovery and tragedy</p>
            </div>
            <div className="problem-card">
              <div className="problem-number">3</div>
              <h3>No Real-Time Data</h3>
              <p>Hospital capacity information is fragmented, outdated, or completely unavailable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="container">
          <h2>How MedQueue Works</h2>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">📍</div>
              <h3>Location Detection</h3>
              <p>MedQueue instantly identifies your location with precision</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🔍</div>
              <h3>Real-Time Search</h3>
              <p>Find available beds across all nearby hospitals instantly</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🛏️</div>
              <h3>Bed Availability</h3>
              <p>View bed types (ICU, General, Pediatric, Ventilator)</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📞</div>
              <h3>Direct Contact</h3>
              <p>One-click contact to hospitals without delays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Hospitals Choose MedQueue</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h4>For Patients</h4>
              <ul>
                <li>Find nearest hospital in seconds</li>
                <li>Real-time bed availability</li>
                <li>Multiple bed type options</li>
                <li>Zero configuration needed</li>
              </ul>
            </div>
            <div className="feature-item">
              <h4>For Hospital Managers</h4>
              <ul>
                <li>Easy bed management dashboard</li>
                <li>Real-time bed status updates</li>
                <li>Visibility across the region</li>
                <li>Automated availability tracking</li>
              </ul>
            </div>
            <div className="feature-item">
              <h4>For Administrators</h4>
              <ul>
                <li>System-wide monitoring</li>
                <li>Regional hospital management</li>
                <li>User and role management</li>
                <li>Data analytics and insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>5000+</h3>
              <p>Beds Tracked</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Hospitals Connected</p>
            </div>
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Lives Helped</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Real-Time Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <h2>Ready to Save Lives?</h2>
          <p>Start finding available hospital beds right now</p>
          <button onClick={handleFindBeds} className="cta-button large">
            <span className="button-text">Get Started Now</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
