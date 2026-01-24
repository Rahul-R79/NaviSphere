import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import MapPage from './Pages/MapPage';
import MapBuilder from './Pages/MapBuilder';
import MapNavigator from './Pages/MapNavigator';
import AdminLogin from './Pages/AdminLogin';
import InstallPWA from './Components/InstallPWA';

// Simple Protected Route Wrapper
const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};

export default function MainApp() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 h-[calc(100vh)]">
        <Routes>
          <Route path="/" element={
            <div className="h-full overflow-y-auto">
              <HomePage />
              <Footer />
            </div>
          } />
          <Route path="/map" element={<MapPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/builder" element={
            <ProtectedAdminRoute>
              <MapBuilder />
            </ProtectedAdminRoute>
          } />

          <Route path="/navigate" element={<MapNavigator />} />
        </Routes>
      </div>

      {/* PWA Install Prompt */}
      <InstallPWA />
    </Router>
  );
}
