import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'success': return { backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' };
            case 'warning': return { backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)', border: '1px solid var(--accent-100)' };
            case 'error': return { backgroundColor: 'var(--error-50)', color: 'var(--error-600)', border: '1px solid var(--error-100)' };
            case 'info': return { backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-600)', border: '1px solid var(--secondary-100)' };
            default: return { backgroundColor: 'var(--stone-100)', color: 'var(--stone-600)', border: '1px solid var(--stone-200)' };
        }
    };

    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '600',
        gap: '0.25rem',
        ...getVariantStyle()
    };

    return (
        <span style={style} className={className}>
            {children}
        </span>
    );
};

export default Badge;
