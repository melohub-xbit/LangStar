

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_signup_success(client, mock_users_coll):
    # Setup mock to return None (user doesn't exist)
    mock_users_coll.find_one.side_effect = [None, {"languages": {"SPANISH": 0}}] 
    # First find_one is check if exists (None), second is retrieval after insert (mocked return)

    response = client.post("/register", json={
        "username": "newuser",
        "password": "password123"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    
    # Verify insert_one was called
    mock_users_coll.insert_one.assert_called_once()


def test_login_success(client, mock_users_coll):
    # Setup mock to return a user found
    mock_users_coll.find_one.return_value = {
        "username": "existinguser",
        "password": "hashed_password",
        "languages": {"SPANISH": 10}
    }

    response = client.post("/login", json={
        "username": "existinguser",
        "password": "password123"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data


def test_leaderboard_empty(client, mock_users_coll):
    # Simulate DB error or empty result
    mock_users_coll.aggregate.side_effect = Exception("DB Error")

    response = client.post("/leaderboard", json={"language": "spanish", "username": "testuser"})
    
    # The code catches exception and returns empty list
    assert response.status_code == 200 
    assert response.json()["leaderboard"] == []
