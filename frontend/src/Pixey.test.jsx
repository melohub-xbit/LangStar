
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pixey from './webPages/pixey';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

// Setup basic mocks
const mockUser = { username: 'testuser' };
const mockLanguage = 'Spanish';

vi.mock('./contexts/UserContext', async () => {
    const actual = await vi.importActual('./contexts/UserContext');
    return {
        ...actual,
        useUser: () => ({
            user: mockUser,
            language: mockLanguage,
            languageCode: 'es-ES'
        }),
    };
});

// Mock fetch
global.fetch = vi.fn();

// Mock SpeechRecognition
const mockStart = vi.fn();
const mockStop = vi.fn();

// Mock SpeechRecognition
window.webkitSpeechRecognition = vi.fn();
window.webkitSpeechRecognition.prototype.start = mockStart;
window.webkitSpeechRecognition.prototype.stop = mockStop;
window.webkitSpeechRecognition.prototype.lang = '';
window.speechRecognition = window.webkitSpeechRecognition;

describe('Pixey Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly and defaults to Chat mode', () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <Pixey />
                </BrowserRouter>
            </UserProvider>
        );

        expect(screen.getByText('How can I assist you?')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('chat');
        expect(screen.getByText(/Tap the microphone to start speaking/i)).toBeInTheDocument();
    });

    it('switches to Tongue Twister mode', () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <Pixey />
                </BrowserRouter>
            </UserProvider>
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'tongue-twister' } });

        expect(select).toHaveValue('tongue-twister');
        expect(screen.getByText(/Click the button below to get a tongue twister/i)).toBeInTheDocument();
        expect(screen.getByText('Get Tongue Twister')).toBeInTheDocument();
    });

    it('handles Tongue Twister fetch', async () => {
        const mockTwisterResponse = {
            data: {
                tongue_twisters: [
                    {
                        text: "Tres tristes tigres",
                        pronunciation: "Tres tree-stess tee-gres",
                        translation: "Three sad tigers"
                    }
                ]
            }
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTwisterResponse,
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <Pixey />
                </BrowserRouter>
            </UserProvider>
        );

        // Switch to Tongue Twister
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'tongue-twister' } });

        // Click button
        fireEvent.click(screen.getByText('Get Tongue Twister'));

        await waitFor(() => {
            expect(screen.getByText('Tres tristes tigres')).toBeInTheDocument();
            expect(screen.getByText(/Pronunciation: Tres tree-stess tee-gres/i)).toBeInTheDocument();
        });
    });

    it('starts speech recognition when microphone is clicked in Chat mode', async () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <Pixey />
                </BrowserRouter>
            </UserProvider>
        );

        // Since layout might render a logout button, getByRole('button') is ambiguous.
        // The microphone button is red and has a specific class.
        const buttons = screen.getAllByRole('button');
        const micButton = buttons.find(btn => btn.className.includes('bg-red-700'));
        fireEvent.click(micButton);

        expect(mockStart).toHaveBeenCalled();
    });
});
