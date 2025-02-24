// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
} from 'recharts';
import {
    Ticket, Users, AlertTriangle, CheckCircle,
    Clock, AlertCircle, XCircle
} from 'lucide-react';
import { adminService, ticketService } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="p-6">
        <div className="flex items-center">
            <div className={`rounded-full p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    </Card>
);

export function AdminDashboard() {
    const [stats, setStats] = useState({
        stats: {  // เพิ่ม nested stats object
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
            urgent: 0
        },
        trend: []  // เพิ่ม trend array
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await adminService.getStats();
                console.log('Dashboard stats response:', response); // เพิ่ม log
                setStats(response || { stats: {}, trend: [] });
            } catch (err) {
                console.error('Dashboard error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tickets"
                    value={stats?.stats?.total || 0}  // เพิ่ม optional chaining
                    icon={Ticket}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending"
                    value={stats?.stats?.pending || 0}
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={AlertCircle}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Resolved"
                    value={stats.resolved}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Ticket Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="tickets"
                                stroke="#3B82F6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Status Distribution */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { name: 'Pending', value: stats?.stats?.pending || 0, color: '#EAB308' },
                            { name: 'In Progress', value: stats?.stats?.inProgress || 0, color: '#9333EA' },
                            { name: 'Resolved', value: stats?.stats?.resolved || 0, color: '#22C55E' },
                            { name: 'Closed', value: stats?.stats?.closed || 0, color: '#64748B' }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Urgent Tickets</h3>
                            <p className="text-3xl font-bold text-red-600 mt-2">{stats?.stats?.urgent || 0}</p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Average Response Time</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {stats?.stats?.avgResponseTime || '0'} hrs
                            </p>
                        </div>
                        <Clock className="h-12 w-12 text-blue-600" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Resolution Rate</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {stats?.stats?.resolutionRate || '0'}%
                            </p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;