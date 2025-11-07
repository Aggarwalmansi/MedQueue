"use client"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getDashboardContent = () => {
    switch (user?.role) {
      case "ADMIN":
        return <div>Admin Dashboard - Manage system settings and users</div>
      case "HOSPITAL_MANAGER":
        return <div>Hospital Manager Dashboard - Manage beds and staff</div>
      case "USER":
        return <div>Patient Dashboard - Search for available hospitals</div>
      default:
        return <div>Dashboard</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MedQueue</h1>
          <div className="flex items-center gap-4">
            <span>
              {user?.email} ({user?.role})
            </span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6">Welcome, {user?.email}!</h2>
          <div className="text-gray-700">{getDashboardContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
