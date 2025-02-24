// src/components/profile/ProfileForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const updates = {
        username: formData.username,
        email: formData.email
      };
      
      if (formData.newPassword) {
        updates.currentPassword = formData.currentPassword;
        updates.password = formData.newPassword;
      }

      await updateProfile(updates);
      setSuccess('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <Input
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        
        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </Card>
  );
};

export default ProfileForm;