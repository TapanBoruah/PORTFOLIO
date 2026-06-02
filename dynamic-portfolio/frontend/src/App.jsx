import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PortfolioHome from './pages/PortfolioHome';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Portfolio Home Page */}
          <Route path="/" element={<PortfolioHome />} />
          
          {/* Secure Admin Control Dashboard (Handles its own built-in login) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback Catch-All Redirect to Home */}
          <Route path="*" element={<PortfolioHome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
