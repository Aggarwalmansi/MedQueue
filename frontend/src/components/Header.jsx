"use client"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, LogOut, ChevronDown } from "lucide-react"
import "../styles/Header.css"

export default function Header({ scrolled }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="logo-text">MedQueue</span>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#contact">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu-container" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-profile-pill">
                <div className="user-avatar">
                  {user?.name ? user.name[0].toUpperCase() : <User size={16} />}
                </div>
                <span className="user-name-display">{user?.name || user?.email?.split('@')[0]}</span>
                <ChevronDown size={14} className={`menu-chevron ${menuOpen ? 'open' : ''}`} />
              </div>

              {menuOpen && (
                <div className="dropdown-menu animate-fade-in">
                  <div className="dropdown-header">
                    <span className="dropdown-role">{user?.role}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => navigate('/my-bookings')} className="dropdown-item">
                    <User size={16} />
                    My Bookings
                  </button>
                  <button onClick={handleLogout} className="dropdown-item danger">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn-secondary">
                Sign In
              </button>
              <button onClick={() => navigate("/signup")} className="btn-primary">
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
