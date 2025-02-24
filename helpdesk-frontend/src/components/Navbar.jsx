// src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Helpdesk Ticket System
                    </h1>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                    {user.profileImage ? (
                                        <img
                                            src={`http://localhost:3000/${user.profileImage}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => window.location.href = '/profile'}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {user.username}
                                </button>
                            </div>
                            <button
                                onClick={logout}
                                className="text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};