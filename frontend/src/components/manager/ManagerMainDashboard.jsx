"use client"
import React from "react"
import { useState, useEffect } from "react"
import "../../styles/ManagerMainDashboard.css"

export default function ManagerMainDashboard({ hospital, token }) {
  const [stats, setStats] = useState(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [hospital])

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/beds/stats/${hospital.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/bookings/hospital/${hospital.id}/status/PENDING`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setPendingCount(bookingsData.length)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="main-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Manager</h1>
        <p className="hospital-name">Managing: {hospital.name}</p>
      </div>

      {/* Pending Bookings Card */}
      <div className="pending-bookings-section">
        <div className={`pending-card ${pendingCount > 0 ? "has-requests" : "no-requests"}`}>
          <div className="pending-content">
            <h2 className="pending-number">{pendingCount}</h2>
            <p className="pending-label">New Booking Requests</p>
          </div>
          <button className="pending-action-btn">Review Requests</button>
        </div>
      </div>

      {/* Bed Availability Summary */}
      <div className="bed-summary-section">
        <h2 className="section-title">Bed Availability</h2>
        <div className="stats-grid">
          {stats?.byType &&
            Object.entries(stats.byType).map(([bedType, counts]) => (
              <div key={bedType} className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">{bedType}</p>
                  <div className="stat-numbers">
                    <span className="available">{counts.available}</span>
                    <span className="total">/ {counts.total}</span>
                  </div>
                </div>
                <div className="stat-bar">
                  <div className="bar-fill" style={{ width: `${(counts.available / counts.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
        </div>

        {/* Quick Action Button */}
        <button className="manage-beds-btn">Manage All Beds</button>
      </div>
    </div>
  )
}
