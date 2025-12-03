"use client"
import React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import "../styles/ManagerDashboard.css"
import AdmittedPatients from "../components/manager/AdmittedPatients"
import TriageDashboard from "../components/manager/TriageDashboard"
import ManagerMainDashboard from "../components/manager/ManagerMainDashboard"
import BookingManagement from "../components/manager/BookingManagement"
import HospitalProfilePage from "../components/manager/HospitalProfilePage"
import ERManagementPanel from "../components/manager/ERManagementPanel"
import FacilitiesManagement from "../components/manager/FacilitiesManagement"

export default function ManagerDashboard() {
  const { user, token } = useAuth()
  const [currentPage, setCurrentPage] = useState("triage")
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      fetchHospitalData()
    }
  }, [user, token])

  const fetchHospitalData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/hospital/profile`, {
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
              {hospital?.id ? (
                <Link to={`/hospital/${hospital.id}/details`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{hospital?.name || "Hospital Manager"}</h3>
                </Link>
              ) : (
                <h3>{hospital?.name || "Hospital Manager"}</h3>
              )}
            </div>
            <ul className="nav-items">
              <li>
                <button
                  className={`nav-link ${currentPage === "triage" ? "active" : ""}`}
                  onClick={() => setCurrentPage("triage")}
                >
                  🚨 Triage (Live)
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "history" ? "active" : ""}`}
                  onClick={() => setCurrentPage("history")}
                >
                  📂 History
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
                  onClick={() => setCurrentPage("dashboard")}
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "bookings" ? "active" : ""}`}
                  onClick={() => setCurrentPage("bookings")}
                >
                  All Appointments & Bookings
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "er-management" ? "active" : ""}`}
                  onClick={() => setCurrentPage("er-management")}
                >
                  🚑 ER Wait Times
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentPage === "facilities" ? "active" : ""}`}
                  onClick={() => setCurrentPage("facilities")}
                >
                  🏥 Facilities
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
            {currentPage === "triage" && <TriageDashboard hospital={hospital} token={token} />}
            {currentPage === "history" && <AdmittedPatients hospital={hospital} token={token} />}
            {currentPage === "dashboard" && <ManagerMainDashboard hospital={hospital} token={token} />}
            {currentPage === "bookings" && <BookingManagement hospital={hospital} token={token} />}
            {currentPage === "er-management" && <ERManagementPanel hospital={hospital} token={token} />}
            {currentPage === "facilities" && <FacilitiesManagement hospital={hospital} token={token} />}
            {currentPage === "profile" && (
              <HospitalProfilePage hospital={hospital} setHospital={setHospital} token={token} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
