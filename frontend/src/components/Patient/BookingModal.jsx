import React, { useState } from 'react';

const BookingModal = ({ hospital, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientPhone: '',
        condition: 'Cardiac' // Default
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end', // Bottom sheet style for mobile feel
            zIndex: 1000
        },
        modal: {
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '500px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px',
            animation: 'slideUp 0.3s ease-out'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1f1f1f'
        },
        inputGroup: {
            marginBottom: '16px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#595959'
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #d9d9d9',
            fontSize: '1rem',
            outline: 'none'
        },
        select: {
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #d9d9d9',
            fontSize: '1rem',
            backgroundColor: '#fff'
        },
        submitBtn: {
            width: '100%',
            padding: '16px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px'
        },
        cancelBtn: {
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#8c8c8c',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '8px'
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Notify {hospital.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Patient Name</label>
                        <input
                            style={styles.input}
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input
                            style={styles.input}
                            name="patientPhone"
                            value={formData.patientPhone}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 9876543210"
                            type="tel"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Condition</label>
                        <select
                            style={styles.select}
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value="Cardiac">Cardiac (Chest Pain)</option>
                            <option value="Accident">Accident / Trauma</option>
                            <option value="Breathlessness">Breathlessness</option>
                            <option value="Pregnancy">Pregnancy</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button style={styles.submitBtn} type="submit" disabled={loading}>
                        {loading ? 'Sending...' : '🚨 Send Emergency Alert'}
                    </button>
                    <button style={styles.cancelBtn} type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
