"use client"
import React, { useState, useEffect } from "react"
import "../../styles/BookingManagement.css";

export default function BookingManagement({ hospital, token }) {
  const [activeTab, setActiveTab] = useState("ALL") // Status filter
  const [sourceFilter, setSourceFilter] = useState("ALL") // Source filter
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [activeTab, sourceFilter, hospital])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      // Build query parameters
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.append('status', activeTab);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      params.append('hId', hospital.id);

      const response = await fetch(`${apiUrl}/api/hospital/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/hospital/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h1>All Appointments & Bookings</h1>
        <p className="helper-text">Shows every appointment created from triage, calendar, and other channels in one unified list.</p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Source:</label>
          <div className="booking-tabs">
            {["ALL", "TRIAGE", "CALENDAR"].map((source) => (
              <button key={source} className={`tab ${sourceFilter === source ? "active" : ""}`} onClick={() => setSourceFilter(source)}>
                {source.charAt(0) + source.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <div className="booking-tabs">
            {["ALL", "INCOMING", "ADMITTED", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
              <button key={status} className={`tab ${activeTab === status ? "active" : ""}`} onClick={() => setActiveTab(status)}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="empty-state">No bookings found matching filters</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <div className="booking-meta-top">
                  <span className={`badge source-${booking.source?.toLowerCase() || 'triage'}`}>
                    {booking.source || 'TRIAGE'}
                  </span>
                  <span className={`badge status-${booking.status?.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <h3 className="user-name">{booking.patientName}</h3>
                <p className="condition-text">Condition: {booking.condition}</p>
                <div className="booking-details">
                  {booking.appointmentTime && (
                    <p className="appointment-time">
                      📅 {new Date(booking.appointmentTime).toLocaleString()}
                    </p>
                  )}
                  <p className="time-ago">Created {getTimeAgo(booking.createdAt)}</p>
                </div>
              </div>

              <div className="booking-actions">
                {booking.status === 'INCOMING' && (
                  <>
                    <button className="btn-approve" onClick={() => handleStatusUpdate(booking.id, 'ADMITTED')}>
                      Admit
                    </button>
                    <button className="btn-reject" onClick={() => handleStatusUpdate(booking.id, 'DIVERTED')}>
                      Divert
                    </button>
                  </>
                )}
                {booking.status === 'SCHEDULED' && (
                  <button className="btn-approve" onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}>
                    Complete
                  </button>
                )}
                {['INCOMING', 'SCHEDULED'].includes(booking.status) && (
                  <button className="btn-cancel" onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function getTimeAgo(createdAt) {
  const seconds = Math.floor((Date.now() - new Date(createdAt)) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
