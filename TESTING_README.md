# Testing Report

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

# Backend Testing Report

## 🛠 Tech Stack
The backend testing infrastructure utilizes standard Python testing tools:
- **[pytest](https://docs.pytest.org/)**: The primary test runner, known for its simple syntax and powerful fixture system.
- **[FastAPI TestClient](https://fastapi.tiangolo.com/tutorial/testing/)**: Built on `httpx`, allows simulated HTTP requests to the FastAPI application without running a live server.
- **[unittest.mock](https://docs.python.org/3/library/unittest.mock.html)**: Standard library used to mock external services (like MongoDB and Gemini API) during unit testing.

## 🧪 What is Being Tested?
We have separated concerns into **Unit Tests** (fast, safe, mocked) and **Live Tests** (real integration, slower).

### 1. Unit Tests (`backend/tests/unit`)
These tests run in isolation and do not require a real database or internet connection.
| Test File | Purpose |
|-----------|---------|
| `test_basic.py` | verifies application startup, health check endpoints, and basic configuration. |
| `test_routes_mock.py` | Tests core API routes (Auth, User data) using mocked database calls to ensure logic correctness. |
| `test_features.py` | Validates specific backend features logic (e.g., scoring calculations, level determination). |
| `test_genai_features_mock.py` | **Safe AI Testing**: Mocks the Gemini API (`google.generativeai`) to test how the backend handles AI responses (parsing JSON, error handling) without spending API quota. |

### 2. Live Tests (`backend/tests/live`)
These tests connect to real services to verify end-to-end integration.
| Test File | Purpose |
|-----------|---------|
| `test_db_live.py` | Connects to the **Real MongoDB** to verify connection strings, write permissions, and query execution. |
| `test_genai_live.py` | Calls the **Real Gemini API** to verify quota status, model availability, and response validity. *Note: These may fail if API keys are invalid or quota is exceeded.* |

## 🚀 How to Run Tests

### 1. Run All Unit Tests (Recommended)
This is the safest command for CI/CD or local development as it uses mocks.
```bash
cd backend
pytest tests/unit
```

### 2. Run Live Tests (Caution)
⚠️ **Warning**: This consumes real API quota and affects the database.
```bash
cd backend
pytest tests/live
```

### 3. Run Everything
```bash
cd backend
pytest
```

### 4. Debug with Logs
To see print statements (like Stack Traces or Debug logs) during testing:
```bash
pytest -s
```
