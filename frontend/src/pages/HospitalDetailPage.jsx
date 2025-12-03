import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Activity, Clock } from 'lucide-react';
import SpecializationBadge from '../components/ui/SpecializationBadge';
import FacilityCard from '../components/ui/FacilityCard';
import BloodStockGrid from '../components/ui/BloodStockGrid';
import '../styles/HospitalDetailPage.css';

const HospitalDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [facilities, setFacilities] = useState(null);
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

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
            setFacilities(data.facilities);
            setProfileCompleteness(data.profileCompleteness);
        } catch (error) {
            console.error('Error fetching hospital details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="hospital-detail-page">
                <div className="loading-container">
                    <div className="loading-spinner">Loading hospital details...</div>
                </div>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="hospital-detail-page">
                <div className="error-container">
                    <p>Hospital not found</p>
                    <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
                </div>
            </div>
        );
    }

    const averageRating = hospital.ratings?.length > 0
        ? (hospital.ratings.reduce((acc, r) => acc + r.value, 0) / hospital.ratings.length).toFixed(1)
        : 'N/A';

    return (
        <div className="hospital-detail-page">
            {/* Main Content Container */}
            <div className="detail-content-wrapper">
                {/* Back Button */}
                <button onClick={() => navigate('/patient')} className="back-button">
                    <ArrowLeft size={18} />
                    Back to Search
                </button>

                {/* Hospital Header Card */}
                <div className="hospital-header-card">
                    <div className="header-row-1">
                        <h1 className="hospital-title">{hospital.name}</h1>
                        <div className="header-badges">
                            <div className="rating-badge">
                                <Star size={16} fill="#facc15" color="#facc15" />
                                <span>{averageRating}</span>
                                <span className="rating-count">({hospital.ratings?.length || 0})</span>
                            </div>
                            {profileCompleteness < 100 && (
                                <div className="completeness-badge">
                                    Profile {profileCompleteness}% Complete
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="header-row-2">
                        <MapPin size={16} />
                        <span>{hospital.address}, {hospital.city}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('facilities')}
                >
                    Facilities
                </button>
                <button
                    className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Services
                </button>
                <button
                    className={`tab-btn ${activeTab === 'accreditations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accreditations')}
                >
                    Accreditations
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <OverviewTab hospital={hospital} facilities={facilities} />
                )}
                {activeTab === 'facilities' && (
                    <FacilitiesTab facilities={facilities} />
                )}
                {activeTab === 'services' && (
                    <ServicesTab services={facilities?.supportServices} />
                )}
                {activeTab === 'accreditations' && (
                    <AccreditationsTab accreditations={facilities?.accreditations} />
                )}
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ hospital, facilities }) => {
    const totalBeds = hospital.bedsGeneral + hospital.bedsICU + hospital.bedsOxygen;
    const specialistCount = facilities?.specializations?.reduce((acc, spec) =>
        acc + (spec.specialists?.length || 0), 0) || 0;
    const equipmentCount = Object.values(facilities?.diagnostics || {}).filter(d => d?.available).length;

    return (
        <div className="overview-tab">
            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-card">
                    <div className="stat-icon">🛏️</div>
                    <div className="stat-content">
                        <div className="stat-value">{totalBeds}</div>
                        <div className="stat-label">Total Beds</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍⚕️</div>
                    <div className="stat-content">
                        <div className="stat-value">{specialistCount}</div>
                        <div className="stat-label">Specialists</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div className="stat-content">
                        <div className="stat-value">{equipmentCount}</div>
                        <div className="stat-label">Equipment</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <div className="stat-value">{facilities?.accreditations?.length || 0}</div>
                        <div className="stat-label">Accreditations</div>
                    </div>
                </div>
            </div>

            {/* Bed Availability */}
            <div className="section">
                <h3 className="section-title">Bed Availability</h3>
                <div className="beds-grid">
                    <div className="bed-card general">
                        <span className="bed-icon">G</span>
                        <div className="bed-info">
                            <div className="bed-label">General</div>
                            <div className="bed-count">{hospital.bedsGeneral}</div>
                        </div>
                    </div>
                    <div className="bed-card icu">
                        <span className="bed-icon">I</span>
                        <div className="bed-info">
                            <div className="bed-label">ICU</div>
                            <div className="bed-count">{hospital.bedsICU}</div>
                        </div>
                    </div>
                    <div className="bed-card oxygen">
                        <span className="bed-icon">O</span>
                        <div className="bed-info">
                            <div className="bed-label">Oxygen</div>
                            <div className="bed-count">{hospital.bedsOxygen}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ER Wait Times */}
            {hospital.erWaitTimes && (
                <div className="section">
                    <h3 className="section-title">
                        <Clock size={20} />
                        ER Wait Times
                    </h3>
                    <div className="er-times-grid">
                        {hospital.erWaitTimes.critical && (
                            <div className="er-time-card">
                                <span className="er-icon">🔴</span>
                                <div className="er-content">
                                    <div className="er-label">Critical</div>
                                    <div className="er-wait">&lt;{hospital.erWaitTimes.critical.avgWaitMinutes}m</div>
                                    <div className="er-queue">{hospital.erWaitTimes.critical.currentQueue} in queue</div>
                                </div>
                            </div>
                        )}
                        {hospital.erWaitTimes.moderate && (
                            <div className="er-time-card">
                                <span className="er-icon">🟡</span>
                                <div className="er-content">
                                    <div className="er-label">Moderate</div>
                                    <div className="er-wait">&lt;{hospital.erWaitTimes.moderate.avgWaitMinutes}m</div>
                                    <div className="er-queue">{hospital.erWaitTimes.moderate.currentQueue} in queue</div>
                                </div>
                            </div>
                        )}
                        {hospital.erWaitTimes.nonUrgent && (
                            <div className="er-time-card">
                                <span className="er-icon">🟢</span>
                                <div className="er-content">
                                    <div className="er-label">Non-urgent</div>
                                    <div className="er-wait">&lt;{hospital.erWaitTimes.nonUrgent.avgWaitMinutes}m</div>
                                    <div className="er-queue">{hospital.erWaitTimes.nonUrgent.currentQueue} in queue</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Facilities Tab Component
const FacilitiesTab = ({ facilities }) => {
    if (!facilities) return <div className="empty-state">No facility information available</div>;

    const hasSpecializations = facilities.specializations?.length > 0;
    const hasDiagnostics = Object.keys(facilities.diagnostics || {}).length > 0;
    const hasCriticalCare = Object.keys(facilities.criticalCare || {}).length > 0;

    if (!hasSpecializations && !hasDiagnostics && !hasCriticalCare) {
        return <div className="empty-state">This hospital hasn't added facility details yet</div>;
    }

    return (
        <div className="facilities-tab">
            {/* Specialization Centers */}
            {hasSpecializations && (
                <div className="section">
                    <h3 className="section-title">Specialization Centers</h3>
                    <div className="specializations-list">
                        {facilities.specializations.map((spec, index) => (
                            <div key={index} className="specialization-card">
                                <div className="spec-header">
                                    <h4 className="spec-department">🫀 {spec.department}</h4>
                                    {spec.level && (
                                        <span className="spec-level">{spec.level}</span>
                                    )}
                                </div>

                                {spec.specialists && spec.specialists.length > 0 && (
                                    <div className="spec-section">
                                        <div className="spec-subtitle">👨‍⚕️ Specialists: {spec.specialists.length} doctors</div>
                                        <ul className="specialists-list">
                                            {spec.specialists.map((doctor, idx) => (
                                                <li key={idx}>
                                                    Dr. {doctor.name} ({doctor.qualification}, {doctor.experience} yrs) - {doctor.availability}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {spec.keyEquipment && spec.keyEquipment.length > 0 && (
                                    <div className="spec-section">
                                        <div className="spec-subtitle">🏥 Key Equipment:</div>
                                        <ul className="equipment-list">
                                            {spec.keyEquipment.map((eq, idx) => (
                                                <li key={idx}>✅ {eq}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {spec.bedsAvailable && (
                                    <div className="spec-beds">
                                        Beds Available: {spec.bedsAvailable}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Diagnostic Equipment */}
            {hasDiagnostics && (
                <div className="section">
                    <h3 className="section-title">Diagnostic Equipment</h3>
                    <div className="diagnostics-grid">
                        {facilities.diagnostics.mri && facilities.diagnostics.mri.available && (
                            <FacilityCard
                                icon="🔬"
                                title="MRI Scanner"
                                specification={facilities.diagnostics.mri.specification}
                                available={facilities.diagnostics.mri.available}
                                waitTime={facilities.diagnostics.mri.avgWaitMinutes}
                                nextSlot={facilities.diagnostics.mri.nextSlot}
                            />
                        )}
                        {facilities.diagnostics.ctScan && facilities.diagnostics.ctScan.available && (
                            <FacilityCard
                                icon="🩻"
                                title="CT Scan"
                                specification={facilities.diagnostics.ctScan.specification}
                                available={facilities.diagnostics.ctScan.available}
                                waitTime={facilities.diagnostics.ctScan.avgWaitMinutes}
                                nextSlot={facilities.diagnostics.ctScan.nextSlot}
                            />
                        )}
                        {facilities.diagnostics.xRay && facilities.diagnostics.xRay.available && (
                            <FacilityCard
                                icon="📷"
                                title="X-Ray"
                                available={facilities.diagnostics.xRay.available}
                                specification={facilities.diagnostics.xRay.timing}
                            />
                        )}
                        {facilities.diagnostics.ultrasound && facilities.diagnostics.ultrasound.available && (
                            <FacilityCard
                                icon="🔊"
                                title="Ultrasound"
                                available={facilities.diagnostics.ultrasound.available}
                                specification={facilities.diagnostics.ultrasound.types?.join(', ')}
                            />
                        )}
                        {/* Custom Diagnostics */}
                        {facilities.diagnostics.custom?.map((item, index) => (
                            <FacilityCard
                                key={`custom-diag-${index}`}
                                icon="🩺"
                                title={item}
                                available={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Critical Care */}
            {hasCriticalCare && (
                <div className="section">
                    <h3 className="section-title">Critical Care Equipment</h3>

                    {(facilities.criticalCare.ventilators || facilities.criticalCare.dialysis) && (
                        <div className="equipment-usage">
                            {facilities.criticalCare.ventilators && (
                                <div className="usage-item">
                                    <div className="usage-label">Ventilators</div>
                                    <div className="usage-bar">
                                        <div
                                            className="usage-fill"
                                            style={{
                                                width: `${(facilities.criticalCare.ventilators.inUse / facilities.criticalCare.ventilators.total) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="usage-text">
                                        {facilities.criticalCare.ventilators.inUse}/{facilities.criticalCare.ventilators.total} in use
                                    </div>
                                </div>
                            )}
                            {facilities.criticalCare.dialysis && (
                                <div className="usage-item">
                                    <div className="usage-label">Dialysis</div>
                                    <div className="usage-bar">
                                        <div
                                            className="usage-fill"
                                            style={{
                                                width: `${(facilities.criticalCare.dialysis.inUse / facilities.criticalCare.dialysis.total) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="usage-text">
                                        {facilities.criticalCare.dialysis.inUse}/{facilities.criticalCare.dialysis.total} in use
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {facilities.criticalCare.bloodBank?.available && (
                        <div className="blood-bank-section">
                            <h4 className="subsection-title">Blood Bank Stocks</h4>
                            <BloodStockGrid stocks={facilities.criticalCare.bloodBank.stocks} />
                        </div>
                    )}

                    {facilities.criticalCare.icuTypes && facilities.criticalCare.icuTypes.length > 0 && (
                        <div className="icu-types">
                            <h4 className="subsection-title">ICU Types</h4>
                            <div className="icu-grid">
                                {facilities.criticalCare.icuTypes.map((icu, idx) => (
                                    <div key={idx} className="icu-card">
                                        <div className="icu-type">{icu.type}</div>
                                        <div className="icu-beds">{icu.beds} beds</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Services Tab Component
const ServicesTab = ({ services }) => {
    if (!services || Object.keys(services).length === 0) {
        return <div className="empty-state">No service information available</div>;
    }

    return (
        <div className="services-tab">
            <div className="services-list">
                {services.pharmacy && services.pharmacy.available && (
                    <div className="service-item">
                        <span className="service-icon">💊</span>
                        <div className="service-content">
                            <div className="service-name">Pharmacy</div>
                            <div className="service-detail">{services.pharmacy.timing || '24/7'}</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {services.cafeteria && services.cafeteria.available && (
                    <div className="service-item">
                        <span className="service-icon">🍽️</span>
                        <div className="service-content">
                            <div className="service-name">Cafeteria</div>
                            <div className="service-detail">{services.cafeteria.timing || 'Available'}</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {services.atm && (
                    <div className="service-item">
                        <span className="service-icon">🏧</span>
                        <div className="service-content">
                            <div className="service-name">ATM</div>
                            <div className="service-detail">Available on premises</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {services.parking && services.parking.available && (
                    <div className="service-item">
                        <span className="service-icon">🅿️</span>
                        <div className="service-content">
                            <div className="service-name">Parking</div>
                            <div className="service-detail">
                                {services.parking.totalSpots ?
                                    `${services.parking.totalSpots - (services.parking.occupiedSpots || 0)} spots available` :
                                    'Available'
                                }
                            </div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {services.prayerRoom && (
                    <div className="service-item">
                        <span className="service-icon">🛕</span>
                        <div className="service-content">
                            <div className="service-name">Prayer Room</div>
                            <div className="service-detail">Available</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {services.wifi && (
                    <div className="service-item">
                        <span className="service-icon">📶</span>
                        <div className="service-content">
                            <div className="service-name">Free Wi-Fi</div>
                            <div className="service-detail">Available</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                )}
                {/* Custom Services */}
                {services.custom?.map((item, index) => (
                    <div key={`custom-svc-${index}`} className="service-item">
                        <span className="service-icon">⭐</span>
                        <div className="service-content">
                            <div className="service-name">{item}</div>
                            <div className="service-detail">Available</div>
                        </div>
                        <span className="service-status">✅</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Accreditations Tab Component
const AccreditationsTab = ({ accreditations }) => {
    if (!accreditations || accreditations.length === 0) {
        return <div className="empty-state">No accreditations added yet</div>;
    }

    return (
        <div className="accreditations-tab">
            <div className="accreditations-grid">
                {accreditations.map((acc, index) => (
                    <div key={index} className="accreditation-card">
                        <div className="acc-badge">🏆</div>
                        <div className="acc-content">
                            <div className="acc-name">{acc.name}</div>
                            {acc.validUntil && (
                                <div className="acc-validity">
                                    Valid until: {new Date(acc.validUntil).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalDetailPage;
