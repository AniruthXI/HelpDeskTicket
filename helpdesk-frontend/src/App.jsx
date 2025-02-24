// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ProfilePage } from './pages/Profile';
import { TicketsPage } from './pages/TicketsPage';
import { Card } from './components/ui/Card';
import { useAuth } from './contexts/AuthContext';
import { Ticket } from 'lucide-react';
import { TicketDetail } from './pages/TicketDetail'
import { AdminDashboard } from './pages/AdminDashboard'
import { NavigationMenu } from './components/layout/NavigationMenu';
import { UserManagement } from './pages/UserManagement';  // เพิ่มบรรทัดนี้

// src/App.jsx
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
    <div className="w-full max-w-[480px]"> {/* ปรับความกว้างให้เหมาะสม */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Ticket className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Helpdesk System
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your support tickets efficiently
        </p>
      </div>

      <Card className="w-full p-8 backdrop-blur-sm bg-white/90 shadow-2xl border border-white/50 rounded-2xl">
        {/* Card Content */}
        <div className="w-full">
          {children}
        </div>
      </Card>

      <p className="text-center mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      <Routes>
      {user ? (
          // Protected Routes
          <Route element={<Layout />}>
            <Route path="/" element={<TicketsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            {/* Admin Routes */}
            {user.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          // Public Routes
          <>
            <Route path="/login" element={
              <AuthLayout>
                <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    {showRegister ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  {showRegister ? (
                    <RegisterForm onSuccess={() => setShowRegister(false)} />
                  ) : (
                    <LoginForm />
                  )}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowRegister(!showRegister)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                  </div>
                </Card>
              </AuthLayout>
            } />
            <Route path="/forgot-password" element={
              <AuthLayout>
                <ForgotPasswordForm />
              </AuthLayout>
            } />
            <Route path="/reset-password/:token" element={
              <AuthLayout>
                <ResetPasswordForm />
              </AuthLayout>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;