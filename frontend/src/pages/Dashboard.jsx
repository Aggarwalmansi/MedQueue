"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import ManagerDashboard from "./ManagerDashboard"
import UserDashboard from "./UserDashboard"
import AdminDashboard from "./AdminDashboard"

const Dashboard = () => {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const renderRoleDashboard = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminDashboard />
      case "HOSPITAL_MANAGER":
        return <ManagerDashboard />
      case "USER":
        return <UserDashboard />
      default:
        return <div className="p-8 text-center">Unknown role</div>
    }
  }

  return (
    <div className="min-h-screen">
      <Header scrolled={scrolled} />

      {/* Add padding-top to account for fixed header */}
      <div style={{ paddingTop: "80px" }}>{renderRoleDashboard()}</div>
    </div>
  )
}

export default Dashboard
