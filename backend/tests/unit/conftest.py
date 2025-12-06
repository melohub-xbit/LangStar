
import os
import sys
import pytest
from unittest.mock import MagicMock

# --- 1. SET ENV VARS BEFORE ANYTHING ---
os.environ["MONGO_URI"] = "mongodb://mock"
os.environ["SECRET_KEY"] = "supersecretkey"
os.environ["ALGORITHM"] = "HS256"
os.environ["GOOGLE_API_KEY"] = "dummy"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

# --- 2. MOCK EXTERNAL LIBRARIES ---
# IMPORTANT: Mock passlib.context.CryptContext BEFORE any app code imports it
mock_pwd_context_instance = MagicMock()
mock_pwd_context_instance.verify.return_value = True
mock_pwd_context_instance.hash.return_value = "hashed_secret"

mock_passlib_ctx = MagicMock()
mock_passlib_ctx.CryptContext.return_value = mock_pwd_context_instance
sys.modules["passlib.context"] = mock_passlib_ctx

# Mock pymongo
mock_mongo_client = MagicMock()
mock_db = MagicMock()
mock_users_collection = MagicMock()
mock_mongo_client.__getitem__.return_value = mock_db
mock_db.__getitem__.return_value = mock_users_collection

sys.modules["pymongo"] = MagicMock()
sys.modules["pymongo"].MongoClient.return_value = mock_mongo_client
sys.modules["pymongo.server_api"] = MagicMock()

# Mock google
sys.modules["google"] = MagicMock()
sys.modules["google.generativeai"] = MagicMock()

# --- 3. IMPORT APP ---
# We need to add the backend root to sys.path
# Structure: backend/tests/unit/conftest.py
# Root: backend
backend_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_path not in sys.path:
    sys.path.append(backend_path)

from main import app
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    # Reset mocks state
    mock_users_collection.reset_mock()
    mock_users_collection.find_one.side_effect = None
    mock_users_collection.find_one.return_value = None
    
    # Reset pwd context mock
    mock_pwd_context_instance.reset_mock()
    mock_pwd_context_instance.verify.return_value = True
    
    with TestClient(app) as c:
        yield c

@pytest.fixture
def mock_users_coll():
    return mock_users_collection
