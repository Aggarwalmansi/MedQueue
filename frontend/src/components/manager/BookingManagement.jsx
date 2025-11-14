"use client"
import React from "react"
import { useState, useEffect } from "react"
import "../../styles/BookingManagement.css";


export default function BookingManagement({ hospital, token }) {
  const [activeTab, setActiveTab] = useState("PENDING")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [activeTab, hospital])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/bookings/hospital/${hospital.id}/status/${activeTab}`, {
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

  const handleApprove = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error approving booking:", error)
    }
  }

  const handleReject = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error rejecting booking:", error)
    }
  }

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h1>Booking Management</h1>
      </div>

      {/* Tabs */}
      <div className="booking-tabs">
        {["PENDING", "CONFIRMED", "REJECTED"].map((tab) => (
          <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="empty-state">No {activeTab.toLowerCase()} bookings</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <h3 className="user-name">Request from {booking.user.email}</h3>
                <p className="bed-type">{booking.bedType} Bed</p>
                <p className="time-ago">Submitted {getTimeAgo(booking.createdAt)}</p>
              </div>
              {activeTab === "PENDING" && (
                <div className="booking-actions">
                  <button className="btn-approve" onClick={() => handleApprove(booking.id)}>
                    Approve
                  </button>
                  <button className="btn-reject" onClick={() => handleReject(booking.id)}>
                    Reject
                  </button>
                </div>
              )}
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
