"use client"
import React from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ManagerDashboard from "./ManagerDashboard"
import UserDashboard from "./UserDashboard"
import AdminDashboard from "./AdminDashboard"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  console.log("Dashboard user:", user);

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MedQueue</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {renderRoleDashboard()}
    </div>
  )
}

export default Dashboard
