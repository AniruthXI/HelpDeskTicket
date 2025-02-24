// src/pages/ForgotPassword.jsx
import React from 'react';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

