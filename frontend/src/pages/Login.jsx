"use client"
import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate("/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-gradient-side">
        <div className="login-gradient-content">
          <div className="login-logo">MedQueue</div>
          <h2 className="login-gradient-title">Welcome Back</h2>
          <p className="login-gradient-subtitle">Find hospital beds near you in seconds. Emergency-ready. Real-time. Life-saving.</p>
          
          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <p>Real-time bed availability</p>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <p>Instant hospital search</p>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <p>Distance-based filtering</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h1>Sign In</h1>
            <p>Access your MedQueue account</p>
          </div>

          {error && (
            <div className="login-error-box">
              <span className="login-error-icon">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email" className="login-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password" className="login-label">Password</label>
              <div className="login-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Link to="/forgot-password" className="login-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="login-signup-text">
            Don't have an account?{" "}
            <Link to="/signup" className="login-signup-link">
              Create one
            </Link>
          </p>

          <p className="login-footer-text">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
