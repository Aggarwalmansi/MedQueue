import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalCard from '../components/Patient/HospitalCard';
import BookingModal from '../components/Patient/BookingModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapPin, Navigation, Activity, Search, AlertCircle } from 'lucide-react';
import '../styles/PatientDashboard.css';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHospital(null);
    };

    return (
        <div className="patient-dashboard">
            {/* Header / Hero */}
            <div className="dashboard-header">
                <div className="container-max header-content">
                    <div className="header-brand">
                        <div className="brand-icon">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="brand-name">Emergency Help</h1>
                            <p className="brand-status">Finding nearest care...</p>
                        </div>
                    </div>

                    {location ? (
                        <Badge variant="success" className="location-badge">
                            <Navigation size={12} /> GPS Active
                        </Badge>
                    ) : (
                        <Badge variant="warning" className="location-badge">
                            <Search size={12} /> Locating...
                        </Badge>
                    )}
                </div>
            </div>

            <div className="container-max dashboard-content">
                {/* Loading State */}
                {loading && (
                    <div className="loading-container animate-fade-in">
                        <div className="loading-spinner"></div>
                        <h3 className="loading-title">Scanning Nearby Hospitals...</h3>
                        <p className="loading-desc">Please wait while we check bed availability.</p>
                    </div>
                )}

                {/* Content */}
                {!loading && (
                    <>
                        {/* Show Empty State if Error OR No Hospitals */}
                        {(error || hospitals.length === 0) ? (
                            <div className="empty-state-container animate-fade-in">
                                <Card className="empty-state-card">
                                    <div className="empty-icon-wrapper">
                                        {error ? <AlertCircle size={32} /> : <Search size={32} />}
                                    </div>
                                    <h3 className="empty-title">
                                        {error ? "Unable to Load Hospitals" : "No Hospitals Found Nearby"}
                                    </h3>
                                    <p className="empty-desc">
                                        {error
                                            ? "We encountered an issue while fetching hospital data. Please check your connection."
                                            : "We couldn't find any partner hospitals in your current location. Try increasing your search radius."}
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={() => window.location.reload()}
                                        className="empty-action-btn"
                                    >
                                        {error ? "Retry Connection" : "Refresh Search"}
                                    </Button>
                                </Card>
                            </div>
                        ) : (
                            <div className="hospital-list animate-slide-up">
                                <div className="list-header">
                                    <div>
                                        <h2 className="list-title">Nearby Hospitals</h2>
                                        <p className="list-subtitle">Sorted by distance and availability</p>
                                    </div>
                                    <span className="count-badge">
                                        {hospitals.length} Found
                                    </span>
                                </div>

                                <div className="hospitals-grid">
                                    {hospitals.map(hospital => (
                                        <HospitalCard
                                            key={hospital.id}
                                            hospital={hospital}
                                            onNotify={handleNotifyClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                hospital={selectedHospital}
            />

        </div>
    );
};

export default PatientDashboard;
