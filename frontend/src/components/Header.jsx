"use client"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Header.css"

export default function Header({ scrolled }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">⚕️</div>
          <span className="logo-text">MedQueue</span>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="#features">How It Works</Link>
          <Link to="#solution">Features</Link>
          <Link to="#contact">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.email?.split("@")[0]}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
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
