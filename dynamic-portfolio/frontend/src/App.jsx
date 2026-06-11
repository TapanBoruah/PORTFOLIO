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
          <Route path="/" element={<PortfolioHome />} />
                
          <Route path="/admin" element={<AdminDashboard />} />
    
          <Route path="*" element={<PortfolioHome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
