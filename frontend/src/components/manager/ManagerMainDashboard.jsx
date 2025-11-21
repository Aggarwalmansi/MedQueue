"use client"
import React from "react"
import "../../styles/ManagerMainDashboard.css"

export default function ManagerMainDashboard() {
  return (
    <div className="construction-container">
      <div className="construction-content">
        <div className="construction-icon">🚧</div>
        <h1>Analytics Dashboard</h1>
        <p>We are building something amazing for you.</p>
        <p className="sub-text">Advanced analytics, reporting, and insights are coming soon.</p>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <span className="progress-label">75% Complete</span>
      </div>
    </div>
  )
}
