import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock matchMedia for components that might verify media queries
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('App Component', () => {
    it('renders the Sign In page by default', () => {
        render(<App />);
        // Check if the Sign In header is present using a more specific query
        expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('contains the Sign Up link', () => {
        render(<App />);
        expect(screen.getByText(/Don’t have an account?/i)).toBeInTheDocument();
    });
});
