"use client"
import React, { useState, useEffect } from "react"
import { io } from 'socket.io-client';
import HospitalCard from "../components/Patient/HospitalCard";
import BookingModal from "../components/Patient/BookingModal";
import TicketView from "../components/Patient/TicketView";
import { Search, AlertCircle } from "lucide-react";
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

  // Booking State
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

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

  // Socket.io connection for real-time updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

    socket.on('hospital_updated_public', (updatedHospital) => {
      setHospitals(prevHospitals => prevHospitals.map(h => {
        if (h.id === updatedHospital.id) {
          const totalAvailableBeds = updatedHospital.bedsGeneral + updatedHospital.bedsICU + updatedHospital.bedsOxygen;

          return {
            ...h,
            ...updatedHospital,
            totalAvailableBeds,
            availableBedsByType: {
              ...h.availableBedsByType,
              GENERAL: updatedHospital.bedsGeneral,
              ICU: updatedHospital.bedsICU,
              VENTILATOR: updatedHospital.bedsOxygen
            },
            // Ensure these fields exist for the Card component
            bedsGeneral: updatedHospital.bedsGeneral,
            bedsICU: updatedHospital.bedsICU,
            bedsOxygen: updatedHospital.bedsOxygen
          };
        }
        return h;
      }));
    });

    return () => socket.close();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!latitude || !longitude) {
      setError("Please enable location or enter coordinates")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

      const query = new URLSearchParams()
      query.append("lat", latitude)
      query.append("lng", longitude)

      const response = await fetch(`${apiUrl}/api/hospitals?${query.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to search hospitals")
      }

      const data = await response.json()

      const mappedData = data.map(h => ({
        ...h,
        totalAvailableBeds: h.bedsGeneral + h.bedsICU + h.bedsOxygen,
        availableBedsByType: {
          GENERAL: h.bedsGeneral,
          ICU: h.bedsICU,
          VENTILATOR: h.bedsOxygen
        },
        // Ensure these fields exist for the Card component
        bedsGeneral: h.bedsGeneral,
        bedsICU: h.bedsICU,
        bedsOxygen: h.bedsOxygen
      }));

      setHospitals(mappedData)
      setSearched(true)
    } catch (err) {
      setError(err.message)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/api/patient/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Booking failed');
      const data = await response.json();

      // Show success ticket
      setBookingSuccess({ booking: data.booking, hospital: selectedHospital });
      setSelectedHospital(null); // Close modal
    } catch (err) {
      console.error(err);
      alert("Failed to send alert. Please try again or call emergency services.");
    }
  };

  // Render Ticket View if booking successful
  if (bookingSuccess) {
    return <TicketView booking={bookingSuccess.booking} hospital={bookingSuccess.hospital} />;
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
            <div className="hospitals-grid">
              {[1, 2, 3].map((i) => (
                <HospitalCard key={i} loading={true} />
              ))}
            </div>
          ) : hospitals.length === 0 ? (
            <div className="no-results">No hospitals found in this radius with available beds</div>
          ) : (
            <div className="hospitals-grid">
              {hospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onNotify={handleNotifyClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  )
}
