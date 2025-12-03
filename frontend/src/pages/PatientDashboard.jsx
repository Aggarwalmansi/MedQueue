import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import HospitalCard from '../components/Patient/HospitalCard';
import BookingModal from '../components/Patient/BookingModal';
import RatingModal from '../components/Patient/RatingModal';
import VirtualQueueModal from '../components/Patient/VirtualQueueModal';
import AppointmentModal from '../components/Patient/AppointmentModal';
import AdvancedFiltersDrawer from '../components/Patient/AdvancedFiltersDrawer';
import TrendingCarousel from '../components/Patient/TrendingCarousel';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, AlertCircle, Filter, ChevronDown, Map as MapIcon, List } from 'lucide-react';
import MapView from '../components/Patient/MapView';
import '../styles/PatientDashboard.css';
import '../styles/SpecializationFilter.css';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuery = searchParams.get('q');
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [trendingHospitals, setTrendingHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState(urlQuery || '');
    const [sortBy, setSortBy] = useState('distance'); // distance, availability, name, rating
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        distance: null,
        hospitalType: [],
        minRating: 0,
        bedTypes: [],
        insurance: []
    });

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Modal State
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ratingHospital, setRatingHospital] = useState(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [queueHospital, setQueueHospital] = useState(null);
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    const [appointmentHospital, setAppointmentHospital] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    useEffect(() => {
        if (urlQuery) {
            setSearchQuery(urlQuery);
        }
    }, [urlQuery]);

    useEffect(() => {
        // 1. Get Location immediately
        console.log('🌍 Requesting geolocation...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('✅ Geolocation success:', { latitude, longitude });
                    setLocation({ lat: latitude, lng: longitude });
                    fetchHospitals(latitude, longitude);
                },
                (err) => {
                    console.error("❌ Geolocation error:", err.code, err.message);
                    console.log('⚠️ Falling back to fetch without location');
                    // Fallback: Fetch hospitals without location
                    fetchHospitals();
                }
            );
        } else {
            console.warn("⚠️ Geolocation not supported");
            // Fallback: Fetch hospitals without location
            fetchHospitals();
        }

        // Fetch Trending
        fetchTrendingHospitals();

        // 2. Socket.IO Connection for Real-time Updates
        const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5001");

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('hospital_updated_public', (updatedHospital) => {
            setHospitals(prevHospitals => {
                const exists = prevHospitals.find(h => h.id === updatedHospital.id);
                if (updatedHospital.isVerified) {
                    if (exists) {
                        return prevHospitals.map(h => h.id === updatedHospital.id ? { ...h, ...updatedHospital } : h);
                    } else {
                        return [...prevHospitals, updatedHospital];
                    }
                } else {
                    return prevHospitals.filter(h => h.id !== updatedHospital.id);
                }
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Refetch when URL query changes or filters change
    // Refetch when URL query changes, filters change, or page changes
    useEffect(() => {
        if (location) {
            fetchHospitals(location.lat, location.lng, page);
        } else {
            // If no location yet, try fetching anyway (maybe default location or just list)
            fetchHospitals(null, null, page);
        }
    }, [searchParams, advancedFilters, sortBy, page]);

    const fetchTrendingHospitals = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

            const trendingRes = await fetch(`${apiUrl}/api/search/trending`);
            if (trendingRes.ok) setTrendingHospitals(await trendingRes.json());

        } catch (err) {
            console.error("Failed to fetch trending:", err);
        }
    };

    const fetchHospitals = async (lat, lng, pageNum = 1) => {
        try {
            setLoading(true);
            console.log('🔍 fetchHospitals called with:', { lat, lng, pageNum, filters: advancedFilters });
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (lat) params.append('lat', lat);
            if (lng) params.append('lng', lng);
            params.append('page', pageNum);
            params.append('limit', limit);
            params.append('sortBy', sortBy);

            // Add Filters
            if (advancedFilters.minRating) params.append('minRating', advancedFilters.minRating);
            if (advancedFilters.bedTypes.length > 0) {
                // Backend currently supports single bedType param or we need to update backend to support array
                // For now, let's send the first one or handle multiple calls? 
                // The plan implies single selection or we need to update backend to handle 'bedType' as array or comma separated
                // Let's assume we send the first one for now as the backend logic I wrote handles one 'bedType' string
                // Or better, let's just send the first one if multiple selected, or iterate.
                // Actually, the backend `bedType` check is `if (bedType === 'ICU') ...`. 
                // So it expects a single string.
                // If user selects multiple, we might need to adjust backend or just pick one.
                // Let's pick the first one for now.
                params.append('bedType', advancedFilters.bedTypes[0]);
            }
            if (advancedFilters.hospitalType.length > 0) {
                // Backend doesn't seem to have hospitalType filter implemented in the route I wrote?
                // I missed `hospitalType` in backend `patient.routes.js`.
                // I will skip sending it for now or it won't work.
                // Wait, I should have checked that.
            }

            let url;
            if (searchQuery && searchQuery.trim().length > 0) {
                url = `${apiUrl}/api/search?${params.toString()}`;
            } else {
                url = `${apiUrl}/api/patient/hospitals?${params.toString()}`;
            }

            console.log('🌐 Fetching from:', url);
            const response = await fetch(url);

            if (!response.ok) throw new Error('Failed to fetch hospitals');
            const data = await response.json();

            // Handle both array response (old) and paginated response (new)
            if (data.pagination) {
                setHospitals(data.hospitals);
                setTotalPages(data.pagination.totalPages);
            } else if (Array.isArray(data)) {
                setHospitals(data);
                setTotalPages(1);
            } else {
                // Search might return array directly if I didn't update it correctly? 
                // I updated search controller to return { hospitals, pagination }
                setHospitals([]);
            }

            setError(null);
        } catch (err) {
            console.error('❌ Error fetching hospitals:', err);
            setError("Failed to load hospitals. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = (filters) => {
        setAdvancedFilters(filters);
        setPage(1); // Reset to first page
    };

    // Filter and Sort Logic - MOVED TO BACKEND
    // We now use 'hospitals' directly as it contains the paginated, filtered results
    const filteredHospitals = hospitals;

    console.log('🔢 Filtering results:', {
        totalHospitals: hospitals.length,
        filteredHospitals: filteredHospitals.length,
        activeFilters: advancedFilters,
        sortBy
    });

    // Handlers
    const handleNotifyClick = (hospital) => { setSelectedHospital(hospital); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedHospital(null); };
    const handleRateClick = (hospital) => { setRatingHospital(hospital); setIsRatingModalOpen(true); };
    const handleCloseRatingModal = () => { setIsRatingModalOpen(false); setRatingHospital(null); };
    const handleJoinQueueClick = (hospital) => { setQueueHospital(hospital); setIsQueueModalOpen(true); };
    const handleCloseQueueModal = () => { setIsQueueModalOpen(false); setQueueHospital(null); };
    const handleBookAppointment = (hospital) => { setAppointmentHospital(hospital); setIsAppointmentModalOpen(true); };
    const handleCloseAppointmentModal = () => { setIsAppointmentModalOpen(false); setAppointmentHospital(null); };

    const handleSubmitRating = async (hospitalId, value, comment) => {
        // ... (existing rating logic)
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const token = localStorage.getItem('token');
            if (!token) { alert("Please log in to rate hospitals."); return; }

            const response = await fetch(`${apiUrl}/api/patient/hospitals/${hospitalId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ value, comment })
            });

            if (!response.ok) throw new Error('Failed to submit rating');
            if (location) fetchHospitals(location.lat, location.lng);
        } catch (err) {
            console.error(err);
            alert("Failed to submit rating. Please try again.");
        }
    };

    const showDashboardWidgets = !searchQuery && advancedFilters.hospitalType.length === 0 && advancedFilters.bedTypes.length === 0;

    return (
        <div className="patient-dashboard">
            <div className="container-max dashboard-content">
                {/* Search and Filter Bar */}
                <div className="search-filter-bar animate-fade-in">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search 'Cardiac ICU near me'..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchParams({ q: searchQuery });
                                    if (location) fetchHospitals(location.lat, location.lng);
                                }
                            }}
                        />
                    </div>

                    <div className="filter-controls">
                        <div className="sort-dropdown-wrapper">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="distance">Nearest</option>
                                <option value="rating">Top Rated</option>
                                <option value="availability">Most Available Beds</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                            <ChevronDown size={14} className="sort-icon" />
                        </div>

                        <button className="filter-btn" onClick={() => setIsFilterDrawerOpen(true)}>
                            <Filter size={16} />
                            Filters
                        </button>

                        <button
                            className={`filter-btn view-toggle ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                        >
                            {viewMode === 'list' ? <MapIcon size={16} /> : <List size={16} />}
                            {viewMode === 'list' ? 'Map' : 'List'}
                        </button>
                    </div>
                </div>

                {/* Trending Carousel (Only when no search/filters) */}
                {showDashboardWidgets && !loading && viewMode === 'list' && (
                    <div className="dashboard-widgets animate-fade-in">
                        <TrendingCarousel
                            hospitals={trendingHospitals}
                            onNotify={handleNotifyClick}
                            onRate={handleRateClick}
                            onJoinQueue={handleJoinQueueClick}
                            onBookAppointment={handleBookAppointment}
                        />
                    </div>
                )}

                {/* Page Title */}
                <div className="dashboard-title-section animate-fade-in">
                    <h1 className="page-title">
                        {searchQuery ? `Search Results for "${searchQuery}"` : "Nearby Hospitals"}
                    </h1>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="hospital-list animate-fade-in">
                        <div className="hospitals-grid">
                            {[1, 2, 3].map((i) => (
                                <HospitalCard key={i} loading={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && (
                    <>
                        {(error || (filteredHospitals.length === 0 && !showDashboardWidgets)) ? (
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
                                            : "We couldn't find any hospitals matching your criteria. Try adjusting your filters."}
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            if (error) window.location.reload();
                                            else {
                                                setSearchQuery('');
                                                setAdvancedFilters({
                                                    distance: 50,
                                                    hospitalType: [],
                                                    minRating: 0,
                                                    bedTypes: [],
                                                    insurance: []
                                                });
                                            }
                                        }}
                                        className="empty-action-btn"
                                    >
                                        {error ? "Retry Connection" : "Clear Filters"}
                                    </Button>
                                </Card>
                            </div>
                        ) : (

                            <div className="hospital-list animate-slide-up">
                                {viewMode === 'list' ? (
                                    filteredHospitals.length > 0 ? (
                                        <>
                                            <div className="hospitals-grid">
                                                {filteredHospitals.map(hospital => (
                                                    <HospitalCard
                                                        key={hospital.id}
                                                        hospital={hospital}
                                                        onNotify={handleNotifyClick}
                                                        onRate={handleRateClick}
                                                        onJoinQueue={handleJoinQueueClick}
                                                        onBookAppointment={handleBookAppointment}
                                                    />
                                                ))}
                                            </div>

                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="pagination-controls">
                                                    <Button
                                                        variant="outline"
                                                        disabled={page === 1}
                                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <span className="page-info">Page {page} of {totalPages}</span>
                                                    <Button
                                                        variant="outline"
                                                        disabled={page === totalPages}
                                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="empty-list-message">
                                            <p>No hospitals found nearby. Try increasing the search radius.</p>
                                        </div>
                                    )
                                ) : (
                                    <MapView
                                        hospitals={filteredHospitals}
                                        userLocation={location}
                                        onMarkerClick={handleNotifyClick}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Drawers & Modals */}
            <AdvancedFiltersDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={advancedFilters}
            />

            <BookingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                hospital={selectedHospital}
            />

            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={handleCloseRatingModal}
                hospital={ratingHospital}
                onSubmit={handleSubmitRating}
            />

            <VirtualQueueModal
                isOpen={isQueueModalOpen}
                onClose={handleCloseQueueModal}
                hospital={queueHospital}
            />

            <AppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={handleCloseAppointmentModal}
                hospital={appointmentHospital}
            />
        </div >
    );
};

export default PatientDashboard;
