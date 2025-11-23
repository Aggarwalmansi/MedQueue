import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Activity, AlertCircle } from 'lucide-react';
import TicketView from '../components/Patient/TicketView';
import '../styles/PatientDashboard.css'; // Reuse dashboard styles for consistency

const MyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
                const response = await fetch(`${apiUrl}/api/patient/my-bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setBookings([]); // Treat 404 as empty list just in case
                    } else {
                        throw new Error('Failed to fetch bookings');
                    }
                } else {
                    const data = await response.json();
                    setBookings(data);
                }
            } catch (err) {
                console.error(err);
                setError("Unable to load bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="patient-dashboard">
            <div className="dashboard-header">
                <div className="container-max header-content">
                    <div className="header-brand">
                        <h1 className="brand-name">My Bookings</h1>
                        <p className="brand-status">History of your hospital visits</p>
                    </div>
                </div>
            </div>

            <div className="container-max dashboard-content">
                {error ? (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        {error}
                        <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="empty-state-card">
                        <div className="empty-icon-wrapper">
                            <Calendar size={48} className="empty-icon-svg" />
                        </div>
                        <h3>No Bookings Yet</h3>
                        <p>You haven't made any hospital bookings. When you do, they'll appear here.</p>
                        <a href="/dashboard" className="action-btn">Find Hospitals</a>
                    </div>
                ) : (
                    <div className="bookings-grid" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                        {bookings.map(booking => (
                            <div key={booking.id} style={{ transform: 'scale(0.9)', transformOrigin: 'top left' }}>
                                <TicketView booking={booking} hospital={booking.hospital} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
