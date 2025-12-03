import React, { useState } from 'react';
import { FileText, Upload, Calendar, Download, Eye, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import '../styles/MedicalRecords.css';

const MedicalRecords = () => {
    const [activeTab, setActiveTab] = useState('prescriptions');
    const [records, setRecords] = useState([
        {
            id: 1,
            type: 'prescription',
            title: 'Cardiology Consultation',
            doctor: 'Dr. Sharma',
            hospital: 'City General Hospital',
            date: '2023-11-15',
            fileUrl: '#'
        },
        {
            id: 2,
            type: 'report',
            title: 'Blood Test Report (CBC)',
            doctor: 'Lab Technician',
            hospital: 'City General Hospital',
            date: '2023-11-10',
            fileUrl: '#'
        },
        {
            id: 3,
            type: 'bill',
            title: 'Inpatient Bill - #INV-2023-001',
            doctor: '-',
            hospital: 'City General Hospital',
            date: '2023-10-25',
            fileUrl: '#'
        }
    ]);

    const handleUpload = () => {
        // Placeholder for upload functionality
        alert("Upload functionality coming soon!");
    };

    const filteredRecords = records.filter(record => {
        if (activeTab === 'all') return true;
        if (activeTab === 'prescriptions') return record.type === 'prescription';
        if (activeTab === 'reports') return record.type === 'report';
        if (activeTab === 'bills') return record.type === 'bill';
        return true;
    });

    return (
        <div className="medical-records-page">
            <div className="container-max">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Medical Records</h1>
                        <p className="page-subtitle">Manage your health history, prescriptions, and reports.</p>
                    </div>
                    <Button variant="primary" onClick={handleUpload} className="upload-btn">
                        <Upload size={18} />
                        Upload Record
                    </Button>
                </div>

                <div className="records-layout">
                    {/* Sidebar / Tabs */}
                    <div className="records-sidebar">
                        <button
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Records
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prescriptions')}
                        >
                            Prescriptions
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            Lab Reports
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'bills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bills')}
                        >
                            Bills & Invoices
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="records-content">
                        {filteredRecords.length === 0 ? (
                            <div className="empty-records">
                                <FileText size={48} className="empty-icon" />
                                <h3>No records found</h3>
                                <p>You haven't uploaded any {activeTab} yet.</p>
                            </div>
                        ) : (
                            <div className="records-grid">
                                {filteredRecords.map(record => (
                                    <Card key={record.id} className="record-card">
                                        <div className="record-icon-wrapper">
                                            <FileText size={24} />
                                        </div>
                                        <div className="record-info">
                                            <h4 className="record-title">{record.title}</h4>
                                            <div className="record-meta">
                                                <span className="meta-item">
                                                    <Calendar size={12} />
                                                    {record.date}
                                                </span>
                                                <span className="meta-dot">•</span>
                                                <span className="meta-item">{record.hospital}</span>
                                            </div>
                                            <div className="record-doctor">
                                                Prescribed by: {record.doctor}
                                            </div>
                                        </div>
                                        <div className="record-actions">
                                            <button className="icon-btn" title="View">
                                                <Eye size={18} />
                                            </button>
                                            <button className="icon-btn" title="Download">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
