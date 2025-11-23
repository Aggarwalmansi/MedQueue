import React from 'react';
import Header from '../components/Header';

import '../styles/Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-page">
            <Header />
            <div className="privacy-hero">
                <h1>Privacy Policy</h1>
                <p>Effective Date: January 1, 2025</p>
            </div>
            <div className="privacy-content">
                <p>MedQueue respects your privacy. We collect only the information necessary to provide healthcare services. Your personal data is stored securely and never shared with third parties without your consent, except as required by law.</p>
                <h2>Data Collection</h2>
                <p>We collect personal details such as name, email, phone number, and health-related information when you create an account or book a service.</p>
                <h2>Data Usage</h2>
                <p>Collected data is used to match you with hospitals, manage bookings, and communicate updates. We may also use aggregated data for analytics and service improvements.</p>
                <h2>Data Security</h2>
                <p>All data is encrypted in transit (HTTPS) and at rest. Access is restricted to authorized personnel only.</p>
                <h2>Contact</h2>
                <p>If you have any questions about this policy, please contact us at <a href="mailto:support@medqueue.com">support@medqueue.com</a>.</p>
            </div>

        </div>
    );
};

export default Privacy;
