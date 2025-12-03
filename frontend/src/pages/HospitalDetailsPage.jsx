import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Star, CheckCircle, Phone, Mail, MessageCircle,
    Award, Building2, Calendar, Shield, Ambulance, Clock, Heart,
    Stethoscope, Activity, CreditCard, Video, ChevronDown, ChevronUp,
    Filter, X
} from 'lucide-react';
import '../styles/HospitalDetailsPage.css';

const HospitalDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [isPreRegOpen, setIsPreRegOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchHospitalDetails();
    }, [id]);

    const fetchHospitalDetails = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/patient/hospitals/${id}/facilities`);
            if (!response.ok) throw new Error('Failed to fetch hospital details');
            const data = await response.json();
            setHospital(data.hospital);
        } catch (error) {
            console.error('Error fetching hospital details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!hospital) {
        return (
            <div className="error-container">
                <p>Hospital not found</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="hospital-details-page">
            {/* Hero Section */}
            <HeroSection hospital={hospital} onBack={() => navigate(-1)} />

            {/* Overview Section */}
            <OverviewSection hospital={hospital} />

            {/* Doctor Directory Section */}
            <DoctorDirectorySection
                doctors={mockDoctors}
                selectedSpecialization={selectedSpecialization}
                setSelectedSpecialization={setSelectedSpecialization}
            />

            {/* Facilities Section */}
            <FacilitiesSection hospital={hospital} />

            {/* Pricing Section */}
            <PricingSection />

            {/* Emergency Capability Section */}
            <EmergencyCapabilitySection />

            {/* Appointment Booking Section */}
            <AppointmentBookingSection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            {/* Emergency Pre-Registration Section */}
            <PreRegistrationSection
                isOpen={isPreRegOpen}
                setIsOpen={setIsPreRegOpen}
            />

            {/* Insurance & Payment Section */}
            <InsurancePaymentSection />

            {/* Patient Testimonials Section */}
            <TestimonialsSection />
        </div>
    );
};

// Hero Section Component
const HeroSection = ({ hospital, onBack }) => (
    <section className="hero-section">
        <div className="hero-blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
        </div>

        <div className="hero-container">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                <span>Back to List</span>
            </button>

            <div className="hero-content">
                <div className="hero-header">
                    <div className="hero-title-row">
                        <h1>{hospital.name}</h1>
                        {hospital.isVerified && (
                            <CheckCircle className="verified-badge" size={28} fill="#17A2A2" color="white" />
                        )}
                        <span className="top-rated-badge">TOP RATED</span>
                    </div>

                    <div className="rating-row">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                            ))}
                        </div>
                        <span className="rating-text">{hospital.averageRating || 5.0} ({hospital.totalRatings || 0} reviews)</span>
                    </div>
                </div>

                <div className="hero-meta">
                    <div className="meta-item">
                        <MapPin size={18} />
                        <span>{hospital.address}</span>
                    </div>
                    {hospital.distance && (
                        <div className="meta-item">
                            <Activity size={18} />
                            <span>{hospital.distance} km away</span>
                        </div>
                    )}
                    <a href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-map-link">
                        View on Map →
                    </a>
                </div>

                <div className="hero-actions">
                    <a href={`tel:${hospital.phone}`} className="action-btn primary">
                        <Phone size={18} />
                        Call Now
                    </a>
                    <a href={`mailto:${hospital.manager?.email}`} className="action-btn secondary">
                        <Mail size={18} />
                        Email
                    </a>
                    <a href={`https://wa.me/${hospital.phone}`} className="action-btn secondary">
                        <MessageCircle size={18} />
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </section>
);

// Overview Section Component
const OverviewSection = ({ hospital }) => (
    <section className="overview-section">
        <div className="section-container">
            <h2 className="section-title">Hospital Overview</h2>

            <div className="overview-grid">
                <div className="overview-card">
                    <Award size={24} className="card-icon" />
                    <h3>Accreditations</h3>
                    <div className="accreditation-logos">
                        {hospital.accreditations?.map((acc, i) => (
                            <span key={i} className="accreditation-badge">
                                {typeof acc === 'string' ? acc : acc.name}
                            </span>
                        )) || <span className="accreditation-badge">NABH</span>}
                    </div>
                </div>

                <div className="overview-card">
                    <Building2 size={24} className="card-icon" />
                    <h3>Type</h3>
                    <p className="card-value">{hospital.type || 'Multi-specialty'}</p>
                </div>

                <div className="overview-card">
                    <Calendar size={24} className="card-icon" />
                    <h3>Established</h3>
                    <p className="card-value">{hospital.yearEstablished || '1995'}</p>
                </div>

                <div className="overview-card full-width">
                    <h3>About</h3>
                    <p className="hospital-description">
                        {hospital.description || 'A leading healthcare institution committed to providing world-class medical services with state-of-the-art facilities and experienced medical professionals.'}
                    </p>
                </div>
            </div>
        </div>
    </section>
);

// Mock data for doctors (will be replaced with API data)
const mockDoctors = [
    {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        photo: null,
        specialization: 'Cardiology',
        qualification: 'MD, DM (Cardiology)',
        availability: 'Available',
        fee: 800
    },
    {
        id: 2,
        name: 'Dr. Priya Sharma',
        photo: null,
        specialization: 'Neurology',
        qualification: 'MD, DM (Neurology)',
        availability: 'Available',
        fee: 1000
    },
    {
        id: 3,
        name: 'Dr. Amit Patel',
        photo: null,
        specialization: 'Orthopedics',
        qualification: 'MS (Ortho)',
        availability: 'Busy',
        fee: 700
    }
];

// Doctor Directory Section Component
const DoctorDirectorySection = ({ doctors, selectedSpecialization, setSelectedSpecialization }) => {
    const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];
    const filteredDoctors = selectedSpecialization === 'All'
        ? doctors
        : doctors.filter(d => d.specialization === selectedSpecialization);

    return (
        <section className="doctor-directory-section">
            <div className="section-container">
                <h2 className="section-title">Our Doctors</h2>

                <div className="filter-row">
                    <Filter size={18} />
                    <span>Filter by:</span>
                    <div className="specialization-filters">
                        {specializations.map(spec => (
                            <button
                                key={spec}
                                className={`filter-chip ${selectedSpecialization === spec ? 'active' : ''}`}
                                onClick={() => setSelectedSpecialization(spec)}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="doctors-grid">
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="doctor-avatar">
                                {doctor.photo ? (
                                    <img src={doctor.photo} alt={doctor.name} />
                                ) : (
                                    <Stethoscope size={24} />
                                )}
                                <span className={`status-dot ${doctor.availability === 'Available' ? 'available' : 'busy'}`}></span>
                            </div>
                            <div className="doctor-info">
                                <h3>{doctor.name}</h3>
                                <p className="specialization">{doctor.specialization}</p>
                                <p className="qualification">{doctor.qualification}</p>
                                <p className="fee">₹{doctor.fee} consultation</p>
                            </div>
                            <button className="book-consultation-btn">
                                Book Consultation
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Continue with remaining sections...
const FacilitiesSection = ({ hospital }) => (
    <section className="facilities-section">
        <div className="section-container">
            <h2 className="section-title">Facilities & Infrastructure</h2>

            <div className="bed-stats">
                <div className="stat-card">
                    <Activity size={24} />
                    <div className="stat-content">
                        <span className="stat-value">{hospital.bedsGeneral || 0}</span>
                        <span className="stat-label">General Beds</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Heart size={24} />
                    <div className="stat-content">
                        <span className="stat-value">{hospital.bedsICU || 0}</span>
                        <span className="stat-label">ICU Beds</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Activity size={24} />
                    <div className="stat-content">
                        <span className="stat-value">{hospital.bedsOxygen || 0}</span>
                        <span className="stat-label">Oxygen Beds</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Activity size={24} />
                    <div className="stat-content">
                        <span className="stat-value">{hospital.criticalCare?.ventilators || 0}</span>
                        <span className="stat-label">Ventilators</span>
                    </div>
                </div>
            </div>

            <div className="facility-gallery">
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <Activity size={48} />
                    </div>
                    <p>ICU Setup</p>
                </div>
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <Activity size={48} />
                    </div>
                    <p>Operation Theatre</p>
                </div>
                <div className="gallery-item">
                    <div className="gallery-placeholder">
                        <Ambulance size={48} />
                    </div>
                    <p>Emergency Ward</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingSection = () => (
    <section className="pricing-section">
        <div className="section-container">
            <h2 className="section-title">Transparent Pricing</h2>
            <p className="section-subtitle">Estimated costs for common procedures</p>

            <div className="pricing-table-container">
                <table className="pricing-table">
                    <thead>
                        <tr>
                            <th>Procedure</th>
                            <th>Estimated Cost</th>
                            <th>Payment Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockProcedures.map((proc, i) => (
                            <tr key={i}>
                                <td>{proc.name}</td>
                                <td>
                                    {proc.range}
                                    <span className="price-note" title="Prices may vary based on complexity">ⓘ</span>
                                </td>
                                <td>{proc.payment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

const mockProcedures = [
    { name: 'General Consultation', range: '₹500 - ₹1,000', payment: 'Cash/Card/UPI' },
    { name: 'Blood Test (Complete)', range: '₹800 - ₹1,500', payment: 'Cash/Card/Insurance' },
    { name: 'X-Ray', range: '₹400 - ₹800', payment: 'Cash/Card/Insurance' },
    { name: 'ECG', range: '₹300 - ₹600', payment: 'Cash/Card/Insurance' },
    { name: 'Ultrasound', range: '₹1,000 - ₹2,500', payment: 'Cash/Card/Insurance' },
];

const EmergencyCapabilitySection = () => (
    <section className="emergency-section">
        <div className="section-container">
            <h2 className="section-title">Emergency Capabilities</h2>

            <div className="emergency-grid">
                <div className="emergency-card">
                    <Shield size={32} className="emergency-icon" />
                    <h3>24/7 Surgery</h3>
                    <p>Round-the-clock surgical facilities</p>
                </div>
                <div className="emergency-card">
                    <Heart size={32} className="emergency-icon" />
                    <h3>Trauma Center</h3>
                    <p>Level 1 trauma care available</p>
                </div>
                <div className="emergency-card">
                    <Ambulance size={32} className="emergency-icon" />
                    <h3>Ambulance Fleet</h3>
                    <p>5 ambulances ready 24/7</p>
                </div>
                <div className="emergency-card">
                    <Clock size={32} className="emergency-icon" />
                    <h3>Response Time</h3>
                    <p>Average: 8 minutes</p>
                </div>
            </div>
        </div>
    </section>
);

const AppointmentBookingSection = ({ selectedDate, setSelectedDate }) => (
    <section className="appointment-section">
        <div className="section-container">
            <h2 className="section-title">Book an Appointment</h2>

            <div className="calendar-placeholder">
                <Calendar size={48} />
                <p>Interactive calendar coming soon</p>
                <button className="book-appointment-cta">Book Appointment</button>
            </div>
        </div>
    </section>
);

const PreRegistrationSection = ({ isOpen, setIsOpen }) => (
    <section className="prereg-section">
        <div className="section-container">
            <div className="prereg-header" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="section-title">Emergency Pre-Registration</h2>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>

            {isOpen && (
                <div className="prereg-form">
                    <input type="text" placeholder="Blood Type" className="form-input" />
                    <input type="text" placeholder="Known Allergies" className="form-input" />
                    <input type="text" placeholder="Emergency Contact" className="form-input" />
                    <button className="save-profile-btn">Save Profile</button>
                </div>
            )}
        </div>
    </section>
);

const InsurancePaymentSection = () => (
    <section className="insurance-section">
        <div className="section-container">
            <h2 className="section-title">Insurance & Payment Options</h2>

            <div className="insurance-grid">
                <div className="insurance-logos">
                    <span className="insurance-badge">ICICI Lombard</span>
                    <span className="insurance-badge">Apollo Munich</span>
                    <span className="insurance-badge">Aditya Birla</span>
                    <span className="cashless-badge">Cashless Available</span>
                </div>
                <div className="payment-options">
                    <CreditCard size={24} />
                    <span>EMI Options Available</span>
                </div>
            </div>
        </div>
    </section>
);

const TestimonialsSection = () => (
    <section className="testimonials-section">
        <div className="section-container">
            <h2 className="section-title">Patient Testimonials</h2>

            <div className="testimonials-grid">
                {mockTestimonials.map((test, i) => (
                    <div key={i} className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="patient-avatar">
                                {test.name.charAt(0)}
                            </div>
                            <div className="patient-info">
                                <h4>{test.name}</h4>
                                <p className="condition">{test.condition}</p>
                                <div className="stars-small">
                                    {[...Array(test.rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                                    ))}
                                </div>
                            </div>
                            <Video size={24} className="video-icon" />
                        </div>
                        <p className="testimonial-text">{test.review}</p>
                        <button className="read-more-btn">Read More</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const mockTestimonials = [
    {
        name: 'Ramesh Gupta',
        condition: 'Cardiac Surgery',
        rating: 5,
        review: 'Excellent care and professional staff. The doctors were very attentive and the facilities were top-notch...'
    },
    {
        name: 'Sunita Devi',
        condition: 'Orthopedic Treatment',
        rating: 5,
        review: 'I had a wonderful experience. The treatment was effective and the staff was very caring...'
    },
    {
        name: 'Vikram Singh',
        condition: 'Emergency Care',
        rating: 4,
        review: 'Quick response and efficient emergency services. Saved my life during a critical situation...'
    }
];

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="loading-skeleton">
        <div className="skeleton-hero"></div>
        <div className="skeleton-section"></div>
        <div className="skeleton-section"></div>
    </div>
);

export default HospitalDetailsPage;
