// src/components/tickets/TicketFilters.jsx
import React from 'react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Search, Filter } from 'lucide-react';

export const TicketFilters = ({ filters, onFilterChange }) => {
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const priorityOptions = [
        { value: '', label: 'All Priority' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'technical', label: 'Technical' },
        { value: 'billing', label: 'Billing' },
        { value: 'general', label: 'General' },
        { value: 'feature_request', label: 'Feature Request' }
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search tickets..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <Select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        options={statusOptions}
                        className="min-w-[150px]"
                    />
                    <Select
                        value={filters.priority}
                        onChange={(e) => onFilterChange('priority', e.target.value)}
                        options={priorityOptions}
                        className="min-w-[150px]"
                    />
                    <Select
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                        options={categoryOptions}
                        className="min-w-[150px]"
                    />
                </div>
            </div>
        </div>
    );
};