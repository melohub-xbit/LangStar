
import pytest
import os
from utils import all_helper, story_helper

# Common skip marker
skip_no_key = pytest.mark.skipif(not os.getenv("GOOGLE_API_KEY"), reason="GOOGLE_API_KEY not set")

@skip_no_key
def test_generate_flashcards_live():
    print("\nCalling Gemini API for Flashcards...")
    try:
        result = all_helper.generate_dailies("Spanish", "Beginner")
        assert "cards" in result
        assert len(result["cards"]) > 0
        print(f"Successfully generated {len(result['cards'])} cards.")
    except Exception as e:
        if "403" in str(e) or "PermissionDenied" in str(e):
             pytest.skip(f"Skipping live test: API Key invalid or permission denied ({e})")
        pytest.fail(f"Live API call failed: {e}")

@skip_no_key
def test_translate_tongue_twister_live():
    print("\nCalling Gemini API for Tongue Twisters...")
    try:
        result = all_helper.generate_tongue_twisters("French")
        assert "tongue_twisters" in result
        assert len(result["tongue_twisters"]) > 0
        print("Successfully generated tongue twisters.")
    except Exception as e:
        if "403" in str(e) or "PermissionDenied" in str(e):
             pytest.skip(f"Skipping live test: API Key invalid or permission denied ({e})")
        pytest.fail(f"Live API call failed: {e}")

@skip_no_key
def test_generate_stories_live():
    print("\nCalling Gemini API for Story Generation...")
    try:
        result = story_helper.generate_stories("German", "Intermediate")
        assert "title" in result
        assert "parts" in result
        assert len(result["parts"]) == 5
        print(f"Successfully generated story: {result['title']}")
    except Exception as e:
        if "403" in str(e) or "PermissionDenied" in str(e):
             pytest.skip(f"Skipping live test: API Key invalid or permission denied ({e})")
        pytest.fail(f"Live API call failed: {e}")

@skip_no_key
def test_analyze_speech_transcript_live():
    print("\nCalling Gemini API for Speech Analysis...")
    transcript = "Yo querer ir a la playa ayer." # Intentionally broken Spanish
    try:
        result = all_helper.analyze_speech_transcript("Spanish", transcript)
        assert "correct_form" in result
        assert "score" in result
        print(f"Analysis received. Correct form: {result['correct_form']}")
    except Exception as e:
        if "403" in str(e) or "PermissionDenied" in str(e):
             pytest.skip(f"Skipping live test: API Key invalid or permission denied ({e})")
        pytest.fail(f"Live API call failed: {e}")

@skip_no_key
def test_language_teaching_chat_live():
    print("\nCalling Gemini API for Chat...")
    try:
        result = all_helper.language_teaching_chat("Italian", "How do I order pizza?")
        assert "response" in result
        assert "examples" in result
        print("Chat response received successfully.")
    except Exception as e:
        if "403" in str(e) or "PermissionDenied" in str(e):
             pytest.skip(f"Skipping live test: API Key invalid or permission denied ({e})")
        pytest.fail(f"Live API call failed: {e}")
