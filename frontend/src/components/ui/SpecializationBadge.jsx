import React from 'react';
import '../../styles/SpecializationBadge.css';

const SpecializationBadge = ({ department, level, small = false }) => {
    return (
        <div className={`specialization-badge ${small ? 'small' : ''}`}>
            <span className="badge-department">{department}</span>
            {level && !small && (
                <span className="badge-level">{level}</span>
            )}
        </div>
    );
};

export default SpecializationBadge;
