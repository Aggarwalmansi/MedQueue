"use client";
import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const { token, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [pendingHospitals, setPendingHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      const [statsRes, pendingRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/admin/hospitals/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (statsRes.ok) {
        setStats(await statsRes.json())
      }
      if (pendingRes.ok) {
        setPendingHospitals(await pendingRes.json())
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (hospitalId, isVerified) => {
    try {
      setActionLoading(hospitalId)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      const response = await fetch(`${apiUrl}/api/admin/hospitals/${hospitalId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified })
      })

      if (response.ok) {
        // Remove from pending list
        setPendingHospitals(prev => prev.filter(h => h.id !== hospitalId))
        // Refresh stats
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error verifying hospital:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="admin-container"><div className="loading">Loading System...</div></div>

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🛡️ Super Admin</h2>
        </div>
        <ul className="nav-menu">
          <li
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span>📊</span> Overview
          </li>
          <li
            className={`nav-item ${activeTab === "verification" ? "active" : ""}`}
            onClick={() => setActiveTab("verification")}
          >
            <span>✅</span> Verification ({pendingHospitals.length})
          </li>
          <li className="nav-item" onClick={logout}>
            <span>🚪</span> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="content-header">
          <h1>
            {activeTab === "overview" ? "Global Overwatch" : "Verification Gatekeeper"}
          </h1>
          <button className="refresh-btn" onClick={fetchDashboardData}>↻ Refresh Data</button>
        </header>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard label="Total Hospitals" value={stats?.totalHospitals || 0} color="blue" />
              <StatCard label="Active Hospitals" value={stats?.activeHospitals || 0} color="green" />
              <StatCard label="Total Beds" value={stats?.totalBeds || 0} color="orange" />
              <StatCard label="System Health" value={stats?.systemHealth || "Unknown"} color="purple" />
            </div>

            {/* Map Placeholder */}
            <div className="section-container">
              <div className="section-title">
                <span>🗺️</span> Live System Map
              </div>
              <div className="map-placeholder">
                <div className="map-bg"></div>
                <p>Interactive Map Module (Coming Soon)</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "verification" && (
          <div className="section-container">
            <div className="section-title">
              <span>📋</span> Pending Approvals
            </div>

            <div className="pending-list">
              {pendingHospitals.length === 0 ? (
                <div className="empty-state">
                  <p>All caught up! No pending verifications.</p>
                </div>
              ) : (
                pendingHospitals.map(hospital => (
                  <div key={hospital.id} className="pending-card">
                    <div className="hospital-info">
                      <h3>{hospital.name}</h3>
                      <p>{hospital.address}, {hospital.city}</p>
                      <div className="manager-details">
                        Manager: {hospital.manager?.fullName} ({hospital.manager?.email})
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleVerification(hospital.id, true)}
                        disabled={actionLoading === hospital.id}
                      >
                        {actionLoading === hospital.id ? "..." : "Approve"}
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleVerification(hospital.id, false)}
                        disabled={actionLoading === hospital.id}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const StatCard = ({ label, value, color }) => (
  <div className={`stat-card ${color}`}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
)
