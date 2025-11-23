import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import HospitalRecommendations from './HospitalRecommendations';

const ResultScreen = ({ result }) => {
    return (
        <motion.div
            className="result-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className={`urgency-badge urgency-${result.urgency.toLowerCase()}`}>
                {result.urgency} PRIORITY
            </div>

            <div className="action-list">
                <h4><CheckCircle size={20} color="#0d9488" /> Recommended Actions</h4>
                <ul>
                    {result.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                    ))}
                </ul>
            </div>

            <div className="facility-info">
                <strong>Required Facility:</strong> {result.facility}
            </div>

            <HospitalRecommendations specialization={result.specialization} />

            <div className="disclaimer">
                <AlertTriangle size={24} />
                <div>
                    <strong>Medical Disclaimer:</strong>
                    <p>This assessment provides guidance only. For life-threatening emergencies, call 108 immediately. This is not a substitute for professional medical advice.</p>
                </div>
            </div>

            {result.urgency === 'CRITICAL' && (
                <a href="tel:108" className="emergency-fab" style={{ position: 'static', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    <Phone size={20} /> Call 108 Now
                </a>
            )}
        </motion.div>
    );
};

export default ResultScreen;
