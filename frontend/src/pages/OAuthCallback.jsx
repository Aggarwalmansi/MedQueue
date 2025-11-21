import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');

        if (token) {
            handleGoogleCallback(token, refreshToken).then(() => {
                navigate('/dashboard');
            });
        } else {
            navigate('/login');
        }
    }, [searchParams, handleGoogleCallback, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner"></div>
            <p style={{ marginLeft: '10px' }}>Authenticating...</p>
        </div>
    );
};

export default OAuthCallback;
