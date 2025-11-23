import React from 'react';
import Header from '../components/Header';

import { motion } from 'framer-motion';
import { FileText, Video, Download } from 'lucide-react';
import ComingSoonModal from '../components/ComingSoonModal';
import { useState } from 'react';
import '../styles/Resources.css';

const Resources = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resources = [
        {
            title: 'Hospital Onboarding Guide',
            type: 'PDF Guide',
            icon: <FileText size={24} />,
            description: 'A complete guide to getting your hospital set up on MedQueue.'
        },
        {
            title: 'Best Practices for Bed Management',
            type: 'Video Tutorial',
            icon: <Video size={24} />,
            description: 'Learn how to efficiently manage bed availability and reduce wait times.'
        },
        {
            title: 'API Integration Documentation',
            type: 'Technical Doc',
            icon: <Download size={24} />,
            description: 'Technical specifications for integrating your hospital management system.'
        }
    ];

    return (
        <div className="resources-page">
            <Header />

            <div className="resources-hero">
                <h1>Hospital Resources</h1>
                <p>Guides, tutorials, and documentation to help you succeed.</p>
            </div>

            <div className="resources-grid">
                {resources.map((resource, index) => (
                    <motion.div
                        key={index}
                        className="resource-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="resource-icon">{resource.icon}</div>
                        <div className="resource-content">
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <button className="access-btn" onClick={() => setIsModalOpen(true)}>Access Resource</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <ComingSoonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Resource Coming Soon"
            />

        </div>
    );
};

export default Resources;
