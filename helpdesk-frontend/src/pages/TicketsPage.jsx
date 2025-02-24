// src/pages/TicketsPage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TicketForm } from '../components/tickets/TicketForm';
import { TicketList } from '../components/tickets/TicketList';
import { Card } from '../components/ui/Card';
import { UserCircle } from 'lucide-react';

export const TicketsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <UserCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.username}!</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Create Ticket Section */}
      <Card className="p-6">
        <TicketForm />
      </Card>

      {/* Tickets List Section */}
      <div>
        <TicketList />
      </div>
    </div>
  );
};

export default TicketsPage;