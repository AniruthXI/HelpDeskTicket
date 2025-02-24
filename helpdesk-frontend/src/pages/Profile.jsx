// src/pages/Profile.jsx
import React from 'react';
import { Layout } from '../components/Layout';
import { ProfileForm } from '../components/profile/profileForm';
import { ProfileImage } from '../components/profile/profileImage';

export const ProfilePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <div className="space-y-6">
          <ProfileImage />
          <ProfileForm />
        </div>
      </div>
    </Layout>
  );
};