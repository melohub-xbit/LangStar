# Frontend Testing Report

## 🛠 Tech Stack
The testing suite is built using modern, fast, and robust tools compatible with Vite:
- **[Vitest](https://vitest.dev/)**: Next-generation test runner (replaces Jest). Faster and native to Vite.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**: For rendering components and testing user interactions (clicks, inputs) rather than implementation details.
- **[JSDOM](https://github.com/jsdom/jsdom)**: Simulates a browser environment (DOM, window, document) in Node.js.

## 🧪 What is Being Tested?
We perform **Unit** and **Integration** testing on all major application features.

### Test Suites & Coverage
| Component | Test File | Features Verified |
|-----------|-----------|-------------------|
| **App Routing** | `App.test.jsx` | Verifies correct page routing (e.g., redirecting to Sign In if not logged in). |
| **Sign Up** | `SignUp.test.jsx` | Checks form rendering and input fields. |
| **Home Page** | `HomePage.test.jsx` | Verifies user welcome message, **Leaderboard** fetching/rendering, and Language switching logic. |
| **Daily Learning** | `DailyLearning.test.jsx` | Tests the Flashcard system: loading states and API integration for generating cards. |
| **Story Mode** | `StoryMode.test.jsx` | Tests story generation API, rendering of story parts, and mocks **Microphone interactions**. |
| **Memory Game** | `MemoryGame.test.jsx` | Verifies game initialization, card fetch/shuffle logic, and card flipping/matching mechanics. |
| **Pixey AI** | `Pixey.test.jsx` | Tests mode switching (Chat vs. Tongue Twister), API calls, and mocks **Speech Recognition**. |

### Key Mocking Strategies
To ensure stability and speed, we mock external dependencies:
- **API Calls (`fetch`)**: All backend calls are intercepted to return mock JSON data, ensuring tests don't fail due to server/network issues.
- **Browser APIs**: `window.matchMedia` and `window.speechRecognition` are mocked to test responsive design and voice features in a headless environment.
- **Context**: `UserProvider` is mocked to simulate logged-in user states without needing actual authentication.

## 🚀 How to Run Tests

### 1. Run All Tests
Execute the full suite in the terminal:
```bash
cd frontend
npm run test
# OR
npx vitest run
```

### 2. Watch Mode
To run tests automatically as you make changes:
```bash
npx vitest
```
