import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { Shield, Activity, CheckCircle, XCircle, Users, Building, Map, RefreshCw, LogOut } from "lucide-react"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const { token, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [allHospitals, setAllHospitals] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      const [statsRes, pendingRes, allRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/admin/hospitals/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/admin/hospitals/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (statsRes.ok) {
        setStats(await statsRes.json())
      }
      if (pendingRes.ok) {
        setPendingHospitals(await pendingRes.json())
      }
      if (allRes.ok) {
        setAllHospitals(await allRes.json())
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      setAllHospitals([])
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
        // Update all hospitals list
        setAllHospitals(prev => prev.map(h =>
          h.id === hospitalId ? { ...h, isVerified } : h
        ))
        // Refresh stats
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error verifying hospital:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading && !stats) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin System...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container-max admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <Card className="sidebar-card">
            <div className="sidebar-header">
              <Shield size={24} className="text-primary" />
              <h2>Admin Panel</h2>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <Activity size={18} /> Overview
              </button>
              <button
                className={`nav-item ${activeTab === "hospitals" ? "active" : ""}`}
                onClick={() => setActiveTab("hospitals")}
              >
                <Building size={18} /> Hospitals
              </button>
              <button
                className={`nav-item ${activeTab === "verification" ? "active" : ""}`}
                onClick={() => setActiveTab("verification")}
              >
                <CheckCircle size={18} />
                Approvals
                {pendingHospitals.length > 0 && (
                  <Badge variant="warning" className="nav-badge">{pendingHospitals.length}</Badge>
                )}
              </button>
            </nav>

            <div className="sidebar-footer">
              <button className="nav-item logout" onClick={logout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          <div className="content-header">
            <div>
              <h1 className="page-title">
                {activeTab === "overview" ? "System Overview" :
                  activeTab === "hospitals" ? "Hospital Management" : "Pending Approvals"}
              </h1>
              <p className="page-subtitle">
                {activeTab === "overview"
                  ? "Monitor system health and hospital statistics"
                  : activeTab === "hospitals"
                    ? "Manage all registered hospitals and their status"
                    : "Verify and approve new hospital registrations"}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={fetchDashboardData} icon={RefreshCw}>
              Refresh
            </Button>
          </div>

          {activeTab === "overview" && (
            <div className="overview-section animate-fade-in">
              {/* Stats Grid */}
              <div className="stats-grid">
                <StatCard
                  icon={Building}
                  label="Total Hospitals"
                  value={stats?.totalHospitals || 0}
                  trend="+2 this week"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Active Hospitals"
                  value={stats?.activeHospitals || 0}
                  trend="98% uptime"
                />
                <StatCard
                  icon={Activity}
                  label="Total Beds"
                  value={stats?.totalBeds || 0}
                  trend="Live count"
                />
                <StatCard
                  icon={Users}
                  label="System Health"
                  value={stats?.systemHealth || "Good"}
                  trend="All systems go"
                />
              </div>

              {/* Map Placeholder */}
              <Card className="map-section">
                <div className="section-header">
                  <h3><Map size={20} /> Live System Map</h3>
                </div>
                <div className="map-placeholder">
                  <div className="map-bg"></div>
                  <div className="map-content">
                    <Map size={48} className="text-stone-300" />
                    <p>Interactive Hospital Map Module</p>
                    <span className="coming-soon">Coming Soon</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "hospitals" && (
            <div className="hospitals-section animate-fade-in">
              <div className="hospitals-list">
                {Array.isArray(allHospitals) && allHospitals.length > 0 ? (
                  allHospitals.map(hospital => (
                    <Card key={hospital.id} className="hospital-row-card">
                      <div className="hospital-info-row">
                        <div className="info-main">
                          <h3>{hospital.name}</h3>
                          <div className="info-meta">
                            <span className="meta-item"><Map size={14} /> {hospital.city}</span>
                            <span className="meta-item"><Users size={14} /> {hospital.manager?.fullName}</span>
                          </div>
                        </div>

                        <div className="status-actions">
                          <Badge variant={hospital.isVerified ? "success" : "warning"}>
                            {hospital.isVerified ? "Active" : "Inactive/Pending"}
                          </Badge>

                          <Button
                            variant={hospital.isVerified ? "outline" : "primary"}
                            size="sm"
                            className={hospital.isVerified ? "deactivate-btn" : "activate-btn"}
                            onClick={() => handleVerification(hospital.id, !hospital.isVerified)}
                            disabled={actionLoading === hospital.id}
                            isLoading={actionLoading === hospital.id}
                          >
                            {hospital.isVerified ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="empty-state-message">
                    <p>No hospitals found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "verification" && (
            <div className="verification-section animate-fade-in">
              {pendingHospitals.length === 0 ? (
                <Card className="empty-state">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <h3>All Caught Up!</h3>
                  <p>There are no pending hospital registrations to review.</p>
                </Card>
              ) : (
                <div className="pending-list">
                  {pendingHospitals.map(hospital => (
                    <Card key={hospital.id} className="pending-card">
                      <div className="hospital-info">
                        <div className="hospital-header">
                          <h3>{hospital.name}</h3>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                        <p className="hospital-address">{hospital.address}, {hospital.city}</p>

                        <div className="manager-info">
                          <strong>Manager:</strong> {hospital.manager?.fullName}
                          <span className="email">({hospital.manager?.email})</span>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <Button
                          variant="secondary"
                          className="reject-btn"
                          onClick={() => handleVerification(hospital.id, false)}
                          disabled={actionLoading === hospital.id}
                          icon={XCircle}
                        >
                          Reject
                        </Button>
                        <Button
                          className="approve-btn"
                          onClick={() => handleVerification(hospital.id, true)}
                          disabled={actionLoading === hospital.id}
                          isLoading={actionLoading === hospital.id}
                          icon={CheckCircle}
                        >
                          Approve
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div >
    </div >
  )
}

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <Card className="stat-card">
    <div className="stat-icon">
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-trend">{trend}</span>
    </div>
  </Card>
)
