"use client"
import React from "react"
import { use, useState } from "react"

import "../../styles/HospitalProfilePage.css"
export default function HospitalProfilePage({ hospital, setHospital, token }) {
  const [formData, setFormData] = useState({
    name: hospital?.name || "",
    address: hospital?.address || "",
    contactPhone: hospital?.contactPhone || "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/hospitals/${hospital.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        const updatedHospital = await response.json()
        setHospital(updatedHospital)
        setMessage("Hospital profile updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hospital-profile-page">
      <div className="page-header">
        <h1>Hospital Profile</h1>
        <p className="subtitle">Manage your hospital's public information</p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Hospital Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}
      </form>
    </div>
  )
}
