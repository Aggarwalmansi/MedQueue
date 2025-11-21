"use client"
import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Signup.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
    fullName: "",
    phone: "",
    hospitalName: "",
    address: "",
    city: "",
    latitude: "",
    longitude: ""
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { signup, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
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
    // Clean up data before sending
    const dataToSend = { ...formData }
    delete dataToSend.confirmPassword
    if (dataToSend.role !== 'HOSPITAL') {
      delete dataToSend.hospitalName
      delete dataToSend.address
      delete dataToSend.city
      delete dataToSend.latitude
      delete dataToSend.longitude
    }

    const result = await signup(dataToSend)

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
              <label htmlFor="fullName" className="signup-label">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="signup-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="signup-input-group">
              <label htmlFor="email" className="signup-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="signup-input-group">
              <label htmlFor="phone" className="signup-label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="signup-input"
                placeholder="1234567890"
              />
            </div>

            <div className="signup-input-group">
              <label htmlFor="role" className="signup-label">Account Type</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="signup-input signup-select"
              >
                <option value="PATIENT">Patient - Find hospital beds</option>
                <option value="HOSPITAL">Hospital Manager - Manage beds</option>
                <option value="ADMIN">Admin - System oversight</option>
              </select>
            </div>

            {formData.role === 'HOSPITAL' && (
              <>
                <div className="signup-input-group">
                  <label htmlFor="hospitalName" className="signup-label">Hospital Name</label>
                  <input
                    id="hospitalName"
                    type="text"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="General Hospital"
                    required
                  />
                </div>
                <div className="signup-input-group">
                  <label htmlFor="address" className="signup-label">Address</label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="signup-input-group">
                  <label htmlFor="city" className="signup-label">City</label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="New York"
                  />
                </div>
                <div className="signup-row">
                  <div className="signup-input-group">
                    <label htmlFor="latitude" className="signup-label">Latitude</label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="signup-input"
                      placeholder="40.7128"
                      required
                    />
                  </div>
                  <div className="signup-input-group">
                    <label htmlFor="longitude" className="signup-label">Longitude</label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="signup-input"
                      placeholder="-74.0060"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="signup-input-group">
              <label htmlFor="password" className="signup-label">Password</label>
              <div className="signup-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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
              <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
              <div className="signup-password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
