import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSimple from './components/Auth/LoginSimple';
import './App.css';
import './styles/global.css';

function AppSimple() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginSimple />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppSimple;

