import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

const HospitalRecommendations = ({ specialization, userLocation }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                // In a real app, we would pass lat/lng and specialization to the backend
                // For now, we'll fetch all and filter client-side or use the existing endpoint
                const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
                const response = await fetch(`${apiUrl}/api/patient/hospitals?lat=12.9716&lng=77.5946&specialization=${specialization}`);

                if (response.ok) {
                    const data = await response.json();
                    // Take top 3
                    setHospitals(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch hospitals", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [specialization]);

    if (loading) return <div>Finding nearby hospitals...</div>;
    if (hospitals.length === 0) return <div>No matching hospitals found nearby. Please call 108.</div>;

    return (
        <div className="hospital-recommendations">
            <h4>Recommended Hospitals</h4>
            {hospitals.map((hospital, index) => (
                <motion.div
                    key={hospital.id}
                    className="rec-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="rec-info">
                        <h5>{hospital.name}</h5>
                        <div className="rec-meta">
                            <span><MapPin size={14} /> {hospital.distance} km</span>
                            <span><Clock size={14} /> {hospital.erWaitTimes?.critical?.avgWaitMinutes || 15} min wait</span>
                        </div>
                    </div>
                    <div className="rec-actions">
                        <a href={`tel:${hospital.phone}`} className="rec-btn btn-outline">
                            <Phone size={16} />
                        </a>
                        <button className="rec-btn btn-primary">
                            <Navigation size={16} /> Go
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default HospitalRecommendations;
