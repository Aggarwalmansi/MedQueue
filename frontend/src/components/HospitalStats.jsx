"use client"
import React from "react"
import "../styles/HospitalStats.css"

export default function HospitalStats({ stats, onRefresh }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#10b981" // emerald
      case "occupied":
        return "#f59e0b" // amber
      case "cleaning":
        return "#3b82f6" // blue
      case "maintenance":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Bed Statistics</h2>
        <button className="refresh-btn" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>

      {/* Total Stats */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-label">Total Beds</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card available">
          <div className="stat-label">Available</div>
          <div className="stat-value">{stats.available}</div>
        </div>

        <div className="stat-card occupied">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{stats.occupied || 0}</div>
        </div>

        <div className="stat-card cleaning">
          <div className="stat-label">Cleaning</div>
          <div className="stat-value">{stats.cleaning || 0}</div>
        </div>

        <div className="stat-card maintenance">
          <div className="stat-label">Maintenance</div>
          <div className="stat-value">{stats.maintenance || 0}</div>
        </div>
      </div>

      {/* By Type Stats */}
      {Object.keys(stats.byType).length > 0 && (
        <div className="by-type-section">
          <h3>Beds by Type</h3>
          <div className="type-grid">
            {Object.entries(stats.byType).map(([type, data]) => (
              <div key={type} className="type-card">
                <div className="type-label">{type}</div>
                <div className="type-stats">
                  <span className="type-total">{data.total} total</span>
                  <span className="type-available">{data.available} available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
