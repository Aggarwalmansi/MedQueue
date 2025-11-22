import React from 'react';
import { MapPin, Navigation, Activity } from 'lucide-react';
import '../../styles/HospitalCard.css';

const HospitalCard = ({ hospital, onNotify }) => {
    const { name, address, distance, bedsGeneral, bedsICU, bedsOxygen } = hospital;

    return (
        <div className="hospital-card">
            <div className="card-content">
                <div className="card-header">
                    <div>
                        <h3 className="hospital-name">{name}</h3>
                        <div className="hospital-location">
                            <Navigation size={14} className="location-icon" />
                            <span>{address}</span>
                        </div>
                    </div>
                    <div className="distance-badge">
                        {distance} km
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

                <button className="notify-btn" onClick={() => onNotify(hospital)}>
                    <Activity size={18} />
                    Notify Hospital
                </button>
            </div>
        </div>
    );
};

export default HospitalCard;
