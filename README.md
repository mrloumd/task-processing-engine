# QueueWorks — Task Processing Engine

An async task processing platform built with NestJS, BullMQ, MongoDB, and Next.js. Submit tasks, watch them move through the queue in real time, and inspect results and activity logs.

## Features

- Submit tasks (File Processing, Report Generation, AI Analysis)
- Real-time queue visualization with live status polling
- Task detail view with status stepper, progress bar, and activity log
- Retry and cancel support
- Metrics dashboard (total, by status, by type, success rate)
- Contact form with email via Nodemailer

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, Tailwind CSS, TanStack Query |
| Backend | NestJS, BullMQ, Mongoose |
| Queue | Redis (BullMQ) |
| Database | MongoDB Atlas |
| Monorepo | Turborepo + npm workspaces |

## Project Structure

```
task-processing-engine/
├── apps/
│   ├── client/        # Next.js frontend
│   └── server/        # NestJS API + BullMQ worker
└── packages/
    └── shared/        # Shared TypeScript types
```

## Local Development

```bash
# Install dependencies from repo root
npm install

# Run both apps concurrently
npm run dev

# Client → http://localhost:3000
# Server → http://localhost:3001/api
# Swagger → http://localhost:3001/api-docs
```

Requires a running Redis instance and a `.env` file in `apps/server/`:

```env
PORT=3001
REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=your_db_name
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
CLIENT_URL=http://localhost:3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List tasks (paginated, filterable) |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `PATCH` | `/api/tasks/:id/retry` | Retry a failed task |
| `PATCH` | `/api/tasks/:id/cancel` | Cancel a pending/queued task |
| `GET` | `/api/metrics/summary` | Metrics summary |
| `POST` | `/api/contact` | Send contact form email |

## Task Types

| Type | Description |
|------|-------------|
| `file-processing` | Simulates multi-stage file parsing and extraction |
| `report-generation` | Simulates PDF report building with charts |
| `ai-analysis` | Simulates NLP inference and entity extraction |

## Deployment

| Service | Platform |
|---------|----------|
| Client (Next.js) | Vercel |
| Server (NestJS) | Railway |
| Redis | Railway Redis |
| MongoDB | MongoDB Atlas |

**Railway** — set Root Directory to `apps/server`, Build Command to `npm run build`, Start Command to `node dist/main.js`.

**Vercel** — set Root Directory to `apps/client`, Build Command to `cd ../.. && npx turbo run build --filter=client...`, Install Command to `cd ../.. && npm install`.
