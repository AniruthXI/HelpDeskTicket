// src/components/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const ResetPasswordForm = ({ token }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: formData.password })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Password Reset Successfully</h2>
                <p className="text-gray-600 mb-4">
                    Your password has been reset successfully.
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                    Login with New Password
                </Button>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="New Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </Card>
    );
};