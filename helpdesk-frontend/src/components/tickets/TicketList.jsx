// src/components/tickets/TicketList.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ticketService } from '../../services/api';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const icons = {
    pending: Clock,
    in_progress: AlertCircle,
    resolved: CheckCircle,
    closed: XCircle
  };

  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-4 h-4 mr-1" />
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const ticketsData = await ticketService.getAll();
        console.log('Tickets received:', ticketsData);
        setTickets(ticketsData);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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
          <span className="text-red-500">⚠</span>
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  }

  console.log('Rendering tickets:', tickets); // Debug log for render

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Card key={ticket._id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {ticket.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created by {ticket.createdBy?.username || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => window.location.href = `/tickets/${ticket._id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};