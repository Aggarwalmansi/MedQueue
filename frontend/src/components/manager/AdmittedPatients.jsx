import React, { useState, useEffect } from 'react';

const AdmittedPatients = ({ hospital, token }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
                // We need a new endpoint or filter for ADMITTED bookings.
                // For now, let's reuse the bookings endpoint but filter client-side or update endpoint.
                // Ideally, we should update the backend to allow status filtering.
                // Let's try fetching all bookings for this hospital and filtering.
                // Since the current GET /bookings filters for INCOMING, we need to update backend or add a query param.
                // Let's assume we update the backend to accept a status query param.

                const response = await fetch(`${apiUrl}/api/hospital/bookings?status=ADMITTED`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token]);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f4f7f6', minHeight: 'calc(100vh - 80px)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#262626', marginBottom: '24px' }}>
                📂 Admitted History
            </h2>

            {loading ? (
                <p>Loading history...</p>
            ) : patients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c', backgroundColor: '#fff', borderRadius: '12px' }}>
                    No admitted patients yet.
                </div>
            ) : (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                            <tr>
                                <th style={thStyle}>Patient Name</th>
                                <th style={thStyle}>Condition</th>
                                <th style={thStyle}>Phone</th>
                                <th style={thStyle}>Admitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '600', color: '#262626' }}>{p.patientName}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            backgroundColor: '#f6ffed',
                                            color: '#389e0d',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}>
                                            {p.condition}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{p.patientPhone || 'N/A'}</td>
                                    <td style={tdStyle}>{new Date(p.updatedAt || p.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const thStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#595959'
};

const tdStyle = {
    padding: '16px',
    fontSize: '0.95rem',
    color: '#595959'
};

export default AdmittedPatients;
