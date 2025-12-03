import React, { useState } from 'react';
import '../../styles/VirtualQueueModal.css';

const VirtualQueueModal = ({ isOpen, onClose, hospital }) => {
    const [patientName, setPatientName] = useState('');
    const [severity, setSeverity] = useState('MODERATE');
    const [loading, setLoading] = useState(false);
    const [queueEntry, setQueueEntry] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/patient/hospitals/${hospital.id}/virtual-queue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientName,
                    severity
                })
            });

            if (!response.ok) throw new Error('Failed to join queue');

            const data = await response.json();
            setQueueEntry(data);
        } catch (err) {
            console.error(err);
            alert('Failed to join virtual queue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPatientName('');
        setSeverity('MODERATE');
        setQueueEntry(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {!queueEntry ? (
                    <>
                        <h2 className="modal-title">Join Virtual ER Queue</h2>
                        <p className="modal-subtitle">{hospital?.name}</p>

                        <form onSubmit={handleSubmit} className="queue-form">
                            <div className="form-group">
                                <label htmlFor="patientName">Patient Name</label>
                                <input
                                    type="text"
                                    id="patientName"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    required
                                    placeholder="Enter patient name"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Severity Level</label>
                                <div className="severity-options">
                                    <label className={`severity-option ${severity === 'CRITICAL' ? 'selected critical' : ''}`}>
                                        <input
                                            type="radio"
                                            name="severity"
                                            value="CRITICAL"
                                            checked={severity === 'CRITICAL'}
                                            onChange={(e) => setSeverity(e.target.value)}
                                        />
                                        <span className="severity-icon">🔴</span>
                                        <span>Critical</span>
                                    </label>

                                    <label className={`severity-option ${severity === 'MODERATE' ? 'selected moderate' : ''}`}>
                                        <input
                                            type="radio"
                                            name="severity"
                                            value="MODERATE"
                                            checked={severity === 'MODERATE'}
                                            onChange={(e) => setSeverity(e.target.value)}
                                        />
                                        <span className="severity-icon">🟡</span>
                                        <span>Moderate</span>
                                    </label>

                                    <label className={`severity-option ${severity === 'LOW' ? 'selected low' : ''}`}>
                                        <input
                                            type="radio"
                                            name="severity"
                                            value="LOW"
                                            checked={severity === 'LOW'}
                                            onChange={(e) => setSeverity(e.target.value)}
                                        />
                                        <span className="severity-icon">🟢</span>
                                        <span>Non-urgent</span>
                                    </label>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleClose} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="btn-submit">
                                    {loading ? 'Joining...' : 'Join Queue'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="queue-success">
                        <div className="success-icon">✓</div>
                        <h2 className="success-title">Successfully Joined Queue!</h2>
                        <div className="queue-info">
                            <div className="info-item">
                                <span className="info-label">Queue Number:</span>
                                <span className="info-value">#{queueEntry.queueEntry.id}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Position:</span>
                                <span className="info-value">{queueEntry.position}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Severity:</span>
                                <span className="info-value">{severity}</span>
                            </div>
                        </div>
                        <p className="success-note">
                            Please arrive at the hospital within 30 minutes. You will receive updates on your queue position.
                        </p>
                        <button onClick={handleClose} className="btn-done">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualQueueModal;
