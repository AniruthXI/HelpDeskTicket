// src/pages/ResetPassword.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export const ResetPasswordPage = () => {
  const { token } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};