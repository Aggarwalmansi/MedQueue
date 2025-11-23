import React from 'react';
import Header from '../components/Header';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import '../styles/Pricing.css';

const Pricing = () => {
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            features: ['Real-time Bed Updates', 'Basic Analytics', 'Email Support'],
            recommended: false
        },
        {
            name: 'Pro',
            price: '₹2999/mo',
            features: ['Everything in Basic', 'Priority Support', 'Advanced Analytics', 'SMS Notifications'],
            recommended: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            features: ['Everything in Pro', 'Dedicated Account Manager', 'API Access', 'Custom Integrations'],
            recommended: false
        }
    ];

    return (
        <div className="pricing-page">
            <Header />

            <div className="pricing-hero">
                <h1>Simple, Transparent Pricing</h1>
                <p>Choose the plan that fits your hospital's needs.</p>
            </div>

            <div className="pricing-cards">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                    >
                        {plan.recommended && <div className="badge">Recommended</div>}
                        <h2>{plan.name}</h2>
                        <div className="price">{plan.price}</div>
                        <ul className="features">
                            {plan.features.map((feature, i) => (
                                <li key={i}><Check size={16} /> {feature}</li>
                            ))}
                        </ul>
                        <button className="plan-btn">Choose {plan.name}</button>
                    </motion.div>
                ))}
            </div>


        </div>
    );
};

export default Pricing;
