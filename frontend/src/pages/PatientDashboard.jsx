import React, { useState, useEffect } from 'react';
import HospitalCard from '../components/Patient/HospitalCard';
import BookingModal from '../components/Patient/BookingModal';
import TicketView from '../components/Patient/TicketView';

const PatientDashboard = () => {
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null); // For modal
    const [bookingSuccess, setBookingSuccess] = useState(null); // For ticket view

    useEffect(() => {
        // 1. Get Location immediately
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    fetchHospitals(latitude, longitude);
                },
                (err) => {
                    console.error(err);
                    setError("We need your location to find the nearest help. Please enable GPS.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }, []);

    const fetchHospitals = async (lat, lng) => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/hospitals?lat=${lat}&lng=${lng}`);
            if (!response.ok) throw new Error('Failed to fetch hospitals');
            const data = await response.json();
            setHospitals(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load hospitals. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNotifyClick = (hospital) => {
        setSelectedHospital(hospital);
    };

    const handleBookingSubmit = async (formData) => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/bookings`, {
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

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: '"Inter", sans-serif'
        },
        header: {
            marginBottom: '24px',
            textAlign: 'center'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '800',
            color: '#1f1f1f',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#595959',
            fontSize: '1rem'
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: '16px'
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #ff4d4f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        error: {
            color: '#ff4d4f',
            textAlign: 'center',
            marginTop: '40px',
            padding: '20px'
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                `}
            </style>

            <div style={styles.header}>
                <h1 style={styles.title}>Emergency Help</h1>
                <p style={styles.subtitle}>Finding the best care near you...</p>
            </div>

            {loading && (
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Locating hospitals...</p>
                </div>
            )}

            {error && <div style={styles.error}><h3>⚠️ {error}</h3></div>}

            {!loading && !error && (
                <div>
                    {hospitals.map(hospital => (
                        <HospitalCard
                            key={hospital.id}
                            hospital={hospital}
                            onNotify={handleNotifyClick}
                        />
                    ))}
                    {hospitals.length === 0 && (
                        <p style={{ textAlign: 'center', marginTop: '40px' }}>No hospitals found nearby.</p>
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
    );
};

export default PatientDashboard;
