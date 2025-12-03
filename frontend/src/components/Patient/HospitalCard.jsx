import { MapPin, Navigation, Activity, Star, Clock, Building2, Bed, Wind, CheckCircle, Map, Video, ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import '../../styles/HospitalCard.css';

const HospitalCard = ({ hospital, onNotify, onRate, onJoinQueue, onBookAppointment, loading }) => {
    const navigate = useNavigate();
    if (loading) {
        return (
            <div className="hospital-card skeleton-card">
                {/* Header Skeleton */}
                <div className="card-section section-header">
                    <div className="header-left" style={{ width: '60%' }}>
                        <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '8px' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px' }}></div>
                    </div>
                    <div className="header-right" style={{ width: '30%', alignItems: 'flex-end' }}>
                        <div className="skeleton skeleton-text" style={{ width: '60px', height: '20px', marginBottom: '8px' }}></div>
                        <div className="skeleton skeleton-badge" style={{ width: '80px', height: '24px' }}></div>
                    </div>
                </div>

                {/* Beds Skeleton */}
                <div className="card-section section-beds">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bed-metric skeleton" style={{ height: '70px', background: '#f3f4f6' }}></div>
                    ))}
                </div>

                {/* Details Skeleton */}
                <div className="card-section section-details">
                    <div className="er-wait-group">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="wait-circle-container">
                                <div className="skeleton skeleton-circle" style={{ width: '48px', height: '48px' }}></div>
                                <div className="skeleton skeleton-text" style={{ width: '40px', height: '10px', marginTop: '4px' }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="details-right">
                        <div className="specializations-list">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton skeleton-badge" style={{ width: '60px', height: '24px' }}></div>
                            ))}
                        </div>
                        <div className="skeleton skeleton-text" style={{ width: '100px', height: '20px', marginTop: '8px' }}></div>
                    </div>
                </div>

                {/* Actions Skeleton */}
                <div className="card-section section-actions">
                    <div className="skeleton" style={{ flex: 1, height: '44px', borderRadius: '8px' }}></div>
                    <div className="skeleton" style={{ flex: 1, height: '44px', borderRadius: '8px' }}></div>
                </div>
            </div>
        );
    }

    const { name, address, distance, bedsGeneral, bedsICU, bedsOxygen, averageRating, totalRatings, erWaitTimes, specializations, isVerified, isTopRated, isTrending } = hospital;

    const getBedColor = (count) => {
        if (count === 0) return 'red';
        if (count < 3) return 'amber';
        return 'green';
    };

    const openGoogleMaps = (e) => {
        e.stopPropagation();
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    };

    const handleCardClick = () => {
        navigate(`/hospital/${hospital.id}/details`);
    };

    const renderWaitCircle = (type, data) => {
        if (!data) return null;
        const { avgWaitMinutes, currentQueue } = data;
        const colorMap = {
            critical: '#ef4444',
            moderate: '#f59e0b',
            nonUrgent: '#10b981'
        };
        const color = colorMap[type];
        const isCritical = type === 'critical';

        return (
            <div className={`wait-circle-container ${isCritical ? 'pulse-animation' : ''}`}>
                <div className="wait-circle" style={{ borderColor: color, color: color }}>
                    <span className="wait-time-text">&lt;{avgWaitMinutes}m</span>
                </div>
                <span className="wait-label" style={{ color: color }}>
                    {type === 'nonUrgent' ? 'Non-urgent' : type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="wait-queue">Q: {currentQueue}</span>
            </div>
        );
    };

    return (
        <div className="hospital-card">
            {/* Section 1: Header */}
            <div className="card-section section-header">
                <div className="header-left">
                    <h3 className="hospital-name" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                        {name}
                        {isVerified && <CheckCircle size={18} className="verified-icon" fill="currentColor" stroke="white" />}
                    </h3>
                    <div className="hospital-address">
                        <MapPin size={14} />
                        {address}
                    </div>
                </div>
                <div className="header-right">
                    <div className="distance-badge" onClick={openGoogleMaps} role="button" tabIndex={0} title="Get Directions">
                        <Navigation size={14} fill="currentColor" />
                        {distance} km
                    </div>
                    {(averageRating >= 4.5 || isTopRated) && (
                        <div className="status-badge top-rated">Top Rated</div>
                    )}
                    {isTrending && !isTopRated && (
                        <div className="status-badge trending">TRENDING</div>
                    )}
                    {hospital.insuranceAccepted && hospital.insuranceAccepted.includes('Ayushman Bharat') && (
                        <div className="status-badge insurance-badge ayushman">
                            <ShieldCheck size={12} style={{ marginRight: '2px' }} />
                            Ayushman
                        </div>
                    )}
                </div>
            </div>

            {/* Section 2: Bed Availability */}
            <div className="card-section section-beds">
                <div className={`bed-metric ${getBedColor(bedsGeneral)}`}>
                    <div className="metric-icon"><Building2 size={18} /></div>
                    <div className="metric-info">
                        <span className="metric-count">{bedsGeneral}</span>
                        <span className="metric-label">General</span>
                    </div>
                </div>
                <div className={`bed-metric ${getBedColor(bedsICU)}`}>
                    <div className="metric-icon"><Activity size={18} /></div>
                    <div className="metric-info">
                        <span className="metric-count">{bedsICU}</span>
                        <span className="metric-label">ICU</span>
                    </div>
                </div>
                <div className={`bed-metric ${getBedColor(bedsOxygen)}`}>
                    <div className="metric-icon"><Wind size={18} /></div>
                    <div className="metric-info">
                        <span className="metric-count">{bedsOxygen}</span>
                        <span className="metric-label">Oxygen</span>
                    </div>
                </div>
            </div>

            {/* Section 3: Details (ER Wait Times, Specializations, Rating) */}
            <div className="card-section section-details">
                {erWaitTimes && (
                    <div className="er-wait-group">
                        {renderWaitCircle('critical', erWaitTimes.critical)}
                        {renderWaitCircle('moderate', erWaitTimes.moderate)}
                        {renderWaitCircle('nonUrgent', erWaitTimes.nonUrgent)}
                    </div>
                )}

                <div className="details-right">
                    {specializations && specializations.length > 0 && (
                        <div className="specializations-list">
                            {specializations.slice(0, 3).map((spec, idx) => (
                                <span key={idx} className="spec-badge">
                                    {spec.department}
                                </span>
                            ))}
                            {specializations.length > 3 && (
                                <a href={`/hospital/${hospital.id}`} className="spec-more">
                                    +{specializations.length - 3} more
                                </a>
                            )}
                        </div>
                    )}

                    <div className="rating-row">
                        <span className="rating-number">{averageRating || 'New'}</span>
                        <Star size={16} className="rating-star-filled" fill="#d97706" color="#d97706" />
                        <span className="rating-count">({totalRatings || 0} reviews)</span>
                        <button onClick={() => onRate(hospital)} className="rate-link">Rate</button>
                    </div>
                </div>
            </div>

            {/* Section 4: Actions */}
            <div className="card-section section-actions">
                <button className="action-btn notify-btn" onClick={(e) => { e.stopPropagation(); onNotify(hospital); }}>
                    Notify Emergency
                </button>
                <button className="action-btn book-btn" onClick={(e) => { e.stopPropagation(); onBookAppointment && onBookAppointment(hospital); }}>
                    <Calendar size={16} />
                    Book Appointment
                </button>
                {/* 
                <button className="action-btn queue-btn" onClick={() => onJoinQueue(hospital)}>
                    Join Queue
                </button> 
                */}
            </div>
        </div>
    );
};

export default HospitalCard;
