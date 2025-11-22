import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketView from '../components/Patient/TicketView';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import '../styles/BookingSuccess.css';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, hospital } = location.state || {};

    useEffect(() => {
        if (!booking || !hospital) {
            console.error("BookingSuccess: Missing booking or hospital data", location.state);
        }
    }, [booking, hospital, location.state]);

    if (!booking || !hospital) {
        return (
            <div className="success-page-container">
                <div className="error-card">
                    <div className="error-icon-wrapper">
                        <AlertTriangle size={24} />
                    </div>
                    <h2 className="error-title">Missing Booking Details</h2>
                    <p className="error-desc">
                        We couldn't find the booking details. This might happen if you refreshed the page.
                    </p>
                    <button onClick={() => navigate('/patient')} className="btn btn-confirm btn-full">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page-container">
            <div className="success-content-wrapper">
                <div className="success-header">
                    <div className="success-icon-wrapper">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="success-title">
                        Hospital Notified
                    </h2>
                    <p className="success-subtitle">
                        Help is ready. Show this ticket upon arrival.
                    </p>
                </div>

                <TicketView booking={booking} hospital={hospital} />

                <div className="return-link-container">
                    <button
                        onClick={() => navigate('/patient')}
                        className="return-link"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
