import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, Hospital } from 'lucide-react';

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hospital } = location.state || {};

    const [formData, setFormData] = useState({
        patientName: '',
        patientPhone: '',
        condition: '',
        severity: 'MODERATE' // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hospital) {
            navigate('/patient');
        }
    }, [hospital, navigate]);

    if (!hospital) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hospitalId: hospital.id,
                    ...formData
                })
            });

            if (!response.ok) throw new Error('Booking failed');
            const data = await response.json();

            // Navigate to success page
            navigate('/booking/success', { state: { booking: data.booking, hospital: hospital } });
        } catch (err) {
            console.error(err);
            setError("Failed to confirm booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/patient')}
                    className="flex items-center text-stone-500 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-stone-100">
                    {/* Header */}
                    <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                                <Hospital size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-stone-900">Notify Hospital</h2>
                        </div>
                        <p className="text-stone-500 text-sm">
                            You are notifying <span className="font-semibold text-stone-700">{hospital.name}</span>. They will prepare for your arrival.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-stone-700">
                                Patient Name
                            </label>
                            <Input
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                placeholder="Full name"
                                className="w-full border-stone-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-stone-700">
                                Phone Number
                            </label>
                            <Input
                                name="patientPhone"
                                value={formData.patientPhone}
                                onChange={handleChange}
                                required
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                                className="w-full border-stone-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-stone-700">
                                Condition
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-lg border border-stone-200 bg-white text-stone-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm py-2.5 pl-3 pr-10 appearance-none transition-all"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select condition</option>
                                    <option value="Cardiac">Cardiac (Chest Pain)</option>
                                    <option value="Accident">Accident / Trauma</option>
                                    <option value="Breathlessness">Breathlessness</option>
                                    <option value="Pregnancy">Pregnancy</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-stone-700">
                                Severity
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full rounded-lg border border-stone-200 bg-white text-stone-900 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:text-sm py-2.5 pl-3 pr-10 appearance-none transition-all"
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MODERATE">Moderate</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white border-none shadow-md shadow-primary-900/10 py-3 text-base"
                                isLoading={loading}
                            >
                                {loading ? 'Confirming...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
