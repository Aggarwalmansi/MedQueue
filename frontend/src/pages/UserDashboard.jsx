import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Input from "../components/ui/Input"
import { User, Mail, Phone, MapPin, History, Calendar, Search, Filter } from "lucide-react"
import "../styles/UserDashboard.css"

export default function UserDashboard() {
  const { token, user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock data for profile if not available
  const userProfile = {
    name: user?.name || "Patient Name",
    email: user?.email || "patient@example.com",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 Medical Drive, Health City"
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container-max header-content">
          <h1 className="header-title">Patient Portal</h1>
          <p className="header-subtitle">Manage your profile and view history</p>
        </div>
      </div>

      <div className="container-max dashboard-layout">
        {/* Sidebar Navigation */}
        <div className="dashboard-sidebar">
          <Card className="sidebar-card">
            <button
              onClick={() => setActiveTab('profile')}
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} /> My Profile
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
            >
              <History size={18} /> Booking History
            </button>
          </Card>
        </div>

        {/* Content Area */}
        <div className="dashboard-main">
          {activeTab === 'profile' && (
            <div className="profile-section animate-fade-in">
              <Card className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {userProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="profile-name">{userProfile.name}</h2>
                    <p className="profile-id">Patient ID: #PT-2024-892</p>
                  </div>
                </div>

                <div className="profile-grid">
                  <div className="profile-field">
                    <label className="field-label">Full Name</label>
                    <div className="field-value">
                      <User size={18} className="field-icon" /> {userProfile.name}
                    </div>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Email Address</label>
                    <div className="field-value">
                      <Mail size={18} className="field-icon" /> {userProfile.email}
                    </div>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Phone Number</label>
                    <div className="field-value">
                      <Phone size={18} className="field-icon" /> {userProfile.phone}
                    </div>
                  </div>
                  <div className="profile-field">
                    <label className="field-label">Address</label>
                    <div className="field-value">
                      <MapPin size={18} className="field-icon" /> {userProfile.address}
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <Button variant="secondary">Edit Profile</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section animate-fade-in">
              <div className="history-filters">
                <Input placeholder="Search history..." icon={Search} className="search-input" />
                <Button variant="secondary" icon={Filter}>Filter</Button>
              </div>

              {/* Mock History Data */}
              <div className="history-list">
                {[1, 2, 3].map((item) => (
                  <Card key={item} className="history-item">
                    <div className="history-info">
                      <div className="history-date">
                        NOV<br />2{item}
                      </div>
                      <div>
                        <h3 className="history-hospital">City General Hospital</h3>
                        <p className="history-details">
                          <Calendar size={14} /> Emergency Booking • Cardiac
                        </p>
                      </div>
                    </div>
                    <Badge variant={item === 1 ? 'success' : 'default'}>
                      {item === 1 ? 'Completed' : 'Past'}
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
