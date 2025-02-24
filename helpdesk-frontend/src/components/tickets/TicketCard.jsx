// src/components/tickets/TicketCard.jsx
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

export const TicketCard = ({ ticket, onStatusChange }) => {
  const statusColors = {
    pending: 'bg-yellow-100',
    accepted: 'bg-blue-100',
    resolved: 'bg-green-100',
    rejected: 'bg-red-100'
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <Card className={`${statusColors[ticket.status]} mb-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{ticket.title}</h3>
          <p className="text-sm text-gray-600">{ticket.description}</p>
          <p className="text-xs text-gray-500 mt-2">Contact: {ticket.contact_info}</p>
        </div>
        <Select
          options={statusOptions}
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
          className="w-32"
        />
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Updated: {new Date(ticket.updated_at).toLocaleString()}
      </div>
    </Card>
  );
};
