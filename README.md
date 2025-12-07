# LangStar

> A pixel art themed language learning app with engaging interactive features, built with React, Tailwind CSS, and Sarvam API for text-to-speech translation.



## About the Project
**LangStar** is a comprehensive language learning platform designed with a captivating pixel art aesthetic to make language acquisition fun and interactive.

**Frontend:** Developed using **React** and **Tailwind CSS**, the application features **Framer Motion** for smooth, engaging animations and integrates **Sarvam API** for high-quality text-to-speech capabilities. The interface provides an immersive experience with features like story mode exercises, interactive pronunciation checks, memory games, and real-time progress tracking.

**Backend:** Powering the application is a robust **FastAPI** backend that manages user interactions, gamification logic, and data storage. Integrated with **MongoDB** (via pymongo), it securely handles user progress, leaderboards, and dynamic language content, ensuring a seamless and responsive learning experience across all features.

## Badges

![React](https://img.shields.io/badge/React-JS%20Library-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Utility--First%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Enabled-brightgreen?logo=googlechrome&logoColor=white)
![Sarvam API](https://img.shields.io/badge/Sarvam%20API-Integration-blueviolet)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations%20Enabled-%23ff69b4?logo=framer&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://makeapullrequest.com)


## Features
1. **Player Progress & Leaderboard**:
   - Users earn points as they complete activities, which contributes to their ranking on a public leaderboard.
   - Progress is saved to personalize the learning experience.

2. **Dynamic Background Themes**:
The website theme changes based on the selected language, creating an immersive learning environment.

3. **Daily Exercise Section**:
   - Users receive new words daily with meanings, use-case examples, and pronunciation assistance.
   - Difficulty adjusts to the user’s points for each language, providing a customized learning experience.

4. **Story Mode**:
   - An interactive story is generated based on the user's points, presented in segments.
   - Users read aloud story sentences; pronunciation feedback is provided by "Gemini," the app’s evaluation tool.
   - Points are awarded for completed stories, with background images matching story themes to enhance engagement.

5. **Memory Game**:
   - A matching game with cards displaying words in the chosen language and their English translations.
   - Users earn points by correctly matching cards, reinforcing vocabulary through play.

6. **Exclusive Feature: Pixey**:
   - **Tongue Twister**: Generates a tongue twister in the selected language for pronunciation practice; feedback is provided by Gemini.
   - **Chatbot**: A conversational assistant for word meanings, phrases, and usage examples.
   - **Grammar Buddy**: Evaluates pronunciation of spoken words and provides usage examples.

7. **User Authentication**:
 Supports login and signup for personalized access to progress, scores, and settings.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **AI & APIs**: 
  - Sarvam API (Text-to-Speech)
  - Web Speech API (Browser-native Speech recognition)
  - Google Gemini AI (Generative content & feedback)
- **Animation**: Framer Motion

## Getting Started
### Prerequisites
- **Frontend**: Ensure **Node.js** and **npm** are installed.
- **Backend**: Ensure **Python 3.9+** is installed.

### Installation
Clone the repository:
   ```bash
   git clone https://github.com/melohub-xbit/LangStar.git
   ```
Go to the project directory

```bash
  cd LangStar
```
## Frontend setup
Make the .env file with following environment variables

```
VITE_SARVAM_API_KEY = "YOUR_SARVAM_API_KEY"
VITE_API_URL="http://localhost:8000"
VITE_HF="YOUR_HUGGINGFACE_ACCESS_TOKEN"
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```

### Frontend Testing

The project uses `vitest` for robust frontend testing. We verify:
1.  **Unit Tests**: All key components (DailyLearning, StoryMode, SignUp, etc.) are tested in isolation.
2.  **State Management**: We ensure user login/logout states are handled correctly.
3.  **Mocking**: External APIs (Backend, Sarvam, HuggingFace) are mocked to ensure reliable test runs.

**To run the tests:**

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Run the tests:
    ```bash
    npx vitest run
    ```

## Backend setup
To run the backend locally:

1. Navigate to the backend directory of the repo, install Python and the required packages:
   ```bash
   pip install -r requirements.txt
   ```
1.1. Make the .env file with the required environment variables, as specified in the `.env.example` file.
2. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

### Backend Testing

We use `pytest` for a comprehensive 3-layer testing strategy:

1.  **Unit Tests (`tests/unit`)**: Fast tests that rely on mocks. We test API routes, Database logic, and AI response parsing.
2.  **Live AI Tests (`tests/live`)**: Integration tests that allow you to verify your Google Gemini API key is working. These tests actually call Google to generate stories and flashcards.
3.  **Live Database Tests (`tests/live`)**: Verifies that your connection to MongoDB is working by creating and deleting a temporary test user.

**To run the tests:**

1.  **Run Fast Unit Tests** (Recommended for CI/CD):
    ```bash
    cd backend
    pytest tests/unit
    ```
2.  **Run Live Integration Tests** (Requires `.env` with valid keys):
    ```bash
    cd backend
    pytest tests/live
    ```

