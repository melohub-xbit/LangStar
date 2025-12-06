
import os
import sys
import pytest
import dotenv
from fastapi.testclient import TestClient

# --- LIVE CONFTEST ---
# DO NOT MOCK sys.modules here. We want REAL libraries.

# Load real environment variables from backend/.env
# Structure: backend/tests/live/conftest.py
# Env: backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
dotenv.load_dotenv(env_path)

# Add backend to path
backend_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_path not in sys.path:
    sys.path.append(backend_path)

from main import app

@pytest.fixture
def client_live():
    # Helper for live tests
    with TestClient(app) as c:
        yield c
