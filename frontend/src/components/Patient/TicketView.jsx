import React from 'react';
import { Navigation, MapPin, Clock, User, Activity, AlertCircle } from 'lucide-react';
import '../../styles/TicketView.css';

const TicketView = ({ booking, hospital }) => {
    const { id, patientName, condition, createdAt, status, severity } = booking || {};
    const { name, address, latitude, longitude } = hospital || {};

    const handleNavigate = () => {
        if (!latitude || !longitude) return;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    // Generate QR Code URL
    const qrData = JSON.stringify({ bookingId: id, patient: patientName, hospital: name });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

    // Format Date
    const bookingDate = new Date(createdAt || Date.now());
    const formattedDate = bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = bookingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <div className="ticket-container">
            <div className="ticket-card">
                {/* QR Code Section */}
                <div className="qr-section">
                    <img src={qrUrl} alt="Booking QR Code" className="qr-img" />
                </div>

                {/* Hospital Details */}
                <div className="hospital-section">
                    <div className="hospital-icon">
                        <MapPin size={20} />
                    </div>
                    <div className="hospital-info">
                        <h3 className="hospital-name">{name || 'Unknown Hospital'}</h3>
                        <p className="hospital-address">{address || 'Address unavailable'}</p>
                    </div>
                </div>

                {/* Booking Time */}
                <div className="time-section">
                    <Clock size={16} />
                    <span>Booking Time: {formattedDate}, {formattedTime}</span>
                </div>

                <div className="divider"></div>

                {/* Patient Details Grid */}
                <div className="patient-grid">
                    <div className="grid-row">
                        <span className="label">Patient</span>
                        <span className="value">{patientName || 'N/A'}</span>
                    </div>
                    <div className="grid-row">
                        <span className="label">Condition</span>
                        <span className="value">{condition || 'N/A'}</span>
                    </div>
                    <div className="grid-row">
                        <span className="label">Status</span>
                        <span className={`status-badge status-${status?.toLowerCase() || 'incoming'}`}>
                            {status || 'INCOMING'}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="navigate-btn" onClick={handleNavigate}>
                    <Navigation size={18} />
                    Navigate to Hospital
                </button>
            </div>

            {/* Booking ID Footer */}
            <div className="ticket-footer">
                Booking ID: {id ? `BK-${id.toString().padStart(8, '0')}` : 'PENDING'}
            </div>
        </div>
    );
};

export default TicketView;
