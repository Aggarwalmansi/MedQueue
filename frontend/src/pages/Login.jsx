import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, ArrowRight, AlertCircle, Activity } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Brand */}
      <div className="login-brand-section">
        <div className="brand-bg-pattern"></div>
        <div className="brand-blob blob-top"></div>
        <div className="brand-blob blob-bottom"></div>

        <div className="brand-content">
          <div className="brand-logo-container">
            <Activity size={40} className="text-white" />
          </div>
          <h1 className="brand-title">MedQueue</h1>
          <p className="brand-subtitle">
            Real-time hospital bed availability and emergency coordination at your fingertips.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-section animate-fade-in">
        <div className="login-form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="error-alert animate-fade-in">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                icon={Mail}
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" class="forgot-link">
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={Lock}
              />
            </div>

            <Button
              type="submit"
              className="w-full shadow-lg"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or continue with</span>
          </div>

          <div className="social-buttons">
            <Button
              variant="secondary"
              className="justify-center"
              onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/auth/google`}
            >
              Google
            </Button>
          </div>

          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
