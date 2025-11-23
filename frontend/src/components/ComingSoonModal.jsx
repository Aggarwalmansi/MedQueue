import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Construction } from 'lucide-react';
import '../styles/ComingSoonModal.css';

const ComingSoonModal = ({ isOpen, onClose, title = "Coming Soon" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    className="coming-soon-modal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>

                    <div className="modal-content">
                        <div className="icon-wrapper">
                            <Construction size={48} />
                        </div>
                        <h2>{title}</h2>
                        <p>We're working hard to bring you this feature. Stay tuned for updates!</p>
                        <button className="notify-btn" onClick={onClose}>Got it</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComingSoonModal;
