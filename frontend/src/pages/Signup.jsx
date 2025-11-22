import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { User, Mail, Phone, MapPin, Lock, Building, ArrowRight, AlertCircle, Activity } from "lucide-react"
import "../styles/Signup.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
    fullName: "",
    phone: "",
    hospitalName: "",
    address: "",
    city: "",
    latitude: "",
    longitude: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validatePassword()) return

    setLoading(true)
    setError("")

    // Clean up data before sending
    const dataToSend = { ...formData }
    delete dataToSend.confirmPassword
    if (dataToSend.role !== 'HOSPITAL') {
      delete dataToSend.hospitalName
      delete dataToSend.address
      delete dataToSend.city
      delete dataToSend.latitude
      delete dataToSend.longitude
    }

    try {
      const result = await signup(dataToSend)
      if (result.success) {
        navigate("/dashboard")
      } else {
        setError(result.error || "Signup failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      {/* Left Side - Brand */}
      <div className="signup-brand-section">
        <div className="brand-bg-pattern"></div>
        <div className="brand-blob blob-top"></div>
        <div className="brand-blob blob-bottom"></div>

        <div className="brand-content">
          <div className="brand-logo-container">
            <Activity size={40} className="text-white" />
          </div>
          <h1 className="brand-title">Join MedQueue</h1>
          <p className="brand-subtitle">
            Connect with emergency care instantly. Every second counts when saving a life.
          </p>

          <div className="signup-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">1</div>
              <div className="benefit-text">Real-time bed availability</div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">2</div>
              <div className="benefit-text">Direct hospital coordination</div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">3</div>
              <div className="benefit-text">Secure medical data</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="signup-form-section animate-fade-in">
        <div className="signup-form-container">
          <div className="form-header">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join us in just a few steps</p>
          </div>

          {error && (
            <div className="error-alert animate-fade-in">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'PATIENT' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'PATIENT' })}
                >
                  Patient
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'HOSPITAL' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'HOSPITAL' })}
                >
                  Hospital
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  icon={User}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  icon={Phone}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                icon={Mail}
              />
            </div>

            {formData.role === 'HOSPITAL' && (
              <div className="hospital-fields animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    placeholder="General Hospital"
                    required
                    icon={Building}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Medical Dr"
                    icon={MapPin}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="40.7128"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="-74.0060"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  icon={Lock}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  icon={Lock}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full shadow-lg"
              isLoading={loading}
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <p className="signup-prompt">
            Already have an account?{" "}
            <Link to="/login" className="signup-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
