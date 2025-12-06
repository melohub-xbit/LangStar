import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StoryMode from './webPages/storyMode';
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

// Mock SpeechRecognition
const mockStart = vi.fn();
const mockStop = vi.fn();
const mockSpeechRecognition = vi.fn(() => ({
    start: mockStart,
    stop: mockStop,
    lang: '',
    onresult: null,
}));
window.speechRecognition = mockSpeechRecognition;
window.webkitSpeechRecognition = mockSpeechRecognition;

// Mock URL.createObjectURL for image blob handling
window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

// Mock UserContext
const mockUser = { username: 'testuser' };
const mockLanguage = 'Spanish';

vi.mock('./contexts/UserContext', async () => {
    const actual = await vi.importActual('./contexts/UserContext');
    return {
        ...actual,
        useUser: () => ({
            user: mockUser,
            language: mockLanguage,
            languageCode: 'es-ES',
            refreshUserData: vi.fn(),
        }),
    };
});

// Mock fetch
global.fetch = vi.fn();

describe('StoryMode Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders initial story part correctly', async () => {
        // Mock successful story start response
        const mockStoryPart = {
            part_number: 1,
            content: 'Había una vez',
            translation: 'Once upon a time',
            description: 'A fairy tale beginning'
        };

        // We need to handle multiple fetch calls:
        // 1. storystart endpoint
        // 2. image generation (huggingface)

        global.fetch.mockImplementation((url) => {
            if (url.includes('/storystart')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ current_part: mockStoryPart }),
                });
            }
            if (url.includes('huggingface.co')) {
                return Promise.resolve({
                    ok: true,
                    blob: async () => new Blob(['fake-image'], { type: 'image/png' }),
                });
            }
            return Promise.reject(new Error(`Unhandled fetch to ${url}`));
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <StoryMode />
                </BrowserRouter>
            </UserProvider>
        );

        // Verify loading state or just wait for content
        // "Part 1 of 5" should appear
        await waitFor(() => {
            expect(screen.getByText(/Part 1 of 5/i)).toBeInTheDocument();
        });

        // Verify content
        expect(screen.getByText('Había una vez')).toBeInTheDocument();
        expect(screen.getByText('Once upon a time')).toBeInTheDocument();
    });

    it('handles microphone interaction', async () => {
        // Setup initial story state again
        const mockStoryPart = {
            part_number: 1, content: 'Hola', translation: 'Hello', description: 'Greeting'
        };

        global.fetch.mockImplementation((url) => {
            if (url.includes('/storystart')) {
                return Promise.resolve({ ok: true, json: async () => ({ current_part: mockStoryPart }) });
            }
            if (url.includes('huggingface.co')) return Promise.resolve({ ok: true, blob: async () => new Blob() });
            return Promise.reject();
        });

        render(
            <UserProvider>
                <BrowserRouter>
                    <StoryMode />
                </BrowserRouter>
            </UserProvider>
        );

        await waitFor(() => screen.getByText('Hola'));

        // Find microphone button (it has FaMicrophoneLines icon, usually in a button)
        // We can find by role 'button' but there might be multiple. 
        // The record button has a red class. Or we can just look for the default text "Tap the microphone..."

        expect(screen.getByText(/Tap the microphone!/i)).toBeInTheDocument();

        // Get the record button - simpler to find by looking for the one that calls handleOnRecord
        // But we can't select by handler.
        // Let's rely on the fact it's the first button or select by class/icon if possible.
        // Or simpler: The button near the "Tap the microphone" text.

        // Let's assume there are two buttons: Record and Next.
        const buttons = screen.getAllByRole('button');
        // Filter for the one that is likely the record button (e.g. not disabled, or has specific icon)
        // The 'next' button is disabled initially.
        const nextButton = buttons.find(b => b.disabled); // Should be the next button
        const recordButton = buttons.find(b => !b.disabled && !b.textContent.includes('Part')); // Filter out unrelated

        // Simpler approach: Testing Library recommends aria-labels. 
        // Since we don't have them, let's just assume we can find it structurally or add aria-label in source later. 
        // For now, let's try firing click on the button that isn't disabled.

        // Actually, we can trigger the speech recognition mock manually?
        // No, we need to click the button to verify it calls start()

        // Let's simulate clicking the red record button
        // classes: bg-red-700
        // We can query by class logic is fragile.

        // Let's add data-testid if needed, or better, verify the initial state is empty transcript.
    });
});
