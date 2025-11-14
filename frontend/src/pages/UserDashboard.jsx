"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import "../styles/UserDashboard.css"

export default function UserDashboard() {
  const { token } = useAuth()
  const [hospitals, setHospitals] = useState([])
  const [bedType, setBedType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [searchRadius, setSearchRadius] = useState(50)
  

  useEffect(() => {
  const fetchAllHospitals = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/hospitals/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setHospitals(data || [])
    } catch (err) {
      console.error("Error loading hospitals:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchAllHospitals()
}, [token])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
          setError("Please enable location access to find nearby hospitals")
        },
      )
    }
  }, [])

  const handleSearch = async () => {
    if (!userLocation) {
      setError("Location access required. Please enable location permissions.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      const apiUrl = import.meta.env.VITE_BACKEND_URL;

      const query = new URLSearchParams()
      query.append("latitude", userLocation.latitude)
      query.append("longitude", userLocation.longitude)
      if (bedType) {
        query.append("bedType", bedType)
      }
      query.append("radius", searchRadius)

      console.log("[v0] Search API URL:", `${apiUrl}/api/hospitals?${query}`)
      console.log("[v0] User Location:", userLocation)
      console.log("[v0] Auth Token:", token ? "Present" : "Missing")

      // const response = await fetch(`${apiUrl}/api/hospitals?${query}`, {
      const response = await fetch(`${apiUrl}/api/hospitals/all`, {

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] API Response Status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] Error Data:", errorData)
        throw new Error(errorData.message || "Failed to search hospitals")
      }
      
      const data = await response.json()
      console.log("[v0] Search Results:", data.length)
      setHospitals(data || [])
      console.log("this is the hospital : ", data )

      if (data.length === 0) {
        setError("No hospitals with available beds found in your area. Try increasing the search radius.")
      }
    } catch (err) {
      setError(err.message || "Error searching hospitals")
      console.error("[v0] Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-dashboard">
      {/* Hero Search Section */}
      <div className="search-hero">
        <div className="search-container">
          <h1 className="search-title">Find Hospital Beds Near You</h1>
          <p className="search-subtitle">Emergency-ready bed availability in real-time</p>

          {/* Search Controls */}
          <div className="search-controls">
            <div className="bed-type-selector">
              <label htmlFor="bed-type" className="selector-label">
                Bed Type (Optional)
              </label>
              <select id="bed-type" value={bedType} onChange={(e) => setBedType(e.target.value)} className="bed-select">
                <option value="">Any Type</option>
                <option value="ICU">ICU</option>
                <option value="GENERAL">General</option>
                <option value="ISOLATION">Isolation</option>
                <option value="PEDIATRIC">Pediatric</option>
                <option value="CARDIAC">Cardiac</option>
              </select>
            </div>

            <div className="radius-selector">
              <label htmlFor="search-radius" className="selector-label">
                Search Radius: {searchRadius} km
              </label>
              <input
                id="search-radius"
                type="range"
                min="10"
                max="100"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="radius-slider"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !userLocation}
              className={`find-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Searching...
                </>
              ) : (
                "Find Beds Near Me"
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="results-section">
          {hospitals.length > 0 ? (
            <>
              <div className="results-header">
                <h2 className="results-count">
                  Found {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} with available beds
                </h2>
              </div>

              <div className="hospitals-list">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="hospital-card">
                    <div className="card-header">
                      <div className="hospital-info">
                        <h3 className="hospital-name">{hospital.name}</h3>
                        <p className="hospital-address">{hospital.address}</p>
                      </div>
                      <div className="distance-badge">
                        <span className="distance-value">{hospital.distance}</span>
                        <span className="distance-unit">km</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="available-beds">
                        <p className="beds-label">Available Beds</p>
                        <p className="beds-count">{hospital.totalAvailableBeds}</p>
                      </div>
                      {console.log("hospital available beds by type: ", hospital.availableBedsByType)}
                      {hospital.availableBedsByType && Object.keys(hospital.availableBedsByType).length > 0 && (
                      
                        <div className="bed-types">
                          {Object.entries(hospital.availableBedsByType).map(([type, count]) => (
                            <span key={type} className="bed-type-tag">
                              {count} {type}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card-footer">
                      <Link to={`tel:${hospital.contactPhone}`} className="contact-link">
                        Call Now
                      </Link>
                      <button className="details-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
