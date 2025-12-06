
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './webPages/homePage';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

const mockUpdateLanguage = vi.fn();
const mockRefreshUserData = vi.fn();

// Mock UserProvider hook
vi.mock('./contexts/UserContext', async () => {
    const actual = await vi.importActual('./contexts/UserContext');
    return {
        ...actual,
        useUser: () => ({
            user: { username: 'testuser' },
            language: 'Spanish',
            totalScore: 100,
            updateLanguage: mockUpdateLanguage,
            refreshUserData: mockRefreshUserData,
        }),
    };
});

// Mock fetch
global.fetch = vi.fn();

describe('HomePage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders welcome message and score', async () => {
        // Mock fetch for leaderboard
        global.fetch.mockResolvedValue({
            json: async () => ({ leaderboard: [] }),
            ok: true
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <HomePage />
                </BrowserRouter>
            </UserProvider>
        );

        expect(screen.getByText('Welcome to LangStar, testuser')).toBeInTheDocument();
        expect(screen.getByText('100 Points')).toBeInTheDocument();

        // Wait for loading to finish to prevent "act" warning
        await waitFor(() => {
            expect(screen.getByText('Leaderboard')).toBeInTheDocument();
        });
    });

    it('renders and fetches leaderboard', async () => {
        const mockLeaderboard = [
            { rank: 1, username: 'user1', points: 200 },
            { rank: 2, username: 'testuser', points: 100 }
        ];

        global.fetch.mockResolvedValueOnce({
            json: async () => ({ leaderboard: mockLeaderboard }),
            ok: true
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <HomePage />
                </BrowserRouter>
            </UserProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('#1')).toBeInTheDocument();
            expect(screen.getByText('200')).toBeInTheDocument();
        });
    });

    it('handles language change', () => {
        // Mock fetch for leaderboard (called on mount)
        global.fetch.mockResolvedValue({
            json: async () => ({ leaderboard: [] }),
            ok: true
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <HomePage />
                </BrowserRouter>
            </UserProvider>
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'French' } });

        expect(mockUpdateLanguage).toHaveBeenCalledWith('French');
    });
});
