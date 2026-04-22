# FitNotion — MERN setup

This project has two parts:

- **`server/`** — Express + MongoDB + JWT + OpenAI backend (deploy to Render)
- **frontend** (this Lovable project) — React + Vite UI that talks to the backend

## 1. Run / deploy the backend

See [`server/README.md`](./server/README.md) for full instructions. TL;DR:

1. Push the `server/` folder to a GitHub repo.
2. Create a free MongoDB Atlas cluster → grab the connection string.
3. Get an OpenAI API key from https://platform.openai.com/api-keys.
4. Create a Render Web Service pointing at the repo, root `server/`, build `npm install`, start `npm start`.
5. Add env vars on Render: `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_ORIGIN` (your Lovable preview/published URL).
6. Copy the Render URL (e.g. `https://fitnotion-api.onrender.com`).

## 2. Connect the frontend

In Lovable, set the env var:

```
VITE_API_URL=https://fitnotion-api.onrender.com
```

(Project Settings → Environment Variables.) Restart the preview. Sign up, and you're in.

## Local dev

```bash
# Terminal 1 — backend
cd server
cp .env.example .env  # fill in values
npm install && npm run dev

# Terminal 2 — frontend
# in the project root (this folder)
# create a .env.local with: VITE_API_URL=http://localhost:5000
npm install && npm run dev
```