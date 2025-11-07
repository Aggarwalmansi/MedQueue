"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import BedManagement from "../components/BedManagement"
import HospitalStats from "../components/HospitalStats"
// import BedList from "../components/BedList"
// import AddBedForm from "../components/AddBedForm"
import "../styles/ManagerDashboard.css"

export default function ManagerDashboard() {
  const { user, token } = useAuth()
  const [hospital, setHospital] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.hospitalId) {
      fetchHospitalData()
    }
  }, [user?.hospitalId, token])

  const fetchHospitalData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"

      const [hospitalRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/api/hospitals/${user.hospitalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/api/beds/stats/${user.hospitalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (!hospitalRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch hospital data")
      }

      const hospitalData = await hospitalRes.json()
      const statsData = await statsRes.json()

      setHospital(hospitalData)
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching hospital data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
     
      <div className="dashboard-header">
        <h1>Hospital Dashboard</h1>
        <p className="hospital-name">{hospital?.name}</p>
        <p className="hospital-address">{hospital?.address}</p>
      </div>

  
      {stats && <HospitalStats stats={stats} onRefresh={fetchHospitalData} />}

  
      <div className="bed-management-section">
        <h2>Bed Management</h2>
        <BedManagement hospitalId={user.hospitalId} token={token} onUpdate={fetchHospitalData} />
      </div>
    </div>
  )
}
