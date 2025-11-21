import React from 'react';

const TicketView = ({ booking, hospital }) => {
    const { id, patientName, status } = booking;
    const { name, latitude, longitude } = hospital;

    const handleNavigate = () => {
        // Open Google Maps
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    // Generate QR Code URL (using a public API for simplicity)
    const qrData = JSON.stringify({ bookingId: id, patient: patientName, hospital: name });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: '#f6ffed', // Light green bg
            minHeight: '100vh',
            textAlign: 'center'
        },
        card: {
            backgroundColor: '#fff',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            width: '100%',
            maxWidth: '400px',
            marginTop: '40px'
        },
        successIcon: {
            fontSize: '4rem',
            marginBottom: '16px'
        },
        title: {
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#389e0d',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '1rem',
            color: '#595959',
            marginBottom: '24px'
        },
        qrContainer: {
            margin: '24px 0',
            padding: '16px',
            border: '2px dashed #d9d9d9',
            borderRadius: '16px'
        },
        qrImage: {
            width: '100%',
            maxWidth: '200px',
            height: 'auto'
        },
        info: {
            textAlign: 'left',
            width: '100%',
            marginBottom: '24px',
            backgroundColor: '#fafafa',
            padding: '16px',
            borderRadius: '12px'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
        },
        label: {
            color: '#8c8c8c',
            fontSize: '0.9rem'
        },
        value: {
            fontWeight: '600',
            color: '#1f1f1f'
        },
        navButton: {
            width: '100%',
            padding: '16px',
            backgroundColor: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.successIcon}>✅</div>
                <h1 style={styles.title}>Hospital Notified!</h1>
                <p style={styles.subtitle}>They are expecting you, {patientName}.</p>

                <div style={styles.qrContainer}>
                    <img src={qrUrl} alt="Booking QR Code" style={styles.qrImage} />
                    <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#8c8c8c' }}>Show this at reception</p>
                </div>

                <div style={styles.info}>
                    <div style={styles.infoRow}>
                        <span style={styles.label}>Hospital</span>
                        <span style={styles.value}>{name}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.label}>Booking ID</span>
                        <span style={styles.value}>#{id}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.label}>Status</span>
                        <span style={{ ...styles.value, color: '#faad14' }}>{status}</span>
                    </div>
                </div>

                <button style={styles.navButton} onClick={handleNavigate}>
                    📍 Navigate Now
                </button>
            </div>
        </div>
    );
};

export default TicketView;
