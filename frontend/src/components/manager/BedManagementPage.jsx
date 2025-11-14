"use client"
import React from "react"
import { useState, useEffect } from "react"
import "../../styles/BedManagementPage.css";


export default function BedManagementPage({ hospital, token }) {
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [changingBedId, setChangingBedId] = useState(null)

  useEffect(() => {
    fetchBeds()
  }, [hospital])

  const fetchBeds = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/api/beds/hospital/${hospital.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setBeds(data)
      }
    } catch (error) {
      console.error("Error fetching beds:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bedId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/beds/${bedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchBeds()
        setChangingBedId(null)
      }
    } catch (error) {
      console.error("Error updating bed:", error)
    }
  }

  const bedsByType = beds.reduce((acc, bed) => {
    if (!acc[bed.type]) acc[bed.type] = []
    acc[bed.type].push(bed)
    return acc
  }, {})

  if (loading) return <div className="loading">Loading beds...</div>

  return (
    <div className="bed-management-page">
      <div className="page-header">
        <h1>Bed Management</h1>
        <p className="subtitle">Update bed status and manage availability</p>
      </div>

      <div className="beds-grouped">
        {Object.entries(bedsByType).map(([bedType, bedsOfType]) => (
          <div key={bedType} className="bed-type-section">
            <h2 className="bed-type-title">{bedType} Beds</h2>
            <div className="beds-list">
              {bedsOfType.map((bed) => (
                <div key={bed.id} className="bed-row">
                  <div className="bed-info">
                    <span className="bed-number">Bed {bed.bedNumber}</span>
                    <span className={`bed-status status-${bed.status.toLowerCase()}`}>{bed.status}</span>
                  </div>
                  <div className="bed-actions">
                    {changingBedId === bed.id ? (
                      <select
                        className="status-dropdown"
                        onChange={(e) => handleStatusChange(bed.id, e.target.value)}
                        onBlur={() => setChangingBedId(null)}
                        autoFocus
                      >
                        <option value="">Select Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    ) : (
                      <button className="btn-change-status" onClick={() => setChangingBedId(bed.id)}>
                        Change Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
