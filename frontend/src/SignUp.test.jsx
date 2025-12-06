import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignUp from './webPages/signUp';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

// Helper to wrap components with necessary providers
const renderWithProviders = (component) => {
    return render(
        <UserProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </UserProvider>
    );
};

// Mock matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('SignUp Page', () => {
    it('renders sign up form elements', () => {
        renderWithProviders(<SignUp />);

        expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
        // Use placeholder for username
        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();

        // Passwords inputs usually don't have roles like textbox, so use placeholder or label
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: "Sign Up" })).toBeInTheDocument();
    });

    it('shows error when passwords do not match', () => {
        renderWithProviders(<SignUp />);

        const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
        const passwordInput = screen.getByPlaceholderText("Enter your password");
        const confirmInput = screen.getByPlaceholderText("Confirm your password");
        const submitButton = screen.getByRole('button', { name: "Sign Up" });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmInput, { target: { value: 'password456' } }); // Mismatched

        fireEvent.click(submitButton);

        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
});
