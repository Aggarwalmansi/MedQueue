"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import "../styles/UserDashboard.css"

export default function UserDashboard() {
  const { token } = useAuth()
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [bedType, setBedType] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [useLocation, setUseLocation] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [searchRadius, setSearchRadius] = useState(50)
  const [locationEnabled, setLocationEnabled] = useState(false)

  // Load all hospitals on component mount
  useEffect(() => {
    fetchAllHospitals()
  }, [])

  // Get user location when location is enabled
  useEffect(() => {
    if (useLocation && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationEnabled(true)
        },
        (error) => {
          console.log("Geolocation error:", error)
          setError("Unable to access your location. Please enable location permissions.")
          setUseLocation(false)
        },
      )
    }
  }, [useLocation])

  // Filter and sort hospitals whenever dependencies change
  useEffect(() => {
    filterAndSortHospitals()
  }, [hospitals, searchQuery, bedType, sortBy, useLocation, userLocation, searchRadius])

  const fetchAllHospitals = async () => {
    try {
      setLoading(true)
      setError(null)

      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/hospitals/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch hospitals")
      }

      const data = await response.json()
      setHospitals(data || [])
    } catch (err) {
      setError(err.message || "Error loading hospitals")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filterAndSortHospitals = () => {
    let filtered = [...hospitals]

    // Filter by search query (hospital name or city)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.city.toLowerCase().includes(query),
      )
    }

    // Filter by bed type
    if (bedType) {
      filtered = filtered.filter((h) => h.availableBedsByType[bedType])
    }

    // Filter by location if enabled
    if (useLocation && userLocation) {
      filtered = filtered
        .map((h) => ({
          ...h,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            h.latitude,
            h.longitude,
          ),
        }))
        .filter((h) => h.distance <= searchRadius)
    }

    // Sort hospitals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "city":
          return a.city.localeCompare(b.city)
        case "beds":
          return b.totalAvailableBeds - a.totalAvailableBeds
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        default:
          return 0
      }
    })

    setFilteredHospitals(filtered)
  }

  return (
    <div className="user-dashboard">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="search-container">
          <h1 className="search-title">Find Hospital Beds Near You</h1>
          <p className="search-subtitle">Emergency-ready bed availability in real-time</p>

          {/* Search Bar */}
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search by hospital name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Bed Type</label>
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="ICU">ICU</option>
                <option value="GENERAL">General</option>
                <option value="PEDIATRIC">Pediatric</option>
                <option value="VENTILATOR">Ventilator</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Hospital Name</option>
                <option value="city">City</option>
                <option value="beds">Available Beds</option>
                {useLocation && <option value="distance">Distance</option>}
              </select>
            </div>

            {/* Location Toggle */}
            <div className="filter-group location-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useLocation}
                  onChange={(e) => {
                    setUseLocation(e.target.checked)
                    if (!e.target.checked) {
                      setUserLocation(null)
                      setLocationEnabled(false)
                    }
                  }}
                  className="toggle-checkbox"
                />
                <span className="toggle-text">Use My Location</span>
              </label>
              {useLocation && locationEnabled && (
                <div className="radius-control">
                  <label className="radius-label">Radius: {searchRadius} km</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="radius-slider"
                  />
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading hospitals...</p>
          </div>
        ) : filteredHospitals.length > 0 ? (
          <>
            <div className="results-header">
              <h2 className="results-count">
                Found {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? "s" : ""} with available beds
              </h2>
            </div>

            <div className="hospitals-list">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-card">
                  <div className="card-header">
                    <div className="hospital-info">
                      <h3 className="hospital-name">{hospital.name}</h3>
                      <p className="hospital-address">{hospital.address}</p>
                    </div>
                    {hospital.distance !== undefined && (
                      <div className="distance-badge">
                        <span className="distance-value">{hospital.distance.toFixed(1)}</span>
                        <span className="distance-unit">km</span>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="available-beds">
                      <p className="beds-label">Available Beds</p>
                      <p className="beds-count">{hospital.totalAvailableBeds}</p>
                    </div>

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
                    <a href={`tel:${hospital.contactPhone}`} className="contact-link">
                      📞 Call Now
                    </a>
                    <button className="details-button">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p className="no-results-text">
              {searchQuery || bedType || useLocation
                ? "No hospitals match your search criteria. Try adjusting your filters."
                : "No hospitals available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
