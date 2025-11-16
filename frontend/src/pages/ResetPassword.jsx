"use client"

import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import "../styles/ResetPassword.css"

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.message || "Error resetting password")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("[v0] Reset password error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-gradient-side">
        <div className="reset-password-gradient-content">
          <div className="reset-password-logo">MedQueue</div>
          <h2 className="reset-password-gradient-title">Secure Reset</h2>
          <p className="reset-password-gradient-subtitle">Create a strong password to protect your MedQueue account and access emergency bed information.</p>
          
          <div className="reset-password-security-tips">
            <h4>Password Tips</h4>
            <ul>
              <li>Use at least 8 characters</li>
              <li>Mix uppercase and lowercase</li>
              <li>Include numbers and symbols</li>
              <li>Avoid personal information</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="reset-password-form-side">
        <div className="reset-password-form-wrapper">
          <div className="reset-password-form-header">
            <h1>Create New Password</h1>
            <p>Enter your reset code and new password</p>
          </div>

          {success ? (
            <div className="reset-password-success-box">
              <div className="reset-password-success-icon">✓</div>
              <h3>Password Reset Successfully</h3>
              <p>Your password has been updated. You can now sign in with your new password.</p>
              <p className="reset-password-small-text">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="reset-password-error-box">
                  <span className="reset-password-error-icon">⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="reset-password-input-group">
                  <label htmlFor="resetToken" className="reset-password-label">Reset Code</label>
                  <input
                    id="resetToken"
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="reset-password-input"
                    placeholder="Enter reset code from email"
                    required
                  />
                </div>

                <div className="reset-password-input-group">
                  <label htmlFor="newPassword" className="reset-password-label">New Password</label>
                  <div className="reset-password-password-wrapper">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="reset-password-input"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="reset-password-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="reset-password-input-group">
                  <label htmlFor="confirmPassword" className="reset-password-label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="reset-password-input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="reset-password-button"
                >
                  {loading ? (
                    <>
                      <span className="reset-password-spinner"></span>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}

          <p className="reset-password-back-text">
            Didn't receive the code?{" "}
            <Link to="/forgot-password" className="reset-password-back-link">
              Request again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
