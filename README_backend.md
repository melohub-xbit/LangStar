# LangStar - Language Learning App

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)

A robust backend for a pixel art themed language learning app, enabling seamless user interaction, progress tracking, and data management. Built with FastAPI, and integrated with MongoDB database (via pymongo) support for storing user progress, leaderboard, and language content.

## Project Structure

The project is structured as follows:
```
LangStar-BK/
├── basemodels/
│   └── allpydmodels.py
├── endpoints/
│   ├── auth.py
│   ├── games.py
│   └── games_word.py
├── utils/
│   ├── all_helper.py
│   └── story_helper.py
├── main.py
├── database.py
├── .gitignore
└── requirements.txt
```

**utils:**
- **all_helper.py:** Contains utility functions used throughout the backend.
- **story_helper.py:** Contains functions related to story generation and learning.

**endpoints:**
- **auth.py:** Handles user authentication (login, registration, logout).
- **games.py:** Contains endpoints for gamified features, including leaderboards, point updates, and game logic.
- **games_word.py:** Contains endpoints for word-based games, such as flashcard generation, memory games, and speech analysis.

**basemodels:**
- **allpydmodels.py:** Defines data models used throughout the backend.

**main.py:** The main entry point for the backend application.

**database.py:** Handles database interactions.

**requirements.txt:** Lists the required Python packages.

## Features

LangStar offers a variety of features to help users learn new languages:

- **Gamified Learning:**
    - **Leaderboards:** Track user progress and compete with others.
    - **Point System:** Earn points for completing games and activities.
    - **Story Learning:** Learn new vocabulary and grammar through interactive stories.
    - **Flashcard Generation:** Create custom flashcards for daily learning.
    - **Memory Games:** Test your memory and vocabulary with fun memory games.
    - **Speech Analysis:** Get feedback on your pronunciation and fluency.
- **Chat Features:**
    - **Pixie:** A chatbot that provides explanations, usage examples, and interesting facts about words and phrases.
    - **Tongue Twister Generator:** Practice your pronunciation with tongue twisters.
    - **Grammar Buddy:** Get help with grammar and correct your sentences.

## Getting Started

To run the backend locally:

1. Clone the repository, and in the root directory of the repo, install Python and the required packages:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

### Testing

We use `pytest` for a comprehensive 3-layer testing strategy:

1.  **Unit Tests (`tests/unit`)**: Fast tests that rely on mocks. We test API routes, Database logic, and AI response parsing.
2.  **Live AI Tests (`tests/live`)**: Integration tests that allow you to verify your Google Gemini API key is working. These tests actually call Google to generate stories and flashcards.
3.  **Live Database Tests (`tests/live`)**: Verifies that your connection to MongoDB is working by creating and deleting a temporary test user.

**To run the tests:**

1.  **Run Fast Unit Tests** (Recommended for CI/CD):
    ```bash
    pytest tests/unit
    ```
2.  **Run Live Integration Tests** (Requires `.env` with valid keys):
    ```bash
    pytest tests/live
    ```

