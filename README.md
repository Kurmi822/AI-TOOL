# AetherAI - AI-Powered Web3 Discovery Platform

AetherAI is a modern startup-style platform designed to help users discover, track, and analyze Web3 opportunities like airdrops, testnets, and NFT projects using artificial intelligence.

## Features

- **AI-Powered Insights**: Get concise summaries and trust scores for every project.
- **Web3 Discovery**: Explore a curated list of high-potential opportunities.
- **Smart Tracking**: Bookmark and track your progress across different blockchains.
- **AI Assistant**: A real-time chat assistant to help you find the best opportunities.
- **Modern UI**: Dark-themed, glassmorphism-inspired design with smooth animations.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend/Database**: Firebase (Firestore, Authentication).
- **AI**: Gemini AI (via `@google/genai`).

## Setup Instructions

1. **Firebase Configuration**:
   - The app uses `firebase-applet-config.json` for its configuration.
   - Security rules are defined in `firestore.rules`.
   
2. **Environment Variables**:
   - `GEMINI_API_KEY`: Required for AI features.
   
3. **Seeding Data**:
   - The app automatically seeds dummy data on the first run via `src/lib/seedData.ts`.

## Deployment

The app is ready for deployment on any static hosting provider (like Vercel or Netlify) or as a full-stack app on Cloud Run.

---
Built with ❤️ by AetherAI Team
