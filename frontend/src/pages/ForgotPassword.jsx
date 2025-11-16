"use client"
import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../styles/ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setTimeout(() => {
          navigate("/reset-password", { state: { email } })
        }, 2000)
      } else {
        setError(data.message || "Error requesting password reset")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("[v0] Forgot password error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-gradient-side">
        <div className="forgot-password-gradient-content">
          <div className="forgot-password-logo">MedQueue</div>
          <h2 className="forgot-password-gradient-title">Recovery Steps</h2>
          <p className="forgot-password-gradient-subtitle">We'll send password reset instructions to your email within seconds.</p>
          
          <div className="forgot-password-steps">
            <div className="forgot-password-step">
              <div className="forgot-password-step-number">1</div>
              <p>Enter your email address</p>
            </div>
            <div className="forgot-password-step">
              <div className="forgot-password-step-number">2</div>
              <p>Check your email for reset link</p>
            </div>
            <div className="forgot-password-step">
              <div className="forgot-password-step-number">3</div>
              <p>Create your new password</p>
            </div>
          </div>
        </div>
      </div>

      <div className="forgot-password-form-side">
        <div className="forgot-password-form-wrapper">
          <div className="forgot-password-form-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive reset instructions</p>
          </div>

          {submitted ? (
            <div className="forgot-password-success-box">
              <div className="forgot-password-success-icon">✓</div>
              <h3>Check Your Email</h3>
              <p>We've sent password reset instructions to {email}</p>
              <p className="forgot-password-small-text">Redirecting to reset page...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="forgot-password-error-box">
                  <span className="forgot-password-error-icon">⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="forgot-password-input-group">
                  <label htmlFor="email" className="forgot-password-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="forgot-password-input"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="forgot-password-button"
                >
                  {loading ? (
                    <>
                      <span className="forgot-password-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            </>
          )}

          <p className="forgot-password-back-text">
            Remember your password?{" "}
            <Link to="/login" className="forgot-password-back-link">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
