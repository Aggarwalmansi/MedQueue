import React, { useState } from 'react';
import { Star } from 'lucide-react';
import '../../styles/StarRating.css';

const StarRating = ({ rating, onRate, readOnly = false, size = 20 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
        if (!readOnly) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const handleClick = (index) => {
        if (!readOnly && onRate) {
            onRate(index);
        }
    };

    return (
        <div className="star-rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`star-icon ${(hoverRating || rating) >= star ? 'filled' : ''
                        } ${!readOnly ? 'interactive' : 'readonly'}`}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star)}
                />
            ))}
        </div>
    );
};

export default StarRating;
