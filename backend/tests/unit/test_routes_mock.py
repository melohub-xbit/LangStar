
from unittest.mock import MagicMock
import pytest

# --- Tests for Game Routes ---
def test_update_score(client, mock_users_coll):
    # Mock update_one to simulate success
    # It returns an object with modified_count, etc.
    mock_result = MagicMock()
    mock_result.modified_count = 1
    mock_users_coll.update_one.return_value = mock_result

    response = client.post("/updatescore", json={
        "username": "testuser",
        "language": "Spanish",
        "score": 10
    })
    
    # Endpoint returns nothing (null) or 200 OK on success
    assert response.status_code == 200
    # Verify DB update was called with correct increment
    mock_users_coll.update_one.assert_called_with(
        {"username": "testuser"},
        {"$inc": {"languages.SPANISH": 10}}
    )

def test_get_scores(client, mock_users_coll):
    # Mock find_one to return user data
    mock_users_coll.find_one.return_value = {
        "username": "testuser",
        "languages": {"SPANISH": 50, "FRENCH": 20}
    }

    response = client.post("/getscores", json={
        "username": "testuser",
        "language": "doesntmatter" # Schema requires language but endpoint logic might use it or just user
    })

    assert response.status_code == 200
    assert response.json()["languages"]["SPANISH"] == 50
    assert response.json()["languages"]["FRENCH"] == 20

# --- Tests for Story Routes Integration ---
def test_story_start_route(client, mock_users_coll):
    # This route calls generate_and_start_story which calls db.active_stories
    # We need to ensure active_stories collection is mocked.
    # In conftest we mocked db['users'] but maybe not db['active_stories'].
    # Let's inspect conftest or just mock it here if we assume client fixture setup is generic.
    
    # Access the mocked db from the client app state or the mocked module
    # In conftest we did: mock_db.__getitem__.return_value = mock_users_collection
    # This means ANY collection access returns the same mock_users_collection object!
    # So db['active_stories'] == mock_users_coll. 
    # This might be messy if we expect different behavior.
    # But for a basic "route works" test, it suffices if we handle the calls.
    
    # Mock find_one for user (to get points/level)
    mock_users_coll.find_one.return_value = {
        "_id": "userid123",
        "username": "testuser",
        "languages": {"SPANISH": 10} # Beginner
    }
    
    # We need to mock the generate_stories helper since it calls Google AI.
    # We can patch 'endpoints.games.generate_stories' or 'utils.story_helper.generate_stories'
    # Since we are testing the route 'endpoints.games', we should patch where it is IMPORTED or used.
    # It seems logic is in games.py -> generates_and_start_story (from story_helper)
    
    with pytest.MonkeyPatch.context() as m:
        # Mock the async generator function
        async def mock_gen_story(*args):
             return {
                 "story_id": "story123", 
                 "current_part": {"content": "Hola"},
                 "total_parts": 5
             }
        
        # Patch the function imported in games.py
        # We need to know where generate_and_start_story is defined. It is in utils.story_helper.
        # But games.py imports it.
        from endpoints import games
        m.setattr(games, "generate_and_start_story", mock_gen_story)

        response = client.post("/storystart", json={
            "username": "testuser",
            "language": "Spanish"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["story_id"] == "story123"
        assert data["current_part"]["content"] == "Hola"

def test_story_narrate_route(client, mock_users_coll):
    with pytest.MonkeyPatch.context() as m:
        async def mock_save_narration(*args):
            return {
                "status": "in_progress",
                "next_part": {"content": "Adios"},
                "current_feedback": {"score": 10}
            }
            
        from endpoints import games
        m.setattr(games, "save_part_narration", mock_save_narration)
        
        # We need to mock user lookup to get ID, which happens before save_part_narration
        mock_users_coll.find_one.return_value = {"_id": "userid123", "username": "testuser"}
        
        response = client.post("/storynarrate", json={
            "username": "testuser",
            "transcription": "Hola mundo"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "in_progress"
        assert data["next_part"]["content"] == "Adios"
