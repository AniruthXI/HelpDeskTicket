// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Settings, 
  LogOut,
  LineChart,  // เพิ่ม
  Users      // เพิ่ม
} from 'lucide-react';

// ส่วนที่เหลือคงเดิม
export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'TicketForm', href: '/', icon: Home },
    { name: 'Settings', href: '/profile', icon: Settings },
    { 
      name: 'Admin Dashboard', 
      href: '/admin/dashboard', 
      icon: LineChart,
      show: user.role === 'admin' 
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      show: user.role === 'admin' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-blue-600 mr-2">⚡</span>
                <span className="text-xl font-semibold text-blue-600">Helpdesk</span>
              </div>
              <div className="ml-10 flex items-center space-x-4">
                {navigation.map((item) => (
                  // เพิ่มเงื่อนไขการแสดงเมนู
                  (!item.show || item.show) && (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-1.5" />
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Right side - ส่วนนี้คงเดิม */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};