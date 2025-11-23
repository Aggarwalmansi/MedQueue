import React from 'react';
import Header from '../components/Header';

import '../styles/Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <Header />
            <div className="contact-hero">
                <h1>Contact Us</h1>
                <p>We are here to help. Fill the form below or reach us via email/phone.</p>
            </div>
            <div className="contact-form">
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows={5} placeholder="Your message..." required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </div>

        </div>
    );
};

export default Contact;
