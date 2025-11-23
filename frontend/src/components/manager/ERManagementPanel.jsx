import React, { useState, useEffect } from 'react';
import { Clock, Plus, Minus, Save } from 'lucide-react';
import '../../styles/ERManagementPanel.css';

const ERManagementPanel = ({ hospital, token }) => {
    const [waitTimes, setWaitTimes] = useState({
        critical: { avgWaitMinutes: 15, currentQueue: 0, status: 'Available' },
        moderate: { avgWaitMinutes: 30, currentQueue: 0, status: 'Available' },
        nonUrgent: { avgWaitMinutes: 45, currentQueue: 0, status: 'Available' }
    });
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (hospital) {
            fetchWaitTimes();
            fetchQueue();
        }
    }, [hospital]);

    const fetchWaitTimes = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/hospitals/${hospital.id}/er-wait-times`);
            if (response.ok) {
                const data = await response.json();
                if (data.critical) {
                    setWaitTimes(data);
                }
            }
        } catch (error) {
            console.error('Error fetching wait times:', error);
        }
    };

    const fetchQueue = async () => {
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/hospital/virtual-queue`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setQueue(data);
            }
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    };

    const handleUpdateWaitTimes = async () => {
        setSaving(true);
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
            const response = await fetch(`${apiUrl}/api/hospital/er-wait-times`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(waitTimes)
            });

            if (response.ok) {
                alert('ER wait times updated successfully');
            }
        } catch (error) {
            console.error('Error updating wait times:', error);
            alert('Failed to update wait times');
        } finally {
            setSaving(false);
        }
    };

    const adjustQueue = (severity, delta) => {
        setWaitTimes(prev => ({
            ...prev,
            [severity]: {
                ...prev[severity],
                currentQueue: Math.max(0, prev[severity].currentQueue + delta)
            }
        }));
    };

    const adjustWaitTime = (severity, delta) => {
        setWaitTimes(prev => ({
            ...prev,
            [severity]: {
                ...prev[severity],
                avgWaitMinutes: Math.max(0, prev[severity].avgWaitMinutes + delta)
            }
        }));
    };

    const getStatusColor = (minutes) => {
        if (minutes < 30) return 'green';
        if (minutes < 60) return 'yellow';
        return 'red';
    };

    return (
        <div className="er-management-panel">
            <div className="panel-header">
                <h2><Clock size={24} /> ER Wait Times Management</h2>
                <button onClick={handleUpdateWaitTimes} disabled={saving} className="save-btn">
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="wait-times-grid">
                {/* Critical */}
                <div className={`wait-time-card ${getStatusColor(waitTimes.critical.avgWaitMinutes)}`}>
                    <div className="card-header">
                        <span className="severity-icon">🔴</span>
                        <h3>Critical</h3>
                    </div>
                    <div className="card-body">
                        <div className="metric-group">
                            <label>Avg Wait Time (minutes)</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustWaitTime('critical', -5)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.critical.avgWaitMinutes}</span>
                                <button onClick={() => adjustWaitTime('critical', 5)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="metric-group">
                            <label>Current Queue</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustQueue('critical', -1)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.critical.currentQueue}</span>
                                <button onClick={() => adjustQueue('critical', 1)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moderate */}
                <div className={`wait-time-card ${getStatusColor(waitTimes.moderate.avgWaitMinutes)}`}>
                    <div className="card-header">
                        <span className="severity-icon">🟡</span>
                        <h3>Moderate</h3>
                    </div>
                    <div className="card-body">
                        <div className="metric-group">
                            <label>Avg Wait Time (minutes)</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustWaitTime('moderate', -5)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.moderate.avgWaitMinutes}</span>
                                <button onClick={() => adjustWaitTime('moderate', 5)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="metric-group">
                            <label>Current Queue</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustQueue('moderate', -1)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.moderate.currentQueue}</span>
                                <button onClick={() => adjustQueue('moderate', 1)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Non-Urgent */}
                <div className={`wait-time-card ${getStatusColor(waitTimes.nonUrgent.avgWaitMinutes)}`}>
                    <div className="card-header">
                        <span className="severity-icon">🟢</span>
                        <h3>Non-Urgent</h3>
                    </div>
                    <div className="card-body">
                        <div className="metric-group">
                            <label>Avg Wait Time (minutes)</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustWaitTime('nonUrgent', -5)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.nonUrgent.avgWaitMinutes}</span>
                                <button onClick={() => adjustWaitTime('nonUrgent', 5)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="metric-group">
                            <label>Current Queue</label>
                            <div className="metric-controls">
                                <button onClick={() => adjustQueue('nonUrgent', -1)}>
                                    <Minus size={16} />
                                </button>
                                <span className="metric-value">{waitTimes.nonUrgent.currentQueue}</span>
                                <button onClick={() => adjustQueue('nonUrgent', 1)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Virtual Queue List */}
            <div className="queue-section">
                <h3>Virtual Queue ({queue.length})</h3>
                {queue.length === 0 ? (
                    <p className="empty-queue">No patients in virtual queue</p>
                ) : (
                    <div className="queue-list">
                        {queue.map((entry, index) => (
                            <div key={entry.id} className="queue-entry">
                                <span className="queue-position">#{index + 1}</span>
                                <span className="queue-name">{entry.patientName}</span>
                                <span className={`queue-severity ${entry.severity.toLowerCase()}`}>
                                    {entry.severity}
                                </span>
                                <span className="queue-time">
                                    {new Date(entry.checkInTime).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ERManagementPanel;
