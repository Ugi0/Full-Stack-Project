import React from 'react';
import { render, screen } from '@testing-library/react';
import { Login } from '../views/Login';

test('renders component', () => {
    render(<Login />);
    expect(screen.getByText("WELCOME")).toBeInTheDocument();
})