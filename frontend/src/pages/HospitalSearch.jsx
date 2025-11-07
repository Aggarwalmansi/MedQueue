"use client"

import { useState, useEffect } from "react"
import "../styles/HospitalSearch.css"

export default function HospitalSearch() {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [bedType, setBedType] = useState("ALL")
  const [radius, setRadius] = useState("50")
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [geoError, setGeoError] = useState(null)

  // Auto-fetch user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setGeoError(null)
        },
        (error) => {
          setGeoError("Enable location access to find nearby hospitals")
        },
      )
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!latitude || !longitude) {
      setError("Please enable location or enter coordinates")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

      const query = new URLSearchParams()
      query.append("latitude", latitude)
      query.append("longitude", longitude)
      query.append("radius", radius)
      if (bedType !== "ALL") {
        query.append("bedType", bedType)
      }

      const response = await fetch(`${apiUrl}/api/search/hospitals?${query.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to search hospitals")
      }

      const data = await response.json()
      setHospitals(data.data || [])
      setSearched(true)
    } catch (err) {
      setError(err.message)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hospital-search-container">
      {/* Header Section - Google-like */}
      {!searched && (
        <div className="search-hero">
          <div className="search-hero-content">
            <h1 className="search-title">MedQueue</h1>
            <p className="search-subtitle">Find available hospital beds near you</p>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="search-input"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-filters">
                <select value={bedType} onChange={(e) => setBedType(e.target.value)} className="search-select">
                  <option value="ALL">All Bed Types</option>
                  <option value="ICU">ICU</option>
                  <option value="GENERAL">General</option>
                  <option value="PEDIATRIC">Pediatric</option>
                  <option value="VENTILATOR">Ventilator</option>
                </select>

                <select value={radius} onChange={(e) => setRadius(e.target.value)} className="search-select">
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>

              {geoError && <p className="geo-error">{geoError}</p>}

              <button type="submit" disabled={loading} className="search-button">
                {loading ? "Searching..." : "Find Hospitals"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Results Section */}
      {searched && (
        <div className="results-container">
          <div className="results-header">
            <button onClick={() => setSearched(false)} className="back-button">
              ← Back
            </button>
            <h2 className="results-title">
              {hospitals.length} Hospital{hospitals.length !== 1 ? "s" : ""} Found
            </h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Searching hospitals...</div>
          ) : hospitals.length === 0 ? (
            <div className="no-results">No hospitals found in this radius with available beds</div>
          ) : (
            <div className="hospitals-grid">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-card">
                  <div className="hospital-header">
                    <h3 className="hospital-name">{hospital.name}</h3>
                    <span className="hospital-distance">{hospital.distance} km</span>
                  </div>

                  <p className="hospital-address">{hospital.address}</p>

                  <div className="beds-info">
                    <div className="beds-count">
                      <span className="beds-count-label">Available Beds</span>
                      <span className="beds-count-value">{hospital.totalAvailableBeds}</span>
                    </div>

                    {Object.keys(hospital.availableBedsByType).length > 0 && (
                      <div className="beds-by-type">
                        {Object.entries(hospital.availableBedsByType).map(([type, count]) => (
                          <span key={type} className="bed-type-badge">
                            {type}: {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {hospital.contactPhone && <p className="hospital-phone">📞 {hospital.contactPhone}</p>}

                  <button className="book-button">Book a Bed</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
