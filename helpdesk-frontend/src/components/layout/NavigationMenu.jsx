// src/components/layout/NavigationMenu.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Home,
    Ticket,
    Users,
    Settings,
    LogOut
} from 'lucide-react';

export const NavigationMenu = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/',
            icon: Home,
            show: true
        },
        {
            name: 'Tickets',
            path: '/tickets',
            icon: Ticket,
            show: true
        },
        {
            name: 'User Management',
            path: '/admin/users',
            icon: Users,
            show: user?.role === 'admin'
        },
        {
            name: 'Settings',
            path: '/settings',
            icon: Settings,
            show: true
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Ticket className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold">Helpdesk</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {menuItems.map(item => item.show && (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`${isActive(item.path)
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 relative">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                            {user?.username?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.username}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center text-red-600 hover:text-red-700"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};