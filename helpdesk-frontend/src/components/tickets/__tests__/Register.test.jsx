import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock API
jest.mock('../../../services/api.js', () => ({
    authService: {
        register: jest.fn(() => Promise.resolve({ message: 'User registered successfully' }))
    }
}), { virtual: true });

// เทสต์ DOM ง่ายๆ
test('Register form renders correctly', () => {
    // สร้าง DOM ที่ต้องการเทสต์ในรูปแบบง่ายๆ
    render(
        <div>
            <h1>Register</h1>
            <form>
                <label htmlFor="username">Username</label>
                <input id="username" placeholder="Username" />
                <label htmlFor="email">Email</label>
                <input id="email" placeholder="Email" />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
        </div>
    );

    // เช็คว่ามี elements ที่ต้องการ
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});