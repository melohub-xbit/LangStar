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
