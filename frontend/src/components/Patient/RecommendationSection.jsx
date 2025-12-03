import React from 'react';
import { Sparkles } from 'lucide-react';
import HospitalCard from './HospitalCard';
import '../../styles/RecommendationSection.css';

const RecommendationSection = ({ hospitals, onNotify, onRate, onJoinQueue }) => {
    if (!hospitals || hospitals.length === 0) return null;

    return (
        <div className="recommendation-section">
            <div className="recommendation-header">
                <Sparkles className="recommendation-icon" size={24} />
                <h2>Recommended for You</h2>
            </div>

            <div className="recommendation-grid">
                {hospitals.map(hospital => (
                    <div key={hospital.id} className="recommendation-item">
                        {hospital.recommendationReason && (
                            <div className="recommendation-reason">
                                {hospital.recommendationReason}
                            </div>
                        )}
                        <HospitalCard
                            hospital={hospital}
                            onNotify={onNotify}
                            onRate={onRate}
                            onJoinQueue={onJoinQueue}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationSection;
