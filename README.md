# Interview-AI-Preparation-Planner

- I built a full-stack AI-powered job preparation platform to solve a problem that i personally faced so I created a system that analyzes a resume against a job description, finds the skill gaps, and generates personalized guidance to help the user prepare better for applications and interviews.

## Local Development

The backend requires these environment variables in `Backend/.env`:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<long-random-secret>
GOOGLE_GENAI_API_KEY=<google-genai-api-key>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the applications in separate terminals:

```powershell
cd Backend
npm ci
npm run dev
```

```powershell
cd Frontend
npm ci
npm run dev
```

The API listens on port `3000` locally and exposes `GET /health` for a basic status check.

## MongoDB Atlas Setup

The production API uses MongoDB Atlas. Create a database user, allow the Render service to connect in Network Access, and set `MONGO_URI` in Render. Before using company-specific context, create an Atlas Vector Search index named `company_vector_index` on the `company_embeddings` collection. It must index the `embedding` field with 512 dimensions using the similarity configuration required by the `$vectorSearch` query.

Seed company embeddings after the vector index and Gemini API key are ready:

```powershell
cd Backend
npm run seed
```

The seed command replaces the existing company embeddings, so run it only when that replacement is intentional.

## Deployment

The recommended deployment uses a Render Web Service for the API and a Vercel project for the Vite frontend.

### Render API

Create a Web Service connected to this repository with:

- Root directory: `Backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/health`

Set these Render environment variables:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<long-random-secret>
GOOGLE_GENAI_API_KEY=<google-genai-api-key>
FRONTEND_URL=https://<your-vercel-domain>
NODE_ENV=production
```

Do not set `PORT` manually. Render provides it and the server reads it from the environment. The backend uses Puppeteer for PDF export and Gemini for report generation; choose an instance with enough memory and request time for those operations.

### Vercel Frontend

Create a Vercel project connected to this repository with:

- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Set this Vercel production environment variable:

```env
VITE_API_URL=https://<your-render-service>.onrender.com
```

The `Frontend/vercel.json` rewrite keeps React Router routes working when a page is refreshed directly. After Vercel assigns the final domain, copy that exact HTTPS origin into Render's `FRONTEND_URL` and redeploy the API.

## Post-deployment Checks

1. Open `https://<your-render-service>.onrender.com/health` and confirm it returns `{ "status": "ok" }`.
2. Register and log in from the Vercel domain.
3. Refresh the protected home page and confirm the session remains active.
4. Generate a report from a PDF smaller than 3 MB.
5. Open a report, use a follow-up question, and export the resume PDF.
6. Refresh `/login`, `/register`, and `/interview/<id>` directly.

If authentication fails, first check that `FRONTEND_URL` exactly matches the Vercel origin, `NODE_ENV` is `production`, and the browser request has `withCredentials` enabled. If report generation fails, inspect Render logs for MongoDB Atlas access, Gemini quota, and Puppeteer/Chromium errors.