import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Unauthorized from "./pages/Unauthorised"
import HomePage from "./pages/HomePage"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"
import OAuthCallback from "./pages/OAuthCallback"
import BookingSuccess from "./pages/BookingSuccess"
import BookingForm from "./pages/BookingForm"

import PatientDashboard from "./pages/PatientDashboard"
import HospitalDetailPage from "./pages/HospitalDetailPage"
import HospitalDetailsPage from "./pages/HospitalDetailsPage"
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Header from "./components/Header"
import MyBookings from "./pages/MyBookings"
import HospitalSignup from "./pages/HospitalSignup";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import DataSecurity from "./pages/DataSecurity";
import MedicalRecords from "./pages/MedicalRecords";

import ScrollToTop from "./components/ScrollToTop";
import EmergencyButton from "./components/EmergencyAssessment/EmergencyButton";
import EmergencyModal from "./components/EmergencyAssessment/EmergencyModal";
import { useState } from "react";

function App() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'admin']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/booking/new" element={<BookingForm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/hospital/:id"
                element={
                  <>
                    <HospitalDetailPage />
                  </>
                }
              />

              <Route
                path="/hospital/:id/details"
                element={
                  <>
                    <HospitalDetailsPage />
                  </>
                }
              />

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'admin']}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical-records"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'admin']}>
                    <MedicalRecords />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="/hospital-signup" element={<HospitalSignup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/security" element={<DataSecurity />} />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          <Footer />
          <EmergencyButton onClick={() => setIsEmergencyModalOpen(true)} />
          <EmergencyModal
            isOpen={isEmergencyModalOpen}
            onClose={() => setIsEmergencyModalOpen(false)}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
