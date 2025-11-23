import React from 'react';
import Header from '../components/Header';

import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <Header />
            <div className="about-hero">
                <h1>About MedQueue</h1>
                <p>Connecting patients with care when it matters most.</p>
            </div>
            <div className="about-content">
                <p>MedQueue is a platform designed to streamline hospital bed availability, emergency wait times, and patient bookings across India. Our mission is to provide transparent, real-time information to empower patients and hospitals alike.</p>
            </div>

        </div>
    );
};

export default About;
