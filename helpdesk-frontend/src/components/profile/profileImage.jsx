// src/components/profile/ProfileImage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ProfileImage = () => {
  const { user, updateProfileImage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError('');

    try {
      await updateProfileImage(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
          {user.profileImage ? (
            <img
              src={`http://localhost:3000/${user.profileImage}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-4xl text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            as="label"
            htmlFor="profile-image"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Change Picture'}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </Card>
  );
};