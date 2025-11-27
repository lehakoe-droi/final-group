// App.js - Fixed
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import InstituteDashboard from './pages/institute/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={[ 'admin' ]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institute/*"
              element={
                <ProtectedRoute allowedRoles={[ 'institute' ]}>
                  <InstituteDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={[ 'student' ]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/*"
              element={
                <ProtectedRoute allowedRoles={[ 'company' ]}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;