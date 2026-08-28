# Interview AI Preparation Planner

Interview AI Preparation Planner is a full-stack AI-powered platform for preparing candidates for job applications and technical interviews. It compares a candidate's resume and self-description with a target job description, then generates an actionable interview preparation report.

## What The Project Does

The application helps a candidate or interviewer:

- Create an account and securely sign in.
- Upload a resume in PDF format.
- Add a target job description.
- Add an optional target company and culture prompt.
- Add an optional self-description with experience, personality, or interview context.
- Generate an AI-powered, company-aware candidate readiness report.
- Review technical and behavioral interview questions.
- Practice answers through an interactive AI interviewer chat inside every technical and behavioral question card.
- See the AI interviewer's follow-up questions, feedback, and guidance.
- Identify missing or weak skills and their severity.
- Follow a day-by-day preparation roadmap.
- Save and revisit previously generated reports.
- Generate and download an AI-tailored, ATS-friendly resume as a PDF.

## Main Features

### Authentication

- User registration with username, email, and password.
- Password hashing with `bcryptjs` before database storage.
- Login with email and password.
- JWT-based authentication stored in a cookie.
- Protected dashboard and report routes.
- Session restoration through the current-user endpoint.
- Logout that clears the cookie and blacklists the token.

### Resume And Job Analysis

- PDF resume upload using an in-memory Multer upload.
- Resume text extraction using `pdf-parse`.
- Job description input from the dashboard.
- Target company and culture alignment prompt from the dashboard.
- Optional candidate self-description input.
- Resume, job description, company prompt, and self-description are associated with the generated report.

### Retrieval-Augmented Generation (RAG)

The report generator uses RAG to add company-specific context to Gemini's response:

1. The user enters a target company or culture prompt.
2. Gemini converts that prompt into a 512-dimensional embedding.
3. MongoDB Atlas Vector Search queries the `company_embeddings` collection using the `company_vector_index` index.
4. The two most relevant company knowledge records are retrieved.
5. Retrieved company names and engineering context are added to the AI report prompt.
6. If no company prompt or vector match is available, report generation falls back to the job description and general industry guidance.

This grounds the generated match score, interview questions, skill gaps, and preparation plan in stored company knowledge instead of relying only on generic model output.

### AI Interview Report

Google Gemini generates a structured report containing:

- Job or report title.
- Candidate-to-job match score from 0 to 100.
- Five technical interview questions.
- Five behavioral interview questions.
- Interviewer intention for every question.
- Suggested answer guidelines for every question.
- Skill gaps with `low`, `medium`, or `high` severity.
- A minimum seven-day preparation plan.
- Daily preparation focus areas and practical tasks.

The response is requested as JSON and validated with a Zod schema before it is saved.

### Interactive Mock Interview Practice

Every technical and behavioral question card includes its own independent, collapsible mock interview practice area:

- Expand or close the practice chat with the `Practice answer` button.
- Send an answer or explanation from the input field.
- View alternating candidate and AI interviewer message bubbles.
- See an AI interviewer status indicator.
- See animated typing dots while Gemini generates a response.
- Receive concise, professional follow-up questions or feedback.
- Gemini evaluates the answer using the question, interviewer intention, suggested answer, resume, and job description.
- Persist conversation history for the individual report question in MongoDB.
- Continue the discussion separately for each technical or behavioral question.

### Report Library

- View all reports belonging to the authenticated user.
- Reports are sorted newest first.
- See report title, creation date, and match score.
- Open a report by its ID.
- User-specific report access prevents users from opening another user's report.

### Report Details

The report details page contains:

- Behavioral Questions section.
- Technical Questions section.
- Preparation Roadmap section.
- Match score panel.
- Skill gap panel with severity styling.
- Download Resume action.
- Per-question mock interview chat.

### AI Resume PDF Export

- Uses the stored resume, job description, and self-description as context.
- Gemini creates a tailored HTML resume.
- The generated resume is designed to be concise, professional, and ATS-friendly.
- Puppeteer converts the HTML into an A4 PDF.
- The browser downloads the PDF as `resume_<report-id>.pdf`.

### Company Knowledge Embeddings And RAG Data Pipeline

The backend includes a company knowledge data workflow:

- Company information is stored in `companydata.json`.
- Gemini creates 512-dimensional embeddings.
- Embeddings are stored in MongoDB's `company_embeddings` collection.
- The seed command replaces existing company embeddings before inserting fresh data.
- The report generation service retrieves relevant records through MongoDB Atlas `$vectorSearch`.
- RAG context is injected into the report-generation prompt as target company and culture context.
- The company prompt is submitted as part of `POST /api/interview/generate`.

### Health Monitoring

The backend exposes:

```text
GET /health
```

Successful response:

```json
{ "status": "ok" }
```

## Application Routes

### Frontend Routes

| Route | Access | Purpose |
|---|---|---|
| `/register` | Public | Create a user account |
| `/login` | Public | Sign in to the application |
| `/` | Protected | Generate reports and browse saved reports |
| `/interview/:interviewId` | Protected | View a complete interview report |

### Authentication API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Authenticate a user |
| `GET` | `/api/auth/logout` | Public | Clear and blacklist the session token |
| `GET` | `/api/auth/get-me` | Protected | Return the current user |

### Interview API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/interview/generate` | Protected | Upload a resume and generate a report |
| `GET` | `/api/interview/reports` | Protected | Return the user's reports |
| `GET` | `/api/interview/report/:interviewId` | Protected | Return one report |
| `POST` | `/api/interview/report/:interviewId/follow-up` | Protected | Submit an answer and receive AI follow-up feedback |
| `POST` | `/api/interview/resume/pdf/:interviewId` | Protected | Generate and download a tailored resume PDF |

The follow-up endpoint expects:

```json
{
  "questionType": "technical",
  "questionId": "question-subdocument-id",
  "answer": "The candidate's answer"
}
```

The report-generation request is multipart form data with these fields:

```text
resume          PDF file
jobDescription  Target job description
companyPrompt   Target company or culture context (optional)
selfDescription Candidate context (optional)
```

## Folder Structure

```text
GENAI-PROJECT/
├── README.md
├── Backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controller/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── file.middleware.js
│       ├── model/
│       │   ├── blacklist.model.js
│       │   ├── company.model.js
│       │   ├── interviewReport.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       ├── seed/
│       │   ├── companydata.json
│       │   └── seed.js
│       └── services/
│           ├── ai.services.js
│           └── temp.js
└── Frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vercel.json
    ├── vite.config.js
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── style.scss
        ├── assets/
        │   ├── hero.png
        │   ├── react.svg
        │   └── vite.svg
        ├── routes/
        │   └── app.router.jsx
        ├── style/
        │   └── button.style.scss
        └── features/
            ├── auth/
            │   ├── auth.context.jsx
            │   ├── components/
            │   │   └── Protected.jsx
            │   ├── hooks/
            │   │   └── useAuth.js
            │   ├── pages/
            │   │   ├── Login.jsx
            │   │   └── Register.jsx
            │   ├── services/
            │   │   └── auth.api.jsx
            │   └── style/
            │       └── auth.form.scss
            └── interview/
                ├── interview.context.jsx
                ├── hooks/
                │   ├── useInterview.js
                │   └── useSideNav.js
                ├── pages/
                │   ├── Home.jsx
                │   └── Report.jsx
                ├── services/
                │   └── interview.api.jsx
                └── styles/
                    ├── report.scss
                    └── style.scss
```

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Sass
- ESLint

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- Google Gemini via `@google/genai`
- JWT and cookie authentication
- `bcryptjs` password hashing
- Multer file uploads
- `pdf-parse` resume extraction
- Puppeteer PDF generation
- Zod response validation

## Local Setup

### Prerequisites

- Node.js 20 or newer recommended.
- MongoDB or MongoDB Atlas.
- Google Gemini API key.

### Backend Environment Variables

Create `Backend/.env`:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<long-random-secret>
GOOGLE_GENAI_API_KEY=<google-genai-api-key>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Install And Run The Backend

```powershell
cd Backend
npm ci
npm run dev
```

The API runs on `http://localhost:3000` by default.

### Install And Run The Frontend

Open a second terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

The Vite frontend runs on `http://localhost:5173` by default.

## Company Embedding Seed

To regenerate company embeddings:

```powershell
cd Backend
npm run seed
```

The command deletes existing company embeddings and creates new 512-dimensional Gemini embeddings. Run it only when replacing the current company knowledge data is intended.

## Available Scripts

### Backend

```text
npm run dev     Start the backend with Nodemon
npm start       Start the backend with Node.js
npm run seed    Generate and store company embeddings
```

### Frontend

```text
npm run dev     Start the Vite development server
npm run build   Create a production build
npm run lint    Run ESLint
npm run preview Preview the production build locally
```

## Deployment

The project can be deployed as two services:

- Backend API on Render or another Node.js hosting platform.
- Vite frontend on Vercel or another static hosting platform.

### Backend Deployment Settings

- Root directory: `Backend`
- Install command: `npm ci`
- Build command: not required
- Start command: `npm start`
- Health check: `/health`

Set `MONGO_URI`, `JWT_SECRET`, `GOOGLE_GENAI_API_KEY`, `FRONTEND_URL`, and `NODE_ENV=production` in the hosting provider's environment settings. The server uses the hosting provider's `PORT` when supplied.

### Frontend Deployment Settings

- Root directory: `Frontend`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

Configure the frontend API URL in `Frontend/.env` according to the deployment environment. Make sure the exact frontend origin is included in the backend `FRONTEND_URL` value so credentialed CORS requests work.

## Current Limitations And Future Work

- The backend currently parses PDF resume content; DOC and DOCX options should not be treated as supported until a document parser is added.
- The backend upload limit is 3 MB.
- `Job Matcher`, `Saved Profiles`, and `Settings` are currently navigation placeholders in the dashboard.
- Company-aware RAG is available during report generation; a separate company search page or standalone matcher endpoint is not currently implemented.
- Automated backend and frontend tests are not currently configured.
- Error handling and form validation can be expanded for production use.

## Project Goal

The goal is to turn a resume and a target opportunity into a practical preparation workflow: understand candidate fit, identify skill gaps, rehearse realistic questions, receive AI interviewer feedback, and follow a focused study plan.
