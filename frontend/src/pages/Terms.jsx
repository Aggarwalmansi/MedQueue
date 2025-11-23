import React from 'react';
import Header from '../components/Header';

import '../styles/Terms.css';

const Terms = () => {
    return (
        <div className="terms-page">
            <Header />
            <div className="terms-hero">
                <h1>Terms of Service</h1>
                <p>Effective Date: January 1, 2025</p>
            </div>
            <div className="terms-content">
                <p>By using MedQueue, you agree to the following terms and conditions...</p>
                <h2>Use of Service</h2>
                <p>MedQueue provides a platform to connect patients with hospitals. Users must provide accurate information and comply with all applicable laws.</p>
                <h2>Liability</h2>
                <p>MedQueue is not responsible for medical outcomes. All medical decisions are the responsibility of the patient and the healthcare provider.</p>
                <h2>Termination</h2>
                <p>We may terminate or suspend access to the Service for any violation of these terms.</p>
            </div>

        </div>
    );
};

export default Terms;
