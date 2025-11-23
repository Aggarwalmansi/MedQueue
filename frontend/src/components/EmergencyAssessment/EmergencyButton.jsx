import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import '../../styles/EmergencyAssessment.css';

const EmergencyButton = ({ onClick }) => {
    return (
        <motion.button
            className="emergency-fab"
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <AlertCircle size={24} />
            </motion.div>
            <span>Emergency Help</span>
        </motion.button>
    );
};

export default EmergencyButton;
