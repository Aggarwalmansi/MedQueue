import { MapPin, Navigation, Activity, Star, Clock } from 'lucide-react';
import StarRating from '../ui/StarRating';
import '../../styles/HospitalCard.css';

const HospitalCard = ({ hospital, onNotify, onRate, onJoinQueue }) => {
    const { name, address, distance, bedsGeneral, bedsICU, bedsOxygen, averageRating, totalRatings, erWaitTimes } = hospital;

    const getWaitTimeColor = (minutes) => {
        if (minutes < 30) return 'green';
        if (minutes < 60) return 'yellow';
        return 'red';
    };

    return (
        <div className="hospital-card">
            <div className="card-content">
                <div className="card-header">
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="hospital-name">{name}</h3>
                            <div className="distance-badge">
                                {distance} km
                            </div>
                        </div>

                        <div className="rating-container">
                            <div className="rating-badge">
                                <span className="rating-score">{averageRating || 'New'}</span>
                                <Star size={14} className="rating-star-icon" />
                                <span className="rating-count">({totalRatings || 0})</span>
                            </div>
                            <button
                                onClick={() => onRate(hospital)}
                                className="rate-btn"
                            >
                                Rate
                            </button>
                        </div>

                        <div className="hospital-location">
                            <Navigation size={14} className="location-icon" />
                            <span>{address}</span>
                        </div>
                    </div>
                </div>

                <div className="beds-container">
                    <div className="bed-badge general">
                        <span className="badge-icon">G</span>
                        General: {bedsGeneral}
                    </div>
                    <div className="bed-badge icu">
                        <span className="badge-icon">I</span>
                        ICU: {bedsICU}
                    </div>
                    <div className="bed-badge oxygen">
                        <span className="badge-icon">O</span>
                        Oxygen: {bedsOxygen}
                    </div>
                </div>

                {/* ER Wait Times Section */}
                {erWaitTimes && (
                    <div className="er-wait-times">
                        <div className="er-header">
                            <Clock size={16} />
                            <span>ER Wait Times</span>
                        </div>
                        <div className="wait-time-badges">
                            {erWaitTimes.critical && (
                                <div className={`wait-badge ${getWaitTimeColor(erWaitTimes.critical.avgWaitMinutes)}`}>
                                    <span className="wait-icon">🔴</span>
                                    <span className="wait-label">Critical:</span>
                                    <span className="wait-time">&lt;{erWaitTimes.critical.avgWaitMinutes}m</span>
                                    <span className="wait-queue">• {erWaitTimes.critical.currentQueue} in queue</span>
                                </div>
                            )}
                            {erWaitTimes.moderate && (
                                <div className={`wait-badge ${getWaitTimeColor(erWaitTimes.moderate.avgWaitMinutes)}`}>
                                    <span className="wait-icon">🟡</span>
                                    <span className="wait-label">Moderate:</span>
                                    <span className="wait-time">&lt;{erWaitTimes.moderate.avgWaitMinutes}m</span>
                                    <span className="wait-queue">• {erWaitTimes.moderate.currentQueue} in queue</span>
                                </div>
                            )}
                            {erWaitTimes.nonUrgent && (
                                <div className={`wait-badge ${getWaitTimeColor(erWaitTimes.nonUrgent.avgWaitMinutes)}`}>
                                    <span className="wait-icon">🟢</span>
                                    <span className="wait-label">Non-urgent:</span>
                                    <span className="wait-time">&lt;{erWaitTimes.nonUrgent.avgWaitMinutes}m</span>
                                    <span className="wait-queue">• {erWaitTimes.nonUrgent.currentQueue} in queue</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="card-actions">
                    <button className="notify-btn" onClick={() => onNotify(hospital)}>
                        <Activity size={18} />
                        Notify Hospital
                    </button>
                    {erWaitTimes && (
                        <button className="queue-btn" onClick={() => onJoinQueue(hospital)}>
                            <Clock size={18} />
                            Join Virtual Queue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
