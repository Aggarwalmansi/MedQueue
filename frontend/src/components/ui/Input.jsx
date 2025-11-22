import React from 'react';

const Input = ({ className = '', icon: Icon, ...props }) => {
    const containerStyle = {
        position: 'relative',
        width: '100%'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        paddingLeft: Icon ? '2.5rem' : '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--stone-200)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit'
    };

    const iconStyle = {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--stone-400)',
        pointerEvents: 'none'
    };

    return (
        <div style={containerStyle} className={className}>
            {Icon && (
                <div style={iconStyle}>
                    <Icon size={18} />
                </div>
            )}
            <input
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--stone-200)'}
                {...props}
            />
        </div>
    );
};

export default Input;
