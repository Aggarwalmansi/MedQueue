import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, CheckCircle, ArrowRight, MapPin, Shield, User, Lock, Phone, Mail } from 'lucide-react';
import '../styles/HospitalSignup.css';

const HospitalSignup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        hospitalName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        licenseNumber: '',
        fullName: '' // Manager Name
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: 'HOSPITAL',
                    fullName: formData.fullName,
                    phone: formData.phone,
                    hospitalName: formData.hospitalName,
                    address: formData.address,
                    city: formData.city,
                    latitude: formData.latitude || 0, // Default if not provided
                    longitude: formData.longitude || 0
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Success - Redirect to login
            navigate('/login', { state: { message: 'Hospital registered successfully! Please login.' } });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hospital-signup-page">
            <Header />

            <div className="signup-container">
                <div className="signup-progress">
                    <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Basic Info</span>
                    </div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Location</span>
                    </div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span>Review</span>
                    </div>
                </div>

                <motion.div
                    className="signup-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2>Hospital Registration</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="form-step"
                                >
                                    <h3>Basic Information</h3>
                                    <div className="form-group">
                                        <label><Building size={16} /> Hospital Name</label>
                                        <input required name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Apollo Hospital" />
                                    </div>
                                    <div className="form-group">
                                        <label><User size={16} /> Manager Name</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label><Mail size={16} /> Official Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@hospital.com" />
                                    </div>
                                    <div className="form-group">
                                        <label><Phone size={16} /> Phone Number</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><Lock size={16} /> Password</label>
                                            <input required type="password" name="password" value={formData.password} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label><Lock size={16} /> Confirm Password</label>
                                            <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="form-step"
                                >
                                    <h3>Location Details</h3>
                                    <div className="form-group">
                                        <label><MapPin size={16} /> Address</label>
                                        <input required name="address" value={formData.address} onChange={handleChange} placeholder="123 Health Street" />
                                    </div>
                                    <div className="form-group">
                                        <label><Building size={16} /> City</label>
                                        <input required name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Latitude</label>
                                            <input required type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="19.0760" />
                                        </div>
                                        <div className="form-group">
                                            <label>Longitude</label>
                                            <input required type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="72.8777" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label><Shield size={16} /> License Number</label>
                                        <input required name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="MED-12345" />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="form-step"
                                >
                                    <h3>Review & Submit</h3>
                                    <div className="review-details">
                                        <p><strong>Hospital:</strong> {formData.hospitalName}</p>
                                        <p><strong>Manager:</strong> {formData.fullName}</p>
                                        <p><strong>Email:</strong> {formData.email}</p>
                                        <p><strong>Phone:</strong> {formData.phone}</p>
                                        <p><strong>Address:</strong> {formData.address}, {formData.city}</p>
                                        <p><strong>Coordinates:</strong> {formData.latitude}, {formData.longitude}</p>
                                    </div>
                                    <div className="terms-check">
                                        <input type="checkbox" required id="terms" />
                                        <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="form-actions">
                            {step > 1 && (
                                <button type="button" className="prev-btn" onClick={prevStep}>Back</button>
                            )}
                            {step < 3 ? (
                                <button type="submit" className="next-btn">Next <ArrowRight size={16} /></button>
                            ) : (
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Hospital Account'}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default HospitalSignup;
