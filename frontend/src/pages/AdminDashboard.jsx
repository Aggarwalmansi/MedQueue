"use client";
import React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import BedManagement from "../components/BedManagement"
import HospitalStats from "../components/HospitalStats"
export default function AdminDashboard() {
  const { token } = useAuth()
  console.log("AdminDashboard token:", token);
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminStats()
  }, [token])

  const fetchAdminStats = async () => {
    try {

      setLoading(true)

      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      // In production, this would call an actual admin API endpoint
      setStats({
        totalUsers: 0,
        totalHospitals: 0,
        totalBeds: 0,
        systemHealth: "Good",
      })
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching admin stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Hospitals</p>
          <p className="text-3xl font-bold text-green-600">{stats?.totalHospitals || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Beds</p>
          <p className="text-3xl font-bold text-orange-600">{stats?.totalBeds || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">System Health</p>
          <p className="text-lg font-bold text-purple-600">{stats?.systemHealth}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">System Management</h3>
        <p className="text-gray-600">Admin controls and monitoring will be available here.</p>
      </div>
    </div>
  )
}
