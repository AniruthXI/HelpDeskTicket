// src/components/tickets/__tests__/FileUpload.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileUpload } from '../FileUpload';

describe('FileUpload Component', () => {
  test('renders upload button', () => {
    render(<FileUpload onUpload={() => {}} />);
    expect(screen.getByText(/upload files/i)).toBeInTheDocument();
  });
});