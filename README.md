# Alwarid v2 (Next.js)

This repository now contains the Next.js version of Alwarid as the primary application.
The legacy static HTML/CSS/JS prototype was removed to keep a single source of truth.

## Stack

- Next.js 16 (App Router)
- React 19
- Three.js / React Three Fiber / Drei
- ESLint

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Main Routes

- `/` login
- `/search` patient search
- `/mode` mode selection
- `/dashboard` mode-aware dashboard (`?mode=urgence|consultation|suivi|transfert`)
- `/body_visualization` standalone 3D body visualization page

## API Routes

- `/api/ai` streams Mistral responses (requires `MISTRAL_API_KEY` in `.env.local`)
- `/api/ecg` ECG inference endpoint with offline fallback when Flask API is unavailable

## Quality Check

```bash
npm run build
```

Build should complete successfully before deployment.
