import React, { useState } from 'react';
import { X } from 'lucide-react';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';
import '../../styles/RatingModal.css';

const RatingModal = ({ isOpen, onClose, hospital, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !hospital) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        await onSubmit(hospital.id, rating, comment);
        setLoading(false);
        setRating(0);
        setComment('');
        onClose();
    };

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal-content">
                <button
                    onClick={onClose}
                    className="rating-modal-close"
                >
                    <X size={24} />
                </button>

                <h2 className="rating-modal-title">Rate {hospital.name}</h2>
                <p className="rating-modal-desc">Share your experience to help others.</p>

                <div className="rating-modal-stars">
                    <StarRating
                        rating={rating}
                        onRate={setRating}
                        size={40}
                    />
                    <p className="rating-text">
                        {rating > 0 ? `You rated ${rating} stars` : 'Tap stars to rate'}
                    </p>
                </div>

                <div className="rating-form-group">
                    <label className="rating-label">
                        Review (Optional)
                    </label>
                    <textarea
                        className="rating-textarea"
                        rows="3"
                        placeholder="Tell us about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                <div className="rating-actions">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rating-btn-cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="rating-btn-submit"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
