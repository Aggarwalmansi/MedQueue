import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import '../../styles/TriageDashboard.css';

const TriageDashboard = ({ hospital, token }) => {
    const [socket, setSocket] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [inventory, setInventory] = useState({
        bedsGeneral: hospital?.bedsGeneral || 0,
        bedsICU: hospital?.bedsICU || 0,
        bedsOxygen: hospital?.bedsOxygen || 0,
        doctorsActive: hospital?.doctorsActive || 0
    });
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')); // Simple chime sound

    // Initialize Socket and fetch initial data
    useEffect(() => {
        if (!hospital?.id) return;

        // Connect to Socket.io
        const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");
        setSocket(newSocket);

        newSocket.emit('join_hospital', hospital.id);

        // Listen for new bookings
        newSocket.on('new_booking', (booking) => {
            setBookings(prev => [booking, ...prev]);
            playAlert();
        });

        // Listen for booking updates (if updated by another manager or system)
        newSocket.on('booking_updated', (updatedBooking) => {
            setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        });

        // Fetch existing incoming bookings
        fetchBookings();

        return () => newSocket.close();
    }, [hospital?.id]);

    // Sync inventory state if hospital prop updates
    useEffect(() => {
        if (hospital) {
            setInventory({
                bedsGeneral: hospital.bedsGeneral,
                bedsICU: hospital.bedsICU,
                bedsOxygen: hospital.bedsOxygen,
                doctorsActive: hospital.doctorsActive
            });
        }
    }, [hospital]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/hospital/bookings?status=INCOMING`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const playAlert = () => {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    };

    const updateInventory = async (type, change) => {
        const newValue = Math.max(0, inventory[type] + change);
        const newInventory = { ...inventory, [type]: newValue };

        // Optimistic update
        setInventory(newInventory);

        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/hospital/inventory`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newInventory)
            });
        } catch (error) {
            console.error("Error updating inventory:", error);
            // Revert on error (optional, but good practice)
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/hospital/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // Remove from local list if handled (Admitted or Diverted)
                setBookings(prev => prev.filter(b => b.id !== bookingId));
            }
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    return (
        <div className="triage-container">
            {hospital && !hospital.isVerified && (
                <div className="verification-banner">
                    <span>⚠️</span>
                    <div>
                        <strong>Pending Verification</strong>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Your hospital is currently under review. You will not appear in search results until verified by an Admin.</p>
                    </div>
                </div>
            )}
            <div className="triage-header">
                <h2>Command Center</h2>
                <p>Live Triage & Capacity Management</p>
            </div>

            <div className="dashboard-grid">
                {/* Left Column: Live Capacity */}
                <div className="capacity-section">
                    <div className="section-title">
                        <span>🏥</span> Live Capacity
                    </div>

                    <div className="bed-cards">
                        <BedControl
                            label="General Beds"
                            count={inventory.bedsGeneral}
                            onIncrease={() => updateInventory('bedsGeneral', 1)}
                            onDecrease={() => updateInventory('bedsGeneral', -1)}
                        />
                        <BedControl
                            label="ICU Beds"
                            count={inventory.bedsICU}
                            onIncrease={() => updateInventory('bedsICU', 1)}
                            onDecrease={() => updateInventory('bedsICU', -1)}
                        />
                        <BedControl
                            label="Ventilators / Oxygen"
                            count={inventory.bedsOxygen}
                            onIncrease={() => updateInventory('bedsOxygen', 1)}
                            onDecrease={() => updateInventory('bedsOxygen', -1)}
                        />
                    </div>
                </div>

                {/* Right Column: Incoming Patients */}
                <div className="incoming-section">
                    <div className="section-title">
                        <span>🚑</span> Incoming Patients ({bookings.length})
                    </div>

                    <div className="incoming-list">
                        {bookings.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">✅</span>
                                <p>No incoming patients at the moment</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} className="patient-card new">
                                    <div className="patient-header">
                                        <span className="patient-name">{booking.patientName}</span>
                                        <span className="patient-time">{new Date(booking.createdAt).toLocaleTimeString()}</span>
                                    </div>

                                    <div className="patient-details">
                                        <span className={`condition-badge severity-${booking.severity}`}>
                                            {booking.severity}
                                        </span>
                                        <p><strong>Condition:</strong> {booking.condition}</p>
                                        <p><strong>Phone:</strong> {booking.patientPhone}</p>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            className="btn-action btn-acknowledge"
                                            onClick={() => handleBookingAction(booking.id, 'ADMITTED')}
                                        >
                                            ✓ Acknowledge
                                        </button>
                                        <button
                                            className="btn-action btn-divert"
                                            onClick={() => handleBookingAction(booking.id, 'DIVERTED')}
                                        >
                                            ✕ Divert
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BedControl = ({ label, count, onIncrease, onDecrease }) => (
    <div className="bed-card">
        <div className="bed-info">
            <h4>{label}</h4>
            <span>Available</span>
        </div>
        <div className="bed-controls">
            <button className="control-btn decrease" onClick={onDecrease}>-</button>
            <span className="bed-count">{count}</span>
            <button className="control-btn increase" onClick={onIncrease}>+</button>
        </div>
    </div>
);

export default TriageDashboard;
