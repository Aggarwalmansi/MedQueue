"use client"
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Activity, ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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
        }, 3000)
      } else {
        setError(data.message || "Error requesting password reset")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("Forgot password error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Activity size={24} />
            <span>MedQueue</span>
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="success-state">
            <div className="success-icon">
              <CheckCircle size={32} />
            </div>
            <h3>Check Your Email</h3>
            <p>We've sent password reset instructions to <strong>{email}</strong></p>
            <p className="redirect-text">Redirecting to reset page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-alert">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-full"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
