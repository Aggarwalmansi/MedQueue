"use client"
import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Signup.css"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("USER")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { signup, error } = useAuth()
  const navigate = useNavigate()

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePassword()) {
      return
    }

    setLoading(true)
    const result = await signup(email, password, role)

    if (result.success) {
      navigate("/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="signup-container">
      <div className="signup-gradient-side">
        <div className="signup-gradient-content">
          <div className="signup-logo">MedQueue</div>
          <h2 className="signup-gradient-title">Start Saving Lives</h2>
          <p className="signup-gradient-subtitle">Join thousands using MedQueue to find available hospital beds instantly during emergencies.</p>
          
          <div className="signup-benefits">
            <div className="signup-benefit-item">
              <div className="signup-benefit-icon">1</div>
              <div>
                <h4>For Patients</h4>
                <p>Find nearest hospitals with available beds</p>
              </div>
            </div>
            <div className="signup-benefit-item">
              <div className="signup-benefit-icon">2</div>
              <div>
                <h4>For Managers</h4>
                <p>Track and manage bed availability</p>
              </div>
            </div>
            <div className="signup-benefit-item">
              <div className="signup-benefit-icon">3</div>
              <div>
                <h4>For Admins</h4>
                <p>System oversight and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-form-side">
        <div className="signup-form-wrapper">
          <div className="signup-form-header">
            <h1>Create Account</h1>
            <p>Join MedQueue in 3 simple steps</p>
          </div>

          {error && (
            <div className="signup-error-box">
              <span className="signup-error-icon">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-input-group">
              <label htmlFor="email" className="signup-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="signup-input-group">
              <label htmlFor="role" className="signup-label">Account Type</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="signup-input signup-select"
              >
                <option value="USER">Patient - Find hospital beds</option>
                <option value="HOSPITAL_MANAGER">Hospital Manager - Manage beds</option>
                <option value="ADMIN">Admin - System oversight</option>
              </select>
            </div>

            <div className="signup-input-group">
              <label htmlFor="password" className="signup-label">Password</label>
              <div className="signup-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="signup-hint">At least 8 characters</p>
            </div>

            <div className="signup-input-group">
              <label htmlFor="confirm-password" className="signup-label">Confirm Password</label>
              <div className="signup-password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="signup-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="signup-password-error">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="signup-button"
            >
              {loading ? (
                <>
                  <span className="signup-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="signup-signin-text">
            Already have an account?{" "}
            <Link to="/login" className="signup-signin-link">
              Sign in
            </Link>
          </p>

          <p className="signup-footer-text">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
