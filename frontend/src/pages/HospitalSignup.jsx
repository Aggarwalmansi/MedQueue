import React from 'react';
import Header from '../components/Header';

import { motion } from 'framer-motion';
import { Building, CheckCircle, ArrowRight } from 'lucide-react';
import '../styles/HospitalSignup.css';

const HospitalSignup = () => {
    return (
        <div className="hospital-signup-page">
            <Header />

            <motion.div
                className="signup-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Join the MedQueue Network</h1>
                <p>Partner with us to streamline patient admissions and improve healthcare access.</p>
                <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started <ArrowRight size={20} />
                </motion.button>
            </motion.div>

            <div className="signup-content">
                <div className="benefits-section">
                    <motion.div
                        className="benefit-card"
                        whileHover={{ y: -5 }}
                    >
                        <Building size={32} className="benefit-icon" />
                        <h3>Real-time Management</h3>
                        <p>Update bed availability and ER wait times instantly.</p>
                    </motion.div>
                    <motion.div
                        className="benefit-card"
                        whileHover={{ y: -5 }}
                    >
                        <CheckCircle size={32} className="benefit-icon" />
                        <h3>Verified Bookings</h3>
                        <p>Receive verified patient bookings directly to your dashboard.</p>
                    </motion.div>
                </div>

                <div className="signup-form-container">
                    <h2>Hospital Registration</h2>
                    <form className="signup-form">
                        <div className="form-group">
                            <label>Hospital Name</label>
                            <input type="text" placeholder="Enter hospital name" />
                        </div>
                        <div className="form-group">
                            <label>Official Email</label>
                            <input type="email" placeholder="admin@hospital.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" />
                        </div>
                        <div className="form-group">
                            <label>License Number</label>
                            <input type="text" placeholder="Medical License No." />
                        </div>
                        <button type="submit" className="submit-btn">Register Hospital</button>
                    </form>
                </div>
            </div>


        </div>
    );
};

export default HospitalSignup;
