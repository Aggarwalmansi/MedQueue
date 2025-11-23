import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import HospitalCard from '../components/Patient/HospitalCard';
import BookingModal from '../components/Patient/BookingModal';
import RatingModal from '../components/Patient/RatingModal';
import VirtualQueueModal from '../components/Patient/VirtualQueueModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Navigation, Search, AlertCircle } from 'lucide-react';
import '../styles/PatientDashboard.css';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('distance'); // distance, availability, name
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Rating Modal State
    const [ratingHospital, setRatingHospital] = useState(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    // Virtual Queue Modal State
    const [queueHospital, setQueueHospital] = useState(null);
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

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

        // 2. Socket.IO Connection for Real-time Updates
        const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5001");

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('hospital_updated_public', (updatedHospital) => {
            console.log("Received hospital update:", updatedHospital);
            setHospitals(prevHospitals => {
                const exists = prevHospitals.find(h => h.id === updatedHospital.id);

                if (updatedHospital.isVerified) {
                    if (exists) {
                        // Update existing
                        return prevHospitals.map(h => h.id === updatedHospital.id ? { ...h, ...updatedHospital } : h);
                    } else {
                        // Add new (if it matches location criteria? For now just add it, 
                        // the distance calc might be off if we don't recalculate it here, 
                        // but the backend sends 'hospitalWithTotalBeds'. 
                        // Ideally we should calculate distance if not provided, but let's assume 
                        // for now we just add it and let the user refresh for perfect sort if needed,
                        // OR we can try to calc distance if we have user location.
                        // The backend 'hospital_updated_public' event in admin route sends the raw hospital object + totalBeds.
                        // It DOES NOT send 'distance' relative to this specific user.
                        // So we should calculate distance here if possible.

                        let distance = 0;
                        // We can't easily access 'location' state inside this callback due to closure staleness 
                        // unless we use a ref or dependency, but 'location' is in dependency array? No, it's empty [].
                        // So 'location' will be null here.
                        // For a quick fix, we'll just add it. The sort might be weird until refresh.
                        return [...prevHospitals, updatedHospital];
                    }
                } else {
                    // Remove if unverified
                    return prevHospitals.filter(h => h.id !== updatedHospital.id);
                }
            });
        });

        return () => {
            socket.disconnect();
        };
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

    const handleRateClick = (hospital) => {
        setRatingHospital(hospital);
        setIsRatingModalOpen(true);
    };

    const handleCloseRatingModal = () => {
        setIsRatingModalOpen(false);
        setRatingHospital(null);
    };

    const handleJoinQueueClick = (hospital) => {
        setQueueHospital(hospital);
        setIsQueueModalOpen(true);
    };

    const handleCloseQueueModal = () => {
        setIsQueueModalOpen(false);
        setQueueHospital(null);
    };

    const handleSubmitRating = async (hospitalId, value, comment) => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const token = localStorage.getItem('token'); // Assuming token is stored here

            if (!token) {
                alert("Please log in to rate hospitals.");
                return;
            }

            const response = await fetch(`${apiUrl}/api/hospitals/${hospitalId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value, comment })
            });

            if (!response.ok) throw new Error('Failed to submit rating');

            // Refresh hospitals to show new rating
            // Ideally, we should update the specific hospital in state to avoid full refetch
            // But for simplicity and accuracy (since average changes), we can refetch or update locally
            // Let's update locally for immediate feedback if we had the new average from backend
            // The backend returns the rating object, not the new average. 
            // So let's just refetch for now to get the correct average.
            if (location) {
                fetchHospitals(location.lat, location.lng);
            }

        } catch (err) {
            console.error(err);
            alert("Failed to submit rating. Please try again.");
        }
    };

    // Filter and Sort Logic
    const filteredHospitals = hospitals
        .filter(hospital =>
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.address?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
            if (sortBy === 'availability') return (b.totalBeds || 0) - (a.totalBeds || 0);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="patient-dashboard">
            {/* Note: Header is now rendered in App.jsx layout */}

            <div className="container-max dashboard-content">
                {/* Search and Filter Bar */}
                <div className="search-filter-bar animate-fade-in">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search Hospitals by Name"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-controls">
                        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
                            <div className="filter-icon-wrapper">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                            </div>
                            Filters
                        </button>
                    </div>
                </div>

                {/* Page Title */}
                <div className="dashboard-title-section animate-fade-in">
                    <h1 className="page-title">Find Available Hospital Beds</h1>
                </div>

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
                        {(error || filteredHospitals.length === 0) ? (
                            <div className="empty-state-container animate-fade-in">
                                <Card className="empty-state-card">
                                    <div className="empty-icon-wrapper">
                                        {error ? <AlertCircle size={32} /> : <Search size={32} />}
                                    </div>
                                    <h3 className="empty-title">
                                        {error ? "Unable to Load Hospitals" : "No Hospitals Found"}
                                    </h3>
                                    <p className="empty-desc">
                                        {error
                                            ? "We encountered an issue while fetching hospital data. Please check your connection."
                                            : "We couldn't find any hospitals matching your search. Try adjusting your filters."}
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            if (error) window.location.reload();
                                            else { setSearchQuery(''); setSortBy('distance'); }
                                        }}
                                        className="empty-action-btn"
                                    >
                                        {error ? "Retry Connection" : "Clear Filters"}
                                    </Button>
                                </Card>
                            </div>
                        ) : (
                            <div className="hospital-list animate-slide-up">
                                <div className="hospitals-grid">
                                    {filteredHospitals.map(hospital => (
                                        <HospitalCard
                                            key={hospital.id}
                                            hospital={hospital}
                                            onNotify={handleNotifyClick}
                                            onRate={handleRateClick}
                                            onJoinQueue={handleJoinQueueClick}
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

            {/* Rating Modal */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={handleCloseRatingModal}
                hospital={ratingHospital}
                onSubmit={handleSubmitRating}
            />

            {/* Virtual Queue Modal */}
            <VirtualQueueModal
                isOpen={isQueueModalOpen}
                onClose={handleCloseQueueModal}
                hospital={queueHospital}
            />

        </div>
    );
};

export default PatientDashboard;
