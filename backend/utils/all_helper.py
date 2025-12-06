import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import dotenv
import os
from fastapi.security import OAuth2PasswordBearer
import google.generativeai as genai
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Database setup
dotenv.load_dotenv()
uri = os.getenv('MONGO_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
storydb = client["story_db"]

#gemini model
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
# 2025-UPDATE: Using standard flash model and adding fallback
model = genai.GenerativeModel('gemini-2.5-flash')


# Security configurations
# Security configurations
# 2025-UPDATE: Using direct bcrypt instead of passlib to avoid version conflicts
def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

from datetime import datetime, timedelta, timezone

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#determine level
def determine_user_level(points: int) -> str:
    if points < 100:
        return "beginner"
    elif points < 300:
        return "intermediate"
    else:
        return "advanced"

#generating dailies
def generate_dailies(language: str, level: str) -> dict:
    prompt = f"""Generate 10 flashcards for {language} language learning at {level} level.
    Return only a JSON array with this exact structure:
        "cards": [
            {{
                "new_concept": "concept in {language}",
                "concept_pronunciation": "pronunciation of the concept in english",
                "english": "english translation",
                "meaning": "detailed explanation",
                "example": "example sentence in {language}",
                "example_pronunciation": "pronunciation of the example sentence in english",
                "translation": "translation of the example sentence"
            }}
        ]
    }}"""
    try:
        response = model.generate_content(prompt)
        # Remove markdown formatting and clean the string
        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace('```json\n', '').replace('\n```', '')
        cleaned_text = cleaned_text.replace('```json', '').replace('```', '')
        # Remove any extra newlines and spaces
        cleaned_text = ''.join(line.strip() for line in cleaned_text.splitlines())
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"GenAI Error (Dailies): {e} - Returning Mock Data")
        # Mock fallback
        return {
            "cards": [
                {
                    "new_concept": "Hola (Mock)",
                    "concept_pronunciation": "oh-la",
                    "english": "Hello",
                    "meaning": "A common greeting used when meeting someone.",
                    "example": "Hola, ¿cómo estás?",
                    "example_pronunciation": "oh-la, koh-moh ehs-tahs",
                    "translation": "Hello, how are you?"
                },
                {
                    "new_concept": "Gracias (Mock)",
                    "concept_pronunciation": "grah-see-ahs",
                    "english": "Thank you",
                    "meaning": "Used to express gratitude.",
                    "example": "Muchas gracias por tu ayuda.",
                    "example_pronunciation": "moo-chas grah-see-ahs por too ah-yoo-dah",
                    "translation": "Thank you very much for your help."
                }
            ]
        }


#generate word pairs for memory game
def generate_memory_pairs(language: str, level: str) -> dict:
    prompt = f"""Generate 10 word/phrase pairs for a memory matching game in {language} at {level} level so that the user is able to learn some good, effective things to say in that language.
    Return only a JSON object with this exact structure:
    }}
    Make sure the words/phrases are appropriate for {level} level learners, and if you give phrases, don't make them too long. Also, make sure to give some phrases and some words."""
    
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace('```json\n', '').replace('\n```', '')
        cleaned_text = ''.join(line.strip() for line in cleaned_text.splitlines())
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"GenAI Error (Memory): {e} - Returning Mock Data")
        return {
            "pairs": [
                ["Gato (Mock)", "Cat", "Gah-toh"],
                ["Perro (Mock)", "Dog", "Peh-rro"],
                ["Casa (Mock)", "House", "Kah-sah"],
                ["Coche (Mock)", "Car", "Koh-cheh"],
                ["Árbol (Mock)", "Tree", "Ar-bol"]
            ]
        }


def language_teaching_chat(language: str, user_query: str) -> dict:
    prompt = f"""As a language teaching assistant for {language}, respond to: {user_query}, with answers related to {language}.
    
    Return response in this JSON structure:
    {{
        "response": "small, brief explanation",
        "examples": "two small examples of usage of {user_query}",
        "interesting_facts": "two small interesting facts about {user_query}"
    }}
    
    
    Focus on providing clear explanations with practical examples."""
    
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace('```json\n', '').replace('\n```', '')
        cleaned_text = ''.join(line.strip() for line in cleaned_text.splitlines())
        return json.loads(cleaned_text)
    except Exception as e:
         print(f"GenAI Error (Chat): {e} - Returning Mock Data")
         return {
            "response": "I'm currently offline (Mock Mode), but normally I'd help you with that!",
            "examples": "Example 1 (Mock), Example 2 (Mock)",
            "interesting_facts": "Fact 1 (Mock), Fact 2 (Mock)"
        }

def generate_tongue_twisters(language: str) -> dict:
    prompt = f"""Generate 5 fun and challenging tongue twisters in {language} at five different difficulty levels.
    
    Return only a JSON object with this structure:
    {{
        "tongue_twisters": [
            {{
                "text": "tongue twister in {language}",
                "pronunciation": "pronunciation guide",
                "translation": "english translation",
            }}
        ]
    }}"""
    
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace('```json\n', '').replace('\n```', '')
        cleaned_text = ''.join(line.strip() for line in cleaned_text.splitlines())
        return json.loads(cleaned_text)
    except Exception as e:
         print(f"GenAI Error (Twister): {e} - Returning Mock Data")
         return {
            "tongue_twisters": [
                {
                    "text": "Tres tristes tigres tragaban trigo en un trigal (Mock)",
                    "pronunciation": "Tres tris-tes ti-gres...",
                    "translation": "Three sad tigers were eating wheat in a wheat field"
                }
            ]
        }

#function to teach sentence transformations based on the sentence given by user
def analyze_speech_transcript(language: str, transcript: str) -> dict:
    prompt = f"""Analyze this {language} speech transcript: "{transcript}"
    
    Return only a JSON object with this exact structure:
    {{
        "original": "the transcript",
        "correct_form": "grammatically correct version",
        "alternatives": [
            "2 alternative ways to express the same meaning"
        ],
        "score": "rating from 1-10 based on grammar and natural flow",
    }}
    
    Focus on natural speech patterns and common expressions in {language}."""
    
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip()
        cleaned_text = cleaned_text.replace('```json\n', '').replace('\n```', '')
        cleaned_text = ''.join(line.strip() for line in cleaned_text.splitlines())
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"GenAI Error (Analysis): {e} - Returning Mock Data")
        return {
            "original": transcript,
            "correct_form": transcript + " (Corrected Mock)",
            "alternatives": ["Alternative 1", "Alternative 2"],
            "score": "8"
        }
