import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SihDemoModal from './components/SihDemoModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import FarmerDashboard from './pages/FarmerDashboard';
import FpoDashboard from './pages/FpoDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ImpactIntelligencePage from './pages/ImpactIntelligencePage';

function App() {
  const [sihModalOpen, setSihModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans">
      <Navbar onOpenDemoModal={() => setSihModalOpen(true)} />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage onOpenDemoModal={() => setSihModalOpen(true)} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/impact" element={<ImpactIntelligencePage />} />

          {/* Protected Role Dashboards */}
          <Route
            path="/dashboard/farmer"
            element={
              <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fpo"
            element={
              <ProtectedRoute allowedRoles={['FPO', 'ADMIN']}>
                <FpoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/buyer"
            element={
              <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/logistics"
            element={
              <ProtectedRoute allowedRoles={['LOGISTICS', 'ADMIN']}>
                <LogisticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Global SIH Demo Mode Presentation Modal */}
      <SihDemoModal isOpen={sihModalOpen} onClose={() => setSihModalOpen(false)} />
    </div>
  );
}

export default App;
