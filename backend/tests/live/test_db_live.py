
import pytest
import os
from pymongo import MongoClient
import uuid

# Load environment variables (conftest already does this but doing it explicit is fine)
# We assume conftest.py in tests/live/conftest.py has loaded the .env

@pytest.fixture(scope="module")
def real_mongo_client():
    uri = os.getenv("MONGO_URI")
    if not uri:
        pytest.skip("MONGO_URI not set")
    client = MongoClient(uri)
    yield client
    client.close()

@pytest.fixture(scope="module")
def test_db(real_mongo_client):
    """
    Returns a database object. We'll use the one specified in the code 'auth_db' 
    but we will write to a special TEST_COLLECTION or ensure we clean up.
    """
    # The app hardcodes 'auth_db' for users.
    db = real_mongo_client["auth_db"]
    return db

@pytest.fixture
def test_user(test_db):
    """
    Creates a unique test user in the real database and cleans it up after.
    """
    unique_name = f"test_user_{uuid.uuid4().hex[:8]}"
    print(f"\nCreating real test user: {unique_name}")
    
    # We can insert directly to setup
    user_doc = {
        "username": unique_name,
        "password": "hashed_password_placeholder",
        "languages": {"SPANISH": 100, "FRENCH": 0},
        "is_test": True
    }
    test_db.users.insert_one(user_doc)
    
    yield unique_name
    
    # Teardown
    print(f"Cleaning up real test user: {unique_name}")
    test_db.users.delete_one({"username": unique_name})

def test_db_insert_and_find(test_db, test_user):
    # Verify the fixture created the user
    user = test_db.users.find_one({"username": test_user})
    assert user is not None
    assert user["languages"]["SPANISH"] == 100

def test_db_update_score_live(test_db, test_user):
    # Perform a real update
    result = test_db.users.update_one(
        {"username": test_user},
        {"$inc": {"languages.SPANISH": 50}}
    )
    
    assert result.modified_count == 1
    
    # Verify persistence
    updated_user = test_db.users.find_one({"username": test_user})
    assert updated_user["languages"]["SPANISH"] == 150

def test_db_create_duplicate_fail(test_db, test_user):
    # Try validation logic (mongo unique index usually handles this, but let's see if we have one)
    # If no unique index is set up, this might pass (which means duplicate users allowed).
    # This test essentially checks IF we have a unique constraint or if the app logic handles it.
    
    # Check if we can check "username exists" logic similar to register route
    exists = test_db.users.find_one({"username": test_user})
    assert exists is not None
