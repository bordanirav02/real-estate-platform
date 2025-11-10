import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ChatBot from './components/ChatBot';

// Customer pages
import Home from './pages/customer/Home';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Dashboard from './pages/customer/Dashboard';
import PropertyDetail from './pages/customer/PropertyDetail';
import Cart from './pages/customer/Cart';
import AllProperties from './pages/customer/AllProperties';

// Agent pages
import AgentHome from './pages/agent/AgentHome';
import AgentDashboard from './pages/agent/AgentDashboard';
import AddProperty from './pages/agent/AddProperty';
import ManageProperties from './pages/agent/ManageProperties';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveProperties from './pages/admin/ApproveProperties';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Smart Home Route - Shows different homepage based on role
function SmartHome() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  // Redirect based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'agent') {
    return <AgentHome />;
  }

  // Customer sees normal homepage
  return <Home />;
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Smart Home Route */}
          <Route path="/" element={<SmartHome />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/home"
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin']}>
                <AgentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin']}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/add-property"
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin']}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/properties"
            element={
              <ProtectedRoute allowedRoles={['agent', 'admin']}>
                <ManageProperties />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ApproveProperties />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global ChatBot - Only for customers and agents */}
        <ChatBot />
      </AuthProvider>
    </Router>
  );
}

export default App;