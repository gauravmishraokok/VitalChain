import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuditPortal from './pages/AuditPortal';
import ArchitectureAnimation from './pages/ArchitectureAnimation';
import Navigation from './components/shared/Navigation';
import './styles/globals.css';
import './styles/animations.css';

import { SocketProvider } from './context/SocketContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <SocketProvider>
      <Router>
        <div className="bg-bg-deep min-h-screen text-white">
          {isAuthenticated && <Navigation onLogout={handleLogout} />}
          
          <main className={isAuthenticated ? 'pl-24' : ''}>
            <Routes>
              <Route 
                path="/login" 
                element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/audit" 
                element={isAuthenticated ? <AuditPortal /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/animation" 
                element={isAuthenticated ? <ArchitectureAnimation /> : <Navigate to="/login" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SocketProvider>
  );
};

export default App;
