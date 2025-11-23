import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SearchBar from './SearchBar';

const SearchOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="search-overlay"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <div className="overlay-header">
                    <button className="close-overlay-btn" onClick={onClose}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <SearchBar isMobile={true} onCloseMobile={onClose} />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchOverlay;
