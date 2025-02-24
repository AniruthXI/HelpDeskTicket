// src/components/tickets/TicketForm.jsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { SuccessPopup } from '../ui/SuccessPopup';
import { ticketService } from '../../services/api';

export const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact_info: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ticketService.create(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        contact_info: ''
      });

      // Show success popup
      setShowSuccessPopup(true);
      
      // Hide popup after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);

    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessPopup 
        isOpen={showSuccessPopup}
        message="Ticket created successfully!"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter ticket title"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your issue"
            rows="4"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Info
          </label>
          <input
            type="text"
            value={formData.contact_info}
            onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
            placeholder="Your contact information"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-red-500">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          ) : (
            'Create Ticket'
          )}
        </Button>
      </form>
    </>
  );
};