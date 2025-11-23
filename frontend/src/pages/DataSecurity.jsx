import React from 'react';
import Header from '../components/Header';

import { Shield, Lock, Server, Eye } from 'lucide-react';
import '../styles/DataSecurity.css';

const DataSecurity = () => {
    return (
        <div className="security-page">
            <Header />

            <div className="security-hero">
                <Shield size={48} className="hero-icon" />
                <h1>Data Security</h1>
                <p>Your data security is our top priority. Learn how we protect your information.</p>
            </div>

            <div className="security-content">
                <div className="security-grid">
                    <div className="security-card">
                        <Lock size={32} className="card-icon" />
                        <h3>Encryption</h3>
                        <p>All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption standards.</p>
                    </div>
                    <div className="security-card">
                        <Server size={32} className="card-icon" />
                        <h3>Secure Infrastructure</h3>
                        <p>We host our services on secure, compliant cloud infrastructure with 24/7 monitoring and automated threat detection.</p>
                    </div>
                    <div className="security-card">
                        <Eye size={32} className="card-icon" />
                        <h3>Access Control</h3>
                        <p>Strict role-based access controls (RBAC) ensure that only authorized personnel can access sensitive data.</p>
                    </div>
                </div>

                <div className="compliance-section">
                    <h2>Compliance & Certifications</h2>
                    <p>We adhere to international standards and regulations to ensure the highest level of data protection.</p>
                    <ul className="compliance-list">
                        <li>HIPAA Compliant</li>
                        <li>GDPR Compliant</li>
                        <li>ISO 27001 Certified</li>
                        <li>SOC 2 Type II Certified</li>
                    </ul>
                </div>
            </div>


        </div>
    );
};

export default DataSecurity;
