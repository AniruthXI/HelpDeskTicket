// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.username, formData.email, formData.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-4">
        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={loading}
          placeholder="Choose a username"
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
          placeholder="Create a password"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
          placeholder="Confirm your password"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </div>
        ) : (
          'Create account'
        )}
      </Button>

      <p className="text-sm text-center text-gray-500">
        By registering, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">
          Privacy Policy
        </a>
      </p>
    </form>
  );
};