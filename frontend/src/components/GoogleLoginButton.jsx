"use client"
import React from "react"
import "../styles/GoogleLoginButton.css" // adjust path if your styles are elsewhere

export default function GoogleLoginButton({ className = "" }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
  const handleClick = () => {
    window.location.href = `${apiUrl}/api/auth/google`
  }

  return (
    <button
      type="button"
      className={`google-btn ${className}`}
      onClick={handleClick}
      aria-label="Continue with Google"
    >
      <span className="g-logo" aria-hidden="true">
        <svg viewBox="0 0 533.5 544.3" width="20" height="20" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <path d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.3h147.1c-6.4 34.5-25.9 63.8-55.4 83.3v69.2h89.4c52.4-48.3 82.4-119.4 82.4-197.4z" fill="#4285F4"/>
          <path d="M272 544.3c73.5 0 135.3-24.4 180.4-66.5l-89.4-69.2c-24.9 16.7-56.7 26.6-91 26.6-69.8 0-129-47.1-150.1-110.1H28.3v69.7C73.2 487 166.5 544.3 272 544.3z" fill="#34A853"/>
          <path d="M121.9 327.1c-10.9-32.9-10.9-68.9 0-101.8V155.6H28.3c-39.6 78.9-39.6 170.6 0 249.5l93.6-78z" fill="#FBBC05"/>
          <path d="M272 107.7c38.2-.6 74 13.7 101.5 39.6l76.2-76.2C405.3 24.8 344.1 0 272 0 166.5 0 73.2 57.3 28.3 155.6l93.6 69.7C143 154.8 202.2 107.7 272 107.7z" fill="#EA4335"/>
        </svg>
      </span>
      <span className="g-text">Continue with Google</span>
    </button>
  )
}