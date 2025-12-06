
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MemoryGame from './webPages/memoryGame';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

// Mock matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// Mock user context values
const mockUser = { username: 'testuser' };
const mockLanguage = 'Spanish';

// Mock UserProvider hook
vi.mock('./contexts/UserContext', async () => {
    const actual = await vi.importActual('./contexts/UserContext');
    return {
        ...actual,
        useUser: () => ({
            user: mockUser,
            language: mockLanguage,
        }),
    };
});

// Mock fetch
global.fetch = vi.fn();

describe('MemoryGame Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays loading state initially', () => {
        // Mock fetch to return a promise that never resolves immediately
        global.fetch.mockImplementation(() => new Promise(() => { }));

        render(
            <UserProvider>
                <BrowserRouter>
                    <MemoryGame />
                </BrowserRouter>
            </UserProvider>
        );

        // We can't easy invoke queryByRole for a spinner unless it has role="status" or similar.
        // But we can check if the game board is NOT present yet.
        expect(screen.queryByText(/Time:/i)).not.toBeInTheDocument();
    });

    it('fetches and generates cards successfully', async () => {
        const mockPairsResponse = {
            words: {
                pairs: [
                    ["Gato", "Cat", "Gah-toh"],
                    ["Perro", "Dog", "Peh-rro"]
                ]
            }
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPairsResponse,
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <MemoryGame />
                </BrowserRouter>
            </UserProvider>
        );

        // Wait for cards to appear
        await waitFor(() => {
            expect(screen.getByText('Time: 00:00')).toBeInTheDocument();
        });

        // Check if cards are rendered
        // 2 pairs * 2 cards each = 4 cards
        // "Gato" (Foreign) and "Cat" (English) should be present
        expect(screen.getByText('Gato')).toBeInTheDocument();
        expect(screen.getByText('Cat')).toBeInTheDocument();
        expect(screen.getByText('Perro')).toBeInTheDocument();
        expect(screen.getByText('Dog')).toBeInTheDocument();
    });

    it('handles card clicks and flipping', async () => {
        const mockPairsResponse = {
            words: {
                pairs: [
                    ["Gato", "Cat", "Gah-toh"]
                ]
            }
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPairsResponse,
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <MemoryGame />
                </BrowserRouter>
            </UserProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Gato')).toBeInTheDocument();
        });

        const card1 = screen.getByText('Gato').closest('.aspect-square');
        fireEvent.click(card1);

        // Check if flipped class is applied
        expect(card1).toHaveClass('rotate-y-180');
    });
});
