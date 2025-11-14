"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import "../styles/ManagerDashboard.css"
import ManagerMainDashboard from "../components/manager/ManagerMainDashboard"
import BookingManagement from "../components/manager/BookingManagement"
import BedManagementPage from "../components/manager/BedManagementPage"
import HospitalProfilePage from "../components/manager/HospitalProfilePage"

export default function ManagerDashboard() {
  const { user, token } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (user?.hospitalId) {
      fetchHospitalData()
    }
  }, [user?.hospitalId, token])

  const fetchHospitalData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/hospitals/${user.hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setHospital(data)
      }
    } catch (error) {
      console.error("Error fetching hospital:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )

  return (
    <div>
      <Header scrolled={scrolled} />

      {/* Add padding-top to account for fixed header */}
      <div style={{ paddingTop: "80px" }}>
        <div className="manager-dashboard">
          {/* Sidebar Navigation */}
          <nav className="manager-sidebar">
            <div className="sidebar-header">
              <h3>{hospital?.name}</h3>
            </div>
            <ul className="nav-items">
              <li>
                <button
                  className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
                  onClick={() => setCurrentPage("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "bookings" ? "active" : ""}`}
                  onClick={() => setCurrentPage("bookings")}
                >
                  Bookings
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "beds" ? "active" : ""}`}
                  onClick={() => setCurrentPage("beds")}
                >
                  Bed Management
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
                  onClick={() => setCurrentPage("profile")}
                >
                  Hospital Profile
                </button>
              </li>
            </ul>
          </nav>

          {/* Main Content Area */}
          <main className="manager-content">
            {currentPage === "dashboard" && <ManagerMainDashboard hospital={hospital} token={token} />}
            {currentPage === "bookings" && <BookingManagement hospital={hospital} token={token} />}
            {currentPage === "beds" && <BedManagementPage hospital={hospital} token={token} />}
            {currentPage === "profile" && (
              <HospitalProfilePage hospital={hospital} setHospital={setHospital} token={token} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
