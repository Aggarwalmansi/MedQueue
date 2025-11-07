"use client"
import React from "react"
import { useState } from "react"
import "../styles/AddBedForm.css"

export default function AddBedForm({ hospitalId, token, onBedAdded, onCancel }) {
  const [formData, setFormData] = useState({
    bedNumber: "",
    type: "GENERAL",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.bedNumber.trim()) {
      setError("Bed number is required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/beds`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bedNumber: formData.bedNumber,
          type: formData.type,
          hospitalId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create bed")
      }

      onBedAdded()
      setFormData({ bedNumber: "", type: "GENERAL" })
    } catch (err) {
      setError(err.message)
      console.error("Error creating bed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="add-bed-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="bedNumber">Bed Number</label>
        <input
          type="text"
          id="bedNumber"
          name="bedNumber"
          value={formData.bedNumber}
          onChange={handleChange}
          placeholder="e.g., A-101"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Bed Type</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} disabled={loading}>
          <option value="GENERAL">General</option>
          <option value="ICU">ICU</option>
          <option value="PEDIATRIC">Pediatric</option>
          <option value="VENTILATOR">Ventilator</option>
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Creating..." : "Create Bed"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  )
}
