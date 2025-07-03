import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyPrepare from './components/WhyPrepare';
import SafetyTips from './components/SafetyTips';
import EmergencyContacts from './components/EmergencyContacts';
import EmergencyQRCode from './components/emergency/EmergencyQRCode';
import QRScanDisplay from './components/emergency/QRScanDisplay';
import EmergencyInfoDisplay from './PagesForWorld/EmergencyInfoDisplay';

function MainContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyPrepare />
      <SafetyTips />
      <section id="emergency-info" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Emergency Information QR Code</h2>
            <p className="mt-4 text-lg text-gray-600">
              Create your emergency QR code containing vital information for first responders and family members (here here).
            </p>
          </div>
          <EmergencyQRCode />
        </div>
      </section>
      <EmergencyContacts />
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 RideGuard Emergency Platform. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Emergency Hotline: 108 | Police: 100 | Fire: 101</p>
        </div>
      </footer>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Check if we're displaying a scanned QR code
  const urlParams = new URLSearchParams(window.location.search);
  const qrData = urlParams.get('qr');
  
  if (qrData) {
    try {
      const emergencyData = JSON.parse(decodeURIComponent(qrData));
      return <QRScanDisplay emergencyData={emergencyData} />;
    } catch (error) {
      console.error('Invalid QR data');
    }
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/emergencyinfo/:firstName" element={<EmergencyInfoDisplay />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;