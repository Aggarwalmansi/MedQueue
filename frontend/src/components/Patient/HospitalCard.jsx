import React from 'react';

const HospitalCard = ({ hospital, onNotify }) => {
    const { name, distance, bedsGeneral, bedsICU, bedsOxygen, viabilityScore } = hospital;

    const getBadgeColor = (count) => {
        if (count === 0) return '#ff4d4f'; // Red
        if (count < 5) return '#faad14'; // Orange
        return '#52c41a'; // Green
    };

    const styles = {
        card: {
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid #f0f0f0',
            transition: 'transform 0.2s',
            cursor: 'pointer'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        name: {
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#1f1f1f',
            margin: 0
        },
        distance: {
            fontSize: '0.9rem',
            color: '#8c8c8c',
            fontWeight: '500'
        },
        badges: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
        },
        badge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        button: {
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '8px',
            width: '100%',
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.name}>{name}</h3>
                    <span style={styles.distance}>{distance} km away</span>
                </div>
                {/* Optional: Display Viability Score for debugging or transparency */}
                {/* <div style={{ fontSize: '0.8rem', color: '#ccc' }}>Score: {Math.round(viabilityScore)}</div> */}
            </div>

            <div style={styles.badges}>
                <span style={{ ...styles.badge, backgroundColor: getBadgeColor(bedsICU) }}>
                    ICU: {bedsICU}
                </span>
                <span style={{ ...styles.badge, backgroundColor: getBadgeColor(bedsOxygen) }}>
                    O2: {bedsOxygen}
                </span>
                <span style={{ ...styles.badge, backgroundColor: getBadgeColor(bedsGeneral) }}>
                    Gen: {bedsGeneral}
                </span>
            </div>

            <button style={styles.button} onClick={() => onNotify(hospital)}>
                Notify Hospital
            </button>
        </div>
    );
};

export default HospitalCard;
