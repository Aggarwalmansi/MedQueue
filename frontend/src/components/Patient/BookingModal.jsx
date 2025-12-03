import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, hospital }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        patientName: '',
        patientPhone: '',
        condition: '',
        severity: 'MODERATE'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !hospital) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.patientName || !formData.patientPhone || !formData.condition) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/patient/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hospitalId: hospital.id,
                    userId: user?.id || null,
                    ...formData
                })
            });

            if (!response.ok) {
                throw new Error('Booking failed. Please try again.');
            }

            const data = await response.json();

            // Close modal and navigate to success page
            onClose();
            navigate('/booking/success', { state: { booking: data.booking, hospital: hospital } });

        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <h2>Notify Hospital</h2>
                    <p className="modal-subtitle">
                        Notifying <strong>{hospital.name}</strong> of your arrival.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="modal-body">
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input
                            type="text"
                            name="patientName"
                            className="form-input"
                            placeholder="Full name"
                            value={formData.patientName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="patientPhone"
                            className="form-input"
                            placeholder="+1 (555) 000-0000"
                            value={formData.patientPhone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Condition</label>
                        <select
                            name="condition"
                            className="form-select"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value="">Select condition</option>
                            <option value="Accident">Accident / Trauma</option>
                            <option value="Cardiac">Chest Pain (Cardiac)</option>
                            <option value="Breathlessness">Breathlessness</option>
                            <option value="Fever">High Fever</option>
                            <option value="Pregnancy">Pregnancy</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Severity</label>
                        <select
                            name="severity"
                            className="form-select"
                            value={formData.severity}
                            onChange={handleChange}
                        >
                            <option value="LOW">LOW</option>
                            <option value="MODERATE">MODERATE</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-cancel" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-confirm" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Confirm Booking
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
