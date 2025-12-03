import React, { useState, useEffect } from 'react';
import { Plus, Minus, Save, ChevronDown, ChevronUp, X } from 'lucide-react';
import '../../styles/FacilitiesManagement.css';

const FacilitiesManagement = ({ hospital, token }) => {
    const [facilities, setFacilities] = useState({
        specializations: [],
        diagnostics: {
            mri: { available: false },
            ctScan: { available: false },
            xRay: { available: false },
            ultrasound: { available: false },
            custom: []
        },
        criticalCare: {
            ventilators: { total: 0, inUse: 0 },
            dialysis: { total: 0, inUse: 0 },
            bloodBank: { available: false, stocks: {} }
        },
        supportServices: {
            pharmacy: { available: false },
            cafeteria: { available: false },
            atm: false,
            prayerRoom: false,
            wifi: false,
            parking: { available: false },
            custom: []
        },
        accreditations: []
    });
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [saving, setSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        specializations: true,
        diagnostics: false,
        criticalCare: false,
        services: false,
        accreditations: false
    });

    // Local state for custom inputs
    const [customServiceInput, setCustomServiceInput] = useState('');
    const [customDiagnosticInput, setCustomDiagnosticInput] = useState('');
    const [customAccreditationInput, setCustomAccreditationInput] = useState('');

    const PREDEFINED_ACCREDITATIONS = ['NABH', 'NABL', 'JCI', 'ISO 9001', 'AABB'];

    useEffect(() => {
        if (hospital) {
            fetchFacilities();
        }
    }, [hospital]);

    const fetchFacilities = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/patient/hospitals/${hospital.id}/facilities`);
            if (response.ok) {
                const data = await response.json();
                // Ensure custom arrays exist if not present in DB
                const loadedFacilities = {
                    ...data.facilities,
                    diagnostics: { ...data.facilities.diagnostics, custom: data.facilities.diagnostics?.custom || [] },
                    supportServices: { ...data.facilities.supportServices, custom: data.facilities.supportServices?.custom || [] }
                };
                setFacilities(loadedFacilities);
                setProfileCompleteness(data.profileCompleteness);
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/hospital/facilities`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(facilities)
            });

            if (response.ok) {
                const data = await response.json();
                setProfileCompleteness(data.hospital.profileCompleteness);
                alert('Facilities updated successfully!');
            } else {
                throw new Error('Failed to update facilities');
            }
        } catch (error) {
            console.error('Error saving facilities:', error);
            alert('Failed to save facilities. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Specializations handlers
    const addSpecialization = () => {
        setFacilities(prev => ({
            ...prev,
            specializations: [...(prev.specializations || []), {
                department: '',
                level: 'Standard',
                specialists: [],
                keyEquipment: [],
                bedsAvailable: 0
            }]
        }));
    };

    const removeSpecialization = (index) => {
        setFacilities(prev => ({
            ...prev,
            specializations: prev.specializations.filter((_, i) => i !== index)
        }));
    };

    const updateSpecialization = (index, field, value) => {
        setFacilities(prev => ({
            ...prev,
            specializations: prev.specializations.map((spec, i) =>
                i === index ? { ...spec, [field]: value } : spec
            )
        }));
    };

    const addSpecialist = (specIndex) => {
        setFacilities(prev => ({
            ...prev,
            specializations: prev.specializations.map((spec, i) =>
                i === specIndex ? {
                    ...spec,
                    specialists: [...(spec.specialists || []), {
                        name: '',
                        qualification: '',
                        experience: 0,
                        availability: '9 AM - 6 PM'
                    }]
                } : spec
            )
        }));
    };

    const removeSpecialist = (specIndex, doctorIndex) => {
        setFacilities(prev => ({
            ...prev,
            specializations: prev.specializations.map((spec, i) =>
                i === specIndex ? {
                    ...spec,
                    specialists: spec.specialists.filter((_, di) => di !== doctorIndex)
                } : spec
            )
        }));
    };

    const updateSpecialist = (specIndex, doctorIndex, field, value) => {
        setFacilities(prev => ({
            ...prev,
            specializations: prev.specializations.map((spec, i) =>
                i === specIndex ? {
                    ...spec,
                    specialists: spec.specialists.map((doc, di) =>
                        di === doctorIndex ? { ...doc, [field]: value } : doc
                    )
                } : spec
            )
        }));
    };

    // Diagnostics handlers
    const updateDiagnostic = (type, field, value) => {
        setFacilities(prev => ({
            ...prev,
            diagnostics: {
                ...prev.diagnostics,
                [type]: {
                    ...(prev.diagnostics[type] || {}),
                    [field]: value
                }
            }
        }));
    };

    const addCustomDiagnostic = () => {
        if (!customDiagnosticInput.trim()) return;
        setFacilities(prev => ({
            ...prev,
            diagnostics: {
                ...prev.diagnostics,
                custom: [...(prev.diagnostics.custom || []), customDiagnosticInput.trim()]
            }
        }));
        setCustomDiagnosticInput('');
    };

    const removeCustomDiagnostic = (index) => {
        setFacilities(prev => ({
            ...prev,
            diagnostics: {
                ...prev.diagnostics,
                custom: prev.diagnostics.custom.filter((_, i) => i !== index)
            }
        }));
    };

    // Critical Care handlers
    const updateCriticalCare = (field, value) => {
        setFacilities(prev => ({
            ...prev,
            criticalCare: {
                ...prev.criticalCare,
                [field]: value
            }
        }));
    };

    const updateBloodStock = (bloodType, count) => {
        setFacilities(prev => ({
            ...prev,
            criticalCare: {
                ...prev.criticalCare,
                bloodBank: {
                    ...(prev.criticalCare.bloodBank || { available: true }),
                    stocks: {
                        ...(prev.criticalCare.bloodBank?.stocks || {}),
                        [bloodType]: parseInt(count) || 0
                    }
                }
            }
        }));
    };

    // Support Services handlers
    const updateService = (service, field, value) => {
        setFacilities(prev => ({
            ...prev,
            supportServices: {
                ...prev.supportServices,
                [service]: typeof field === 'string' ? {
                    ...(prev.supportServices[service] || {}),
                    [field]: value
                } : value
            }
        }));
    };

    const addCustomService = () => {
        if (!customServiceInput.trim()) return;
        setFacilities(prev => ({
            ...prev,
            supportServices: {
                ...prev.supportServices,
                custom: [...(prev.supportServices.custom || []), customServiceInput.trim()]
            }
        }));
        setCustomServiceInput('');
    };

    const removeCustomService = (index) => {
        setFacilities(prev => ({
            ...prev,
            supportServices: {
                ...prev.supportServices,
                custom: prev.supportServices.custom.filter((_, i) => i !== index)
            }
        }));
    };

    // Accreditations handlers
    const toggleAccreditation = (name, checked) => {
        setFacilities(prev => {
            const currentAccreditations = prev.accreditations || [];
            if (checked) {
                // Add if not exists
                if (!currentAccreditations.some(acc => acc.name === name)) {
                    return {
                        ...prev,
                        accreditations: [...currentAccreditations, { name, validUntil: '' }]
                    };
                }
            } else {
                // Remove
                return {
                    ...prev,
                    accreditations: currentAccreditations.filter(acc => acc.name !== name)
                };
            }
            return prev;
        });
    };

    const addCustomAccreditation = () => {
        if (!customAccreditationInput.trim()) return;
        setFacilities(prev => ({
            ...prev,
            accreditations: [...(prev.accreditations || []), {
                name: customAccreditationInput.trim(),
                validUntil: ''
            }]
        }));
        setCustomAccreditationInput('');
    };

    const removeAccreditation = (name) => {
        setFacilities(prev => ({
            ...prev,
            accreditations: prev.accreditations.filter(acc => acc.name !== name)
        }));
    };

    return (
        <div className="facilities-management">
            <div className="management-header">
                <div>
                    <h2>Manage Hospital Facilities</h2>
                    <p className="header-subtitle">
                        Update your hospital profile to help patients find you
                    </p>
                </div>
                <div className="completeness-indicator">
                    <div className="completeness-label">Profile Completeness</div>
                    <div className="completeness-bar">
                        <div
                            className="completeness-fill"
                            style={{ width: `${profileCompleteness}%` }}
                        ></div>
                    </div>
                    <div className="completeness-value">{profileCompleteness}%</div>
                </div>
            </div>

            {/* Specializations Section */}
            <div className="management-section">
                <div className="section-header" onClick={() => toggleSection('specializations')}>
                    <h3>➕ Specialization Centers</h3>
                    {expandedSections.specializations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedSections.specializations && (
                    <div className="section-content">
                        {facilities.specializations?.map((spec, index) => (
                            <div key={index} className="specialization-form">
                                <div className="form-header">
                                    <h4>Specialization {index + 1}</h4>
                                    <button
                                        onClick={() => removeSpecialization(index)}
                                        className="remove-btn"
                                    >
                                        <X size={16} /> Remove
                                    </button>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select
                                            value={spec.department}
                                            onChange={(e) => updateSpecialization(index, 'department', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Oncology">Oncology</option>
                                            <option value="Gastroenterology">Gastroenterology</option>
                                            <option value="Nephrology">Nephrology</option>
                                            <option value="Pulmonology">Pulmonology</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Level</label>
                                        <select
                                            value={spec.level}
                                            onChange={(e) => updateSpecialization(index, 'level', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="Basic">Basic</option>
                                            <option value="Standard">Standard</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Center of Excellence">Center of Excellence</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Beds Available</label>
                                        <input
                                            type="number"
                                            value={spec.bedsAvailable}
                                            onChange={(e) => updateSpecialization(index, 'bedsAvailable', parseInt(e.target.value) || 0)}
                                            className="form-input"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Specialists */}
                                <div className="subsection">
                                    <div className="subsection-header">
                                        <label>Specialists</label>
                                        <button
                                            onClick={() => addSpecialist(index)}
                                            className="add-btn-small"
                                        >
                                            <Plus size={14} /> Add Specialist
                                        </button>
                                    </div>
                                    {spec.specialists?.map((doctor, dIndex) => (
                                        <div key={dIndex} className="specialist-row">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={doctor.name}
                                                onChange={(e) => updateSpecialist(index, dIndex, 'name', e.target.value)}
                                                className="form-input-small"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Qualification"
                                                value={doctor.qualification}
                                                onChange={(e) => updateSpecialist(index, dIndex, 'qualification', e.target.value)}
                                                className="form-input-small"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Experience (years)"
                                                value={doctor.experience}
                                                onChange={(e) => updateSpecialist(index, dIndex, 'experience', parseInt(e.target.value) || 0)}
                                                className="form-input-small"
                                                min="0"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Availability"
                                                value={doctor.availability}
                                                onChange={(e) => updateSpecialist(index, dIndex, 'availability', e.target.value)}
                                                className="form-input-small"
                                            />
                                            <button
                                                onClick={() => removeSpecialist(index, dIndex)}
                                                className="remove-btn-small"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Key Equipment */}
                                <div className="form-group">
                                    <label>Key Equipment (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={spec.keyEquipment?.join(', ') || ''}
                                        onChange={(e) => updateSpecialization(index, 'keyEquipment', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                        className="form-input"
                                        placeholder="e.g., Cath Lab, ECMO, Cardiac ICU"
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={addSpecialization} className="add-btn">
                            <Plus size={18} /> Add Specialization
                        </button>
                    </div>
                )}
            </div>

            {/* Diagnostic Equipment Section */}
            <div className="management-section">
                <div className="section-header" onClick={() => toggleSection('diagnostics')}>
                    <h3>🔬 Diagnostic Equipment</h3>
                    {expandedSections.diagnostics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedSections.diagnostics && (
                    <div className="section-content">
                        {['mri', 'ctScan', 'xRay', 'ultrasound'].map(type => (
                            <div key={type} className="diagnostic-row" style={{ marginBottom: '1rem' }}>
                                <div className="service-row" style={{ marginBottom: facilities.diagnostics[type]?.available ? '0.5rem' : '0' }}>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={facilities.diagnostics[type]?.available || false}
                                            onChange={(e) => updateDiagnostic(type, 'available', e.target.checked)}
                                        />
                                        {type === 'mri' && 'MRI Scanner'}
                                        {type === 'ctScan' && 'CT Scan'}
                                        {type === 'xRay' && 'X-Ray'}
                                        {type === 'ultrasound' && 'Ultrasound'}
                                    </label>
                                </div>
                                {facilities.diagnostics[type]?.available && (
                                    <div className="diagnostic-details" style={{ paddingLeft: '1.8rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Specification"
                                            value={facilities.diagnostics[type]?.specification || ''}
                                            onChange={(e) => updateDiagnostic(type, 'specification', e.target.value)}
                                            className="form-input-small"
                                            style={{ width: '100%', maxWidth: '300px' }}
                                        />
                                        {(type === 'mri' || type === 'ctScan') && (
                                            <input
                                                type="number"
                                                placeholder="Avg Wait (minutes)"
                                                value={facilities.diagnostics[type]?.avgWaitMinutes || ''}
                                                onChange={(e) => updateDiagnostic(type, 'avgWaitMinutes', parseInt(e.target.value) || 0)}
                                                className="form-input-small"
                                                min="0"
                                                style={{ width: '150px' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Diagnostics */}
                        {facilities.diagnostics.custom?.map((item, index) => (
                            <div key={`custom-diag-${index}`} className="service-row" style={{ justifyContent: 'space-between' }}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        readOnly
                                    />
                                    {item}
                                </label>
                                <button
                                    onClick={() => removeCustomDiagnostic(index)}
                                    className="remove-btn-small"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        <div className="add-custom-item">
                            <input
                                type="text"
                                placeholder="Enter custom equipment"
                                value={customDiagnosticInput}
                                onChange={(e) => setCustomDiagnosticInput(e.target.value)}
                                className="form-input"
                            />
                            <button onClick={addCustomDiagnostic} className="add-btn-small">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Critical Care Section */}
            <div className="management-section">
                <div className="section-header" onClick={() => toggleSection('criticalCare')}>
                    <h3>🏥 Critical Care Equipment</h3>
                    {expandedSections.criticalCare ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedSections.criticalCare && (
                    <div className="section-content">
                        {/* Ventilators */}
                        <div className="equipment-row">
                            <label>Ventilators</label>
                            <div className="equipment-inputs">
                                <input
                                    type="number"
                                    placeholder="Total"
                                    value={facilities.criticalCare.ventilators?.total || ''}
                                    onChange={(e) => updateCriticalCare('ventilators', {
                                        ...(facilities.criticalCare.ventilators || {}),
                                        total: parseInt(e.target.value) || 0
                                    })}
                                    className="form-input-small"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    placeholder="In Use"
                                    value={facilities.criticalCare.ventilators?.inUse || ''}
                                    onChange={(e) => updateCriticalCare('ventilators', {
                                        ...(facilities.criticalCare.ventilators || {}),
                                        inUse: parseInt(e.target.value) || 0
                                    })}
                                    className="form-input-small"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Dialysis */}
                        <div className="equipment-row">
                            <label>Dialysis</label>
                            <div className="equipment-inputs">
                                <input
                                    type="number"
                                    placeholder="Total"
                                    value={facilities.criticalCare.dialysis?.total || ''}
                                    onChange={(e) => updateCriticalCare('dialysis', {
                                        ...(facilities.criticalCare.dialysis || {}),
                                        total: parseInt(e.target.value) || 0
                                    })}
                                    className="form-input-small"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    placeholder="In Use"
                                    value={facilities.criticalCare.dialysis?.inUse || ''}
                                    onChange={(e) => updateCriticalCare('dialysis', {
                                        ...(facilities.criticalCare.dialysis || {}),
                                        inUse: parseInt(e.target.value) || 0
                                    })}
                                    className="form-input-small"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Blood Bank */}
                        <div className="equipment-row" style={{ display: 'block' }}>
                            <label className="checkbox-label" style={{ marginBottom: '1rem', display: 'flex' }}>
                                <input
                                    type="checkbox"
                                    checked={facilities.criticalCare.bloodBank?.available || false}
                                    onChange={(e) => updateCriticalCare('bloodBank', {
                                        ...(facilities.criticalCare.bloodBank || {}),
                                        available: e.target.checked
                                    })}
                                />
                                Blood Bank Available
                            </label>
                            {facilities.criticalCare.bloodBank?.available && (
                                <div className="blood-stock-inputs">
                                    {['APositive', 'ANegative', 'BPositive', 'BNegative', 'OPositive', 'ONegative', 'ABPositive', 'ABNegative'].map(type => (
                                        <div key={type} className="blood-input">
                                            <label>{type.replace('Positive', '+').replace('Negative', '-')}</label>
                                            <input
                                                type="number"
                                                value={facilities.criticalCare.bloodBank?.stocks?.[type] || ''}
                                                onChange={(e) => updateBloodStock(type, e.target.value)}
                                                className="form-input-small"
                                                min="0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Support Services Section */}
            <div className="management-section">
                <div className="section-header" onClick={() => toggleSection('services')}>
                    <h3>🍽️ Support Services</h3>
                    {expandedSections.services ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedSections.services && (
                    <div className="section-content">
                        {/* Pharmacy */}
                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.pharmacy?.available || false}
                                    onChange={(e) => updateService('pharmacy', 'available', e.target.checked)}
                                />
                                Pharmacy
                            </label>
                            {facilities.supportServices.pharmacy?.available && (
                                <input
                                    type="text"
                                    placeholder="Timing (e.g., 24/7)"
                                    value={facilities.supportServices.pharmacy?.timing || ''}
                                    onChange={(e) => updateService('pharmacy', 'timing', e.target.value)}
                                    className="form-input-small"
                                />
                            )}
                        </div>

                        {/* Cafeteria */}
                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.cafeteria?.available || false}
                                    onChange={(e) => updateService('cafeteria', 'available', e.target.checked)}
                                />
                                Cafeteria
                            </label>
                            {facilities.supportServices.cafeteria?.available && (
                                <input
                                    type="text"
                                    placeholder="Timing"
                                    value={facilities.supportServices.cafeteria?.timing || ''}
                                    onChange={(e) => updateService('cafeteria', 'timing', e.target.value)}
                                    className="form-input-small"
                                />
                            )}
                        </div>

                        {/* Simple toggles */}
                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.atm || false}
                                    onChange={(e) => updateService('atm', null, e.target.checked)}
                                />
                                ATM Available
                            </label>
                        </div>

                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.prayerRoom || false}
                                    onChange={(e) => updateService('prayerRoom', null, e.target.checked)}
                                />
                                Prayer Room
                            </label>
                        </div>

                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.wifi || false}
                                    onChange={(e) => updateService('wifi', null, e.target.checked)}
                                />
                                Free Wi-Fi
                            </label>
                        </div>

                        {/* Parking */}
                        <div className="service-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={facilities.supportServices.parking?.available || false}
                                    onChange={(e) => updateService('parking', 'available', e.target.checked)}
                                />
                                Parking
                            </label>
                            {facilities.supportServices.parking?.available && (
                                <input
                                    type="number"
                                    placeholder="Total Spots"
                                    value={facilities.supportServices.parking?.totalSpots || ''}
                                    onChange={(e) => updateService('parking', 'totalSpots', parseInt(e.target.value) || 0)}
                                    className="form-input-small"
                                    min="0"
                                />
                            )}
                        </div>

                        {/* Custom Services */}
                        {facilities.supportServices.custom?.map((item, index) => (
                            <div key={`custom-svc-${index}`} className="service-row" style={{ justifyContent: 'space-between' }}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        readOnly
                                    />
                                    {item}
                                </label>
                                <button
                                    onClick={() => removeCustomService(index)}
                                    className="remove-btn-small"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        <div className="add-custom-item">
                            <input
                                type="text"
                                placeholder="Enter custom service"
                                value={customServiceInput}
                                onChange={(e) => setCustomServiceInput(e.target.value)}
                                className="form-input"
                            />
                            <button onClick={addCustomService} className="add-btn-small">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Accreditations Section */}
            <div className="management-section">
                <div className="section-header" onClick={() => toggleSection('accreditations')}>
                    <h3>🏆 Accreditations</h3>
                    {expandedSections.accreditations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedSections.accreditations && (
                    <div className="section-content">
                        {/* Predefined Accreditations */}
                        <div className="accreditations-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {PREDEFINED_ACCREDITATIONS.map(name => (
                                <label key={name} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={facilities.accreditations?.some(acc => acc.name === name) || false}
                                        onChange={(e) => toggleAccreditation(name, e.target.checked)}
                                    />
                                    {name}
                                </label>
                            ))}
                        </div>

                        {/* Custom Accreditations */}
                        {facilities.accreditations?.filter(acc => !PREDEFINED_ACCREDITATIONS.includes(acc.name)).map((acc, index) => (
                            <div key={index} className="accreditation-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        readOnly
                                    />
                                    {acc.name}
                                </label>
                                <button
                                    onClick={() => removeAccreditation(acc.name)}
                                    className="remove-btn-small"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        <div className="add-custom-item" style={{ marginTop: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Add Custom Accreditation"
                                value={customAccreditationInput}
                                onChange={(e) => setCustomAccreditationInput(e.target.value)}
                                className="form-input"
                            />
                            <button onClick={addCustomAccreditation} className="add-btn-small">
                                <Plus size={14} /> Add Accreditation
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="save-section">
                <button onClick={handleSave} disabled={saving} className="save-btn">
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
};

export default FacilitiesManagement;
