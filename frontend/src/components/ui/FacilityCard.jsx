import React from 'react';
import '../../styles/FacilityCard.css';

const FacilityCard = ({ icon, title, specification, available, waitTime, nextSlot }) => {
    const getStatusClass = () => {
        if (available === false) return 'unavailable';
        if (waitTime && waitTime > 60) return 'busy';
        return 'available';
    };

    return (
        <div className={`facility-card ${getStatusClass()}`}>
            <div className="facility-icon">{icon}</div>
            <div className="facility-content">
                <h4 className="facility-title">{title}</h4>
                {specification && (
                    <p className="facility-spec">{specification}</p>
                )}
                <div className="facility-status">
                    {available === false ? (
                        <span className="status-text unavailable">❌ Unavailable</span>
                    ) : (
                        <>
                            <span className="status-text available">✅ Available</span>
                            {waitTime && (
                                <span className="wait-time">Wait: ~{waitTime} mins</span>
                            )}
                            {nextSlot && (
                                <span className="next-slot">Next: {new Date(nextSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacilityCard;
