import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bed, Stethoscope, Building2, Clock, MapPin, X } from 'lucide-react';

const SearchSuggestions = ({ suggestions, recentSearches, onSelect, onRemoveRecent, loading }) => {
    const hasSuggestions = suggestions && (
        suggestions.hospitals?.length > 0 ||
        suggestions.specializations?.length > 0 ||
        suggestions.facilities?.length > 0 ||
        suggestions.bedTypes?.length > 0
    );

    if (loading) {
        return (
            <motion.div
                className="search-suggestions"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="p-4 text-center text-gray-500">Searching...</div>
            </motion.div>
        );
    }

    if (!hasSuggestions && recentSearches?.length > 0) {
        return (
            <motion.div
                className="search-suggestions"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="recent-searches">
                    <div className="category-header">Recent Searches</div>
                    {recentSearches.map((term, index) => (
                        <div key={index} className="recent-item" onClick={() => onSelect(term, 'recent')}>
                            <div className="recent-text">
                                <Clock size={16} />
                                <span>{term}</span>
                            </div>
                            <button
                                className="remove-recent"
                                onClick={(e) => { e.stopPropagation(); onRemoveRecent(term); }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="quick-filters">
                    <h4>Popular Searches</h4>
                    <div className="chips-container">
                        {['ICU Beds', 'Cardiologist', 'MRI Scan', 'Emergency', 'Pediatric'].map(chip => (
                            <button key={chip} className="quick-chip" onClick={() => onSelect(chip, 'popular')}>
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!hasSuggestions) return null;

    return (
        <motion.div
            className="search-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            {suggestions.bedTypes?.length > 0 && (
                <div className="suggestion-category">
                    <div className="category-header">Bed Types</div>
                    {suggestions.bedTypes.map((bed, i) => (
                        <div key={i} className="suggestion-item" onClick={() => onSelect(bed, 'bed')}>
                            <div className="suggestion-icon"><Bed size={18} /></div>
                            <span>{bed}</span>
                        </div>
                    ))}
                </div>
            )}

            {suggestions.specializations?.length > 0 && (
                <div className="suggestion-category">
                    <div className="category-header">Specializations</div>
                    {suggestions.specializations.map((spec, i) => (
                        <div key={i} className="suggestion-item" onClick={() => onSelect(spec, 'specialization')}>
                            <div className="suggestion-icon"><Stethoscope size={18} /></div>
                            <span>{spec}</span>
                        </div>
                    ))}
                </div>
            )}

            {suggestions.facilities?.length > 0 && (
                <div className="suggestion-category">
                    <div className="category-header">Facilities</div>
                    {suggestions.facilities.map((fac, i) => (
                        <div key={i} className="suggestion-item" onClick={() => onSelect(fac, 'facility')}>
                            <div className="suggestion-icon"><Building2 size={18} /></div>
                            <span>{fac}</span>
                        </div>
                    ))}
                </div>
            )}

            {suggestions.hospitals?.length > 0 && (
                <div className="suggestion-category">
                    <div className="category-header">Hospitals</div>
                    {suggestions.hospitals.map((hosp, i) => (
                        <div key={i} className="suggestion-item" onClick={() => onSelect(hosp.name, 'hospital')}>
                            <div className="suggestion-icon"><MapPin size={18} /></div>
                            <span>{hosp.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default SearchSuggestions;
