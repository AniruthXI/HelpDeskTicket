// src/components/tickets/TicketAssignment.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { UserPlus, UserMinus, AlertTriangle } from 'lucide-react';

export const TicketAssignment = ({ ticket, onUpdate }) => {
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAvailableUsers();
    }, []);

    const fetchAvailableUsers = async () => {
        try {
            const users = await adminService.getAvailableUsers();
            setAvailableUsers(users);
        } catch (err) {
            setError('Failed to load available users');
        }
    };

    const handleAssign = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const updatedTicket = await adminService.assignTicket(ticket._id, userId);
            onUpdate(updatedTicket);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnassign = async () => {
        try {
            setLoading(true);
            setError(null);
            const updatedTicket = await adminService.unassignTicket(ticket._id);
            onUpdate(updatedTicket);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePriorityChange = async (priority) => {
        try {
            setLoading(true);
            setError(null);
            const updatedTicket = await adminService.updateTicketPriority(ticket._id, priority);
            onUpdate(updatedTicket);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    return (
        <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-900">Assignment Details</h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {/* Priority Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <Select
                        value={ticket.priority}
                        onChange={(e) => handlePriorityChange(e.target.value)}
                        options={priorityOptions}
                        disabled={loading}
                        className="w-full"
                    />
                </div>

                {/* Assignment Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned To
                    </label>
                    <div className="flex space-x-2">
                        {ticket.assignedTo ? (
                            <>
                                <span className="flex-1 py-2 px-3 bg-gray-100 rounded-md">
                                    {ticket.assignedTo.username}
                                </span>
                                <Button
                                    onClick={handleUnassign}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <UserMinus className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Select
                                value=""
                                onChange={(e) => handleAssign(e.target.value)}
                                disabled={loading}
                                className="flex-1"
                            >
                                <option value="">Select user...</option>
                                {availableUsers.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>
                </div>
            </div>

            {ticket.assignedTo && (
                <div className="text-sm text-gray-500">
                    Assigned on: {new Date(ticket.assignedAt).toLocaleString()}
                </div>
            )}
        </div>
    );
};

export default TicketAssignment;