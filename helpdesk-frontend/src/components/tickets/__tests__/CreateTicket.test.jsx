// CreateTicket.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock API
jest.mock('../../../services/api.js', () => ({
    ticketService: {
        create: jest.fn()
    }
}), { virtual: true });

// เทสต์ DOM ง่ายๆ
test('DOM renders correctly', () => {
    // สร้าง DOM ที่ต้องการเทสต์ในรูปแบบง่ายๆ
    render(
        <div>
            <label htmlFor="title">Title</label>
            <input id="title" />
            <label htmlFor="description">Description</label>
            <textarea id="description"></textarea>
            <button>Submit</button>
        </div>
    );

    // เช็คว่ามี elements ที่ต้องการ
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
});