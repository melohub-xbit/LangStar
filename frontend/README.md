# Dialecto

> A pixel art themed language learning app with engaging interactive features, built with React, Tailwind CSS, and Sarvam API for text-to-speech translation.



## About the Project
**Dialecto** is a language learning platform designed with a pixel art aesthetic, aimed at making language acquisition fun and interactive. This project was developed using **React** and **Tailwind CSS**, leveraging **Sarvam API** for text-to-speech translation, and **Framer Motion** for smooth animations. Dialecto provides a variety of features, including story mode exercises, pronunciation checks, a memory game, and progress tracking, all while adapting to the user's chosen language.

## Badges

![React](https://img.shields.io/badge/React-JS%20Library-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Utility--First%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Enabled-brightgreen?logo=googlechrome&logoColor=white)
![Sarvam API](https://img.shields.io/badge/Sarvam%20API-Integration-blueviolet)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations%20Enabled-%23ff69b4?logo=framer&logoColor=white)


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

8. **About Us Page**:
Information about the creators, purpose, and technology behind Dialecto.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Text and Speech APIs**: Sarvam API (for text-to-speech functionality), Web Speech API (for speech-to-text and text-to-speech functionalities)
- **Animation**: Framer Motion (for smooth transitions and animations)

## Getting Started
### Prerequisites
- Ensure **Node.js** and **npm** are installed.

### Installation
Clone the repository:
   ```bash
   git clone https://github.com/CShah44/Dialecto.git
   ```
Go to the project directory

```bash
  cd Dialecto
```
Make the .env file with following environment variables

```
VITE_SARVAM_API_KEY = "YOUR_SARVAM_API_KEY"
VITE_API_URL=https://api.sarvam.com
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

## Backend Repository

[Dialecto-BK](https://github.com/melohub-xbit/DIALECTO-BK)
## Demo

https://youtu.be/celR6rwV5z8


### Note

Due to the free tier of render.com on which the backend is deployed, due to inactivity the deployment is shut down occasionally. So the requests might take quite longer than expected. We apologise for this, but we couldn't find a better option to deploy.

