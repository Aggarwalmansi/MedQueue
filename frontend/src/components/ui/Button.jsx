import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    icon: Icon,
    ...props
}) => {

    // Inline styles for dynamic variants to avoid massive CSS files for simple components
    const getVariantStyle = () => {
        switch (variant) {
            case 'primary': return { backgroundColor: 'var(--primary-800)', color: 'white' };
            case 'secondary': return { backgroundColor: 'white', color: 'var(--stone-800)', border: '1px solid var(--stone-200)' };
            case 'accent': return { backgroundColor: 'var(--accent-500)', color: 'white' };
            case 'danger': return { backgroundColor: 'var(--error-500)', color: 'white' };
            case 'ghost': return { backgroundColor: 'transparent', color: 'var(--stone-600)' };
            default: return {};
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm': return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
            case 'lg': return { padding: '1rem 2rem', fontSize: '1.125rem' };
            default: return { padding: '0.75rem 1.5rem', fontSize: '1rem' };
        }
    };

    return (
        <button
            className={`btn ${className}`}
            style={{ ...getVariantStyle(), ...getSizeStyle(), gap: '0.5rem' }}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
            ) : Icon ? (
                <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
