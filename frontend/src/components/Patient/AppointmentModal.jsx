import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose, hospital }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Details, 4: Success
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [formData, setFormData] = useState({
        patientName: user?.fullName || '',
        phone: user?.phone || '',
        department: '',
        doctor: ''
    });

    if (!isOpen || !hospital) return null;

    // Calendar Logic
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        setSelectedDate(newDate);
        setStep(2);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedDate);
        const firstDay = getFirstDayOfMonth(selectedDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = i === selectedDate.getDate();
            const isToday = i === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth();
            days.push(
                <div
                    key={i}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(i)}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    const handleSubmit = async () => {
        try {
            // Combine date and time
            const [time, period] = selectedTime.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            const appointmentDateTime = new Date(selectedDate);
            appointmentDateTime.setHours(hour, parseInt(minutes), 0);

            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

            const response = await fetch(`${apiUrl}/api/patient/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hospitalId: hospital.id,
                    patientName: formData.patientName,
                    patientPhone: formData.phone,
                    condition: `Appointment: ${formData.department}`,
                    severity: 'LOW',
                    source: 'CALENDAR',
                    status: 'SCHEDULED',
                    appointmentTime: appointmentDateTime.toISOString(),
                    userId: user?.id
                }),
            });

            if (response.ok) {
                setStep(4);
            } else {
                console.error('Failed to book appointment');
                alert('Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container appointment-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                {step < 4 && (
                    <div className="modal-header">
                        <h2>Book Appointment</h2>
                        <p className="modal-subtitle">at {hospital.name}</p>
                    </div>
                )}

                <div className="modal-body">
                    {/* Step 1: Date Selection */}
                    {step === 1 && (
                        <div className="step-content animate-fade-in">
                            <div className="calendar-header">
                                <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                                <h3>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
                            </div>
                            <div className="calendar-grid-header">
                                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                            </div>
                            <div className="calendar-grid">
                                {renderCalendar()}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Time Selection */}
                    {step === 2 && (
                        <div className="step-content animate-fade-in">
                            <div className="section-title">
                                <Clock size={18} />
                                <h3>Select Time</h3>
                            </div>
                            <div className="time-slots-grid">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-cancel" onClick={() => setStep(1)}>Back</button>
                                <button
                                    className="btn btn-confirm"
                                    disabled={!selectedTime}
                                    onClick={() => setStep(3)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <div className="step-content animate-fade-in">
                            <div className="form-group">
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.patientName}
                                    onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    className="form-select"
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {hospital.specializations?.map((spec, idx) => (
                                        <option key={idx} value={spec.department}>{spec.department}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-cancel" onClick={() => setStep(2)}>Back</button>
                                <button
                                    className="btn btn-confirm"
                                    disabled={!formData.patientName || !formData.phone || !formData.department}
                                    onClick={handleSubmit}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="step-content success-step animate-fade-in">
                            <div className="success-icon">
                                <CheckCircle size={64} color="#10b981" />
                            </div>
                            <h3>Appointment Confirmed!</h3>
                            <p>Your appointment with <strong>{hospital.name}</strong> is confirmed.</p>
                            <div className="appointment-summary">
                                <div className="summary-item">
                                    <Calendar size={16} />
                                    <span>{selectedDate.toLocaleDateString()}</span>
                                </div>
                                <div className="summary-item">
                                    <Clock size={16} />
                                    <span>{selectedTime}</span>
                                </div>
                                <div className="summary-item">
                                    <User size={16} />
                                    <span>{formData.patientName}</span>
                                </div>
                            </div>
                            <button className="btn btn-confirm full-width" onClick={onClose}>
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
