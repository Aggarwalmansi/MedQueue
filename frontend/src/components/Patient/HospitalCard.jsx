import React from 'react';
import { MapPin, Navigation, Send, Activity, Wind, HeartPulse } from 'lucide-react';
import '../../styles/HospitalCard.css';

const HospitalCard = ({ hospital, onNotify }) => {
    const { name, distance, bedsGeneral, bedsICU, bedsOxygen, address } = hospital;

    return (
        <div className="hospital-card-premium">
            <div className="card-header">
                <div className="flex-1">
                    <h3 className="hospital-name">{name}</h3>
                    <div className="hospital-meta">
                        <div className="meta-item">
                            <Navigation size={14} />
                            <span>{distance} km</span>
                        </div>
                        <div className="meta-dot"></div>
                        <div className="meta-item">
                            <MapPin size={14} />
                            <span className="truncate" style={{ maxWidth: '200px' }}>{address}</span>
                        </div>
                    </div>
                </div>

                <div className="response-badge">
                    &lt; 2 mins
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatChip
                    icon={HeartPulse}
                    label="ICU"
                    count={bedsICU}
                    critical={true}
                />
                <StatChip
                    icon={Wind}
                    label="Oxygen"
                    count={bedsOxygen}
                />
                <StatChip
                    icon={Activity}
                    label="General"
                    count={bedsGeneral}
                />
            </div>

            <button
                className="notify-btn"
                onClick={() => onNotify(hospital)}
            >
                <Send size={16} />
                Notify Hospital
            </button>
        </div>
    );
};

const StatChip = ({ icon: Icon, label, count, critical }) => {
    const isAvailable = count > 0;
    const className = `stat-chip ${isAvailable ? 'available' : 'critical'}`;

    return (
        <div className={className}>
            <Icon size={14} />
            <span className="stat-label">{label}:</span>
            <span className="stat-value">{count}</span>
        </div>
    );
};

export default HospitalCard;
