# Tamagotchi App

A virtual pet game built with React, TypeScript, and Vite. Raise your pet from egg to adult, keep it happy and healthy, and unlock achievements along the way.

## Features

- **Pet lifecycle** — egg → baby → child → teen → adult with automatic evolution
- **Stats system** — hunger, happiness, energy, cleanliness, health, and discipline
- **Actions** — feed, play, clean, sleep/wake, heal, discipline
- **Random events** — surprise moments like sickness, poop, and mood swings
- **Mini-games** — play games to boost happiness and earn XP
- **Achievements** — unlock badges for milestones and streaks
- **XP and leveling** — earn experience through care actions
- **Health sync** — connect Google Fit to map real-world activity to pet stats
- **Avatar upload** — set a custom image as your pet
- **Themes and skins** — customize the shell appearance
- **Sound effects** — toggle audio feedback
- **Persistent state** — game saves automatically to localStorage

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- Vercel (hosting + serverless API routes)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

Deployed on Vercel. Push to `main` to trigger a new deployment.

## API Routes

- `/api/generate-avatar` — AI-generated pet avatar
- `/api/google-fit-token` — Google Fit OAuth token exchange
