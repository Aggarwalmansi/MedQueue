"use client"
import React from "react"
import { useState, useEffect } from "react"
import BedList from "./BedList"
import AddBedForm from "./AddBedForm"
import "../styles/BedManagement.css"

export default function BedManagement({ hospitalId, token, onUpdate }) {
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    fetchBeds()
  }, [hospitalId, token])

  const fetchBeds = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/beds/hospital/${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch beds")
      const data = await response.json()
      setBeds(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBedAdded = () => {
    setShowAddForm(false)
    fetchBeds()
    onUpdate()
  }

  const handleBedUpdated = () => {
    fetchBeds()
    onUpdate()
  }

  const handleBedDeleted = () => {
    fetchBeds()
    onUpdate()
  }

  const filteredBeds = filterStatus === "ALL" ? beds : beds.filter((bed) => bed.status === filterStatus)

  return (
    <div className="bed-management">
      {/* Toolbar */}
      <div className="bed-toolbar">
        <div className="filter-section">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Beds</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="CLEANING">Cleaning</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <button className="add-bed-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "✕ Cancel" : "+ Add Bed"}
        </button>
      </div>

      {/* Add Bed Form */}
      {showAddForm && (
        <AddBedForm
          hospitalId={hospitalId}
          token={token}
          onBedAdded={handleBedAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Beds List */}
      {loading ? (
        <div className="loading-spinner">Loading beds...</div>
      ) : (
        <BedList beds={filteredBeds} token={token} onBedUpdated={handleBedUpdated} onBedDeleted={handleBedDeleted} />
      )}
    </div>
  )
}
