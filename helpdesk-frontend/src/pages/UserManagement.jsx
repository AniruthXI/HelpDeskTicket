// src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, User, Shield, Ban, CheckCircle } from 'lucide-react';
import { adminService } from '../services/api';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, suspended

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log('Current users state:', users);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUsers();
            console.log('Raw API response:', response); // เพิ่ม log ตรงนี้
            
            if (response && response.data) {
                setUsers(response.data);
            } else {
                console.error('Invalid response structure:', response);
                setUsers([]);
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusChange = async (userId, isActive) => {
        try {
            await adminService.updateUserStatus(userId, isActive);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isActive } : user
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredUsers = users?.filter(user => {
        console.log('Filtering user:', user); // Debug log
        const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    }) || [];

    console.log('Filtered users:', filteredUsers); // Debug log

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-3"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left py-4 px-6">User</th>
                                <th className="text-left py-4 px-6">Email</th>
                                <th className="text-left py-4 px-6">Role</th>
                                <th className="text-left py-4 px-6">Status</th>
                                <th className="text-left py-4 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="ml-3 font-medium">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="border border-gray-300 rounded-md py-1 px-2"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-3">
                                            <Button
                                                onClick={() => handleStatusChange(user._id, !user.isActive)}
                                                className={`flex items-center ${user.isActive
                                                    ? 'text-red-600 hover:text-red-700'
                                                    : 'text-green-600 hover:text-green-700'
                                                    }`}
                                            >
                                                {user.isActive ? (
                                                    <Ban className="h-4 w-4 mr-1" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                )}
                                                {user.isActive ? 'Suspend' : 'Activate'}
                                            </Button>
                                            <Button
                                                onClick={() => window.location.href = `/admin/users/${user._id}`}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;