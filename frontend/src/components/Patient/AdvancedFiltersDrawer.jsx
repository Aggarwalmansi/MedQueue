import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import '../../styles/AdvancedFiltersDrawer.css';

const AdvancedFiltersDrawer = ({ isOpen, onClose, onApply, currentFilters }) => {
    const [distance, setDistance] = useState(currentFilters.distance); // Initialize with current filter (can be null)
    const [hospitalType, setHospitalType] = useState(currentFilters.hospitalType || []);
    const [minRating, setMinRating] = useState(currentFilters.minRating || 0);
    const [bedTypes, setBedTypes] = useState(currentFilters.bedTypes || []);
    const [insurance, setInsurance] = useState(currentFilters.insurance || []);

    const handleHospitalTypeChange = (type) => {
        setHospitalType(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleBedTypeChange = (type) => {
        setBedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleApply = () => {
        onApply({
            distance,
            hospitalType,
            minRating,
            bedTypes,
            insurance
        });
        onClose();
    };

    const handleReset = () => {
        setDistance(null); // Reset to Unlimited
        setHospitalType([]);
        setMinRating(0);
        setBedTypes([]);
        setInsurance([]);
    };

    if (!isOpen) return null;

    return (
        <div className="filters-drawer-overlay" onClick={onClose}>
            <div className="filters-drawer" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <div className="drawer-title">
                        <Filter size={20} />
                        <h3>Filters</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Distance Slider */}
                    <div className="filter-section">
                        <h4>Distance</h4>
                        <div className="range-container">
                            <input
                                type="range"
                                min="1"
                                max="300"
                                value={distance || 300} // If null, show max
                                onChange={(e) => setDistance(parseInt(e.target.value))}
                                className="range-slider"
                            />
                            <span className="range-value">{distance ? `${distance} km` : 'All (Unlimited)'}</span>
                        </div>
                    </div>

                    {/* Hospital Type */}
                    <div className="filter-section">
                        <h4>Hospital Type</h4>
                        <div className="checkbox-group">
                            {['Government', 'Private', 'Multi-specialty', 'Clinic'].map(type => (
                                <label key={type} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={hospitalType.includes(type)}
                                        onChange={() => handleHospitalTypeChange(type)}
                                    />
                                    <span className="checkbox-custom">
                                        {hospitalType.includes(type) && <Check size={12} />}
                                    </span>
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rating Threshold */}
                    <div className="filter-section">
                        <h4>Minimum Rating</h4>
                        <div className="rating-options">
                            {[3, 3.5, 4, 4.5].map(rating => (
                                <button
                                    key={rating}
                                    className={`rating-chip ${minRating === rating ? 'active' : ''}`}
                                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                                >
                                    {rating}+ ⭐
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bed Types */}
                    <div className="filter-section">
                        <h4>Bed Availability</h4>
                        <div className="checkbox-group">
                            {['General', 'ICU', 'Oxygen', 'Ventilator'].map(type => (
                                <label key={type} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={bedTypes.includes(type)}
                                        onChange={() => handleBedTypeChange(type)}
                                    />
                                    <span className="checkbox-custom">
                                        {bedTypes.includes(type) && <Check size={12} />}
                                    </span>
                                    {type} Beds
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="drawer-footer">
                    <button className="reset-btn" onClick={handleReset}>Reset</button>
                    <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFiltersDrawer;
