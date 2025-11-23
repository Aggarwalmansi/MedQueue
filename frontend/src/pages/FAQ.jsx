import React from 'react';
import Header from '../components/Header';

import '../styles/FAQ.css';

const FAQ = () => {
    const faqs = [
        { q: 'How do I create an account?', a: 'Click on Sign Up and follow the prompts.' },
        { q: 'Is the service free?', a: 'Yes, using MedQueue is completely free for patients.' },
        { q: 'How do I book a hospital bed?', a: 'Search for a hospital, view its details, and click Notify Hospital to start the booking process.' },
        { q: 'Can I cancel a booking?', a: 'Go to My Bookings and cancel any upcoming booking.' },
        { q: 'What if I need emergency assistance?', a: 'Call 108 for immediate emergency services.' }
    ];

    return (
        <div className="faq-page">
            <Header />
            <div className="faq-hero">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about using MedQueue.</p>
            </div>
            <div className="faq-content">
                {faqs.map((item, idx) => (
                    <details key={idx} className="faq-item">
                        <summary>{item.q}</summary>
                        <p>{item.a}</p>
                    </details>
                ))}
            </div>

        </div>
    );
};

export default FAQ;
