"use client"
import React from "react"
import { useState } from "react"
import "../styles/BedCard.css"

export default function BedCard({ bed, token, onUpdated, onDeleted }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(bed.status)

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setSelectedStatus(newStatus)

    try {
      setIsUpdating(true)
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/beds/${bed.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update bed")
      onUpdated()
    } catch (err) {
      console.error("Error updating bed:", err)
      setSelectedStatus(bed.status)
      alert("Failed to update bed status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete bed ${bed.bedNumber}?`)) return

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/beds/${bed.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to delete bed")
      onDeleted()
    } catch (err) {
      console.error("Error deleting bed:", err)
      alert("Failed to delete bed")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "#10b981"
      case "OCCUPIED":
        return "#f59e0b"
      case "CLEANING":
        return "#3b82f6"
      case "MAINTENANCE":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="bed-card">
      <div className="bed-header">
        <div className="bed-info">
          <div className="bed-number">Bed {bed.bedNumber}</div>
          <div className="bed-type">{bed.type}</div>
        </div>
        <div className="status-indicator" style={{ backgroundColor: getStatusColor(bed.status) }} />
      </div>

      <div className="bed-controls">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="status-select"
          style={{ borderColor: getStatusColor(selectedStatus) }}
        >
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="CLEANING">Cleaning</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <button className="delete-btn" onClick={handleDelete} disabled={isUpdating}>
          Delete
        </button>
      </div>
    </div>
  )
}
