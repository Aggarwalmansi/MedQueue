import React from 'react';
import '../../styles/BloodStockGrid.css';

const BloodStockGrid = ({ stocks }) => {
    if (!stocks) return null;

    const bloodTypes = [
        { type: 'A+', key: 'APositive' },
        { type: 'A-', key: 'ANegative' },
        { type: 'B+', key: 'BPositive' },
        { type: 'B-', key: 'BNegative' },
        { type: 'O+', key: 'OPositive' },
        { type: 'O-', key: 'ONegative' },
        { type: 'AB+', key: 'ABPositive' },
        { type: 'AB-', key: 'ABNegative' }
    ];

    const getStockClass = (count) => {
        if (count === 0) return 'out-of-stock';
        if (count < 5) return 'low-stock';
        return 'in-stock';
    };

    return (
        <div className="blood-stock-grid">
            {bloodTypes.map(({ type, key }) => (
                <div key={type} className={`blood-type-badge ${getStockClass(stocks[key] || 0)}`}>
                    <span className="blood-type">{type}</span>
                    <span className="blood-count">{stocks[key] || 0}</span>
                </div>
            ))}
        </div>
    );
};

export default BloodStockGrid;
