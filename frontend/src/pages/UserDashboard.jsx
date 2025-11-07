"use client"
import React from "react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function UserDashboard() {
  const { token } = useAuth()
  const [hospitals, setHospitals] = useState([])
  const [searchLocation, setSearchLocation] = useState("")
  const [bedType, setBedType] = useState("ALL")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!searchLocation) {
      setError("Please enter a location")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001"

      const query = new URLSearchParams()
      query.append("location", searchLocation)
      if (bedType !== "ALL") {
        query.append("bedType", bedType)
      }

      const response = await fetch(`${apiUrl}/api/hospitals/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to search hospitals")
      }

      const data = await response.json()
      setHospitals(data)
    } catch (err) {
      setError(err.message)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Find Available Hospital Beds</h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location/City</label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter location or city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type (Optional)</label>
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="ICU">ICU</option>
                <option value="GENERAL">General</option>
                <option value="ISOLATION">Isolation</option>
                <option value="PEDIATRIC">Pediatric</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                {loading ? "Searching..." : "Search Hospitals"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="text-xl font-bold mb-4">Available Hospitals</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">Searching hospitals...</div>
          </div>
        ) : hospitals.length === 0 && searchLocation ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            No hospitals found. Try searching with a different location.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{hospital.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{hospital.address}</p>
                  <p className="text-sm text-gray-600 mb-3">📍 {hospital.distance?.toFixed(2) || "N/A"} km away</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Beds:</p>
                    <p className="text-2xl font-bold text-green-600">{hospital.availableBeds || 0}</p>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
