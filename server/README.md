# FitNotion Server (MERN backend)

Express + MongoDB (Mongoose) + JWT auth + OpenAI chat.

## Local development

```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm install
npm run dev
```

API runs on `http://localhost:5000`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | Long random string for JWT signing |
| `JWT_EXPIRES_IN` | no | Default `7d` |
| `OPENAI_API_KEY` | yes (for AI) | https://platform.openai.com/api-keys |
| `OPENAI_MODEL` | no | Default `gpt-4o-mini` |
| `CLIENT_ORIGIN` | yes | Comma-separated allowed CORS origins (your frontend URL) |
| `PORT` | no | Render sets this automatically |

## Deploy to Render

1. Push the `server/` folder to its own GitHub repo (or to a subfolder of your repo).
2. On https://render.com → **New → Web Service** → connect your repo.
3. Settings:
   - **Root Directory**: `server` (if you kept it as a subfolder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add the environment variables above.
5. Deploy. You'll get a URL like `https://fitnotion-api.onrender.com`.
6. In your Lovable frontend, set `VITE_API_URL` to that URL.

## API surface

```
POST   /api/auth/signup       { email, password, displayName? }
POST   /api/auth/login        { email, password }
GET    /api/me                (auth)
PATCH  /api/me                (auth) { displayName?, units? }

GET    /api/workouts          (auth) ?from&to&tag&q&limit
POST   /api/workouts          (auth)
PATCH  /api/workouts/:id      (auth)
DELETE /api/workouts/:id      (auth)

GET    /api/habits            (auth) ?from&to&limit
POST   /api/habits            (auth)
PATCH  /api/habits/:id        (auth)
DELETE /api/habits/:id        (auth)

GET    /api/body-stats        (auth) ?from&to&limit
POST   /api/body-stats        (auth)
PATCH  /api/body-stats/:id    (auth)
DELETE /api/body-stats/:id    (auth)

POST   /api/ai/chat           (auth) { messages: [{role,content}, ...] }
```

All authed routes require `Authorization: Bearer <jwt>`.