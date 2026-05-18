# Ask AI Better

A Next.js prompt builder for students. Sign in, build clear AI prompts with guided fields, and keep your own history in a sidebar.

## How it works

1. Enter your **topic**
2. Tap a **task** (explain, quiz, outline, etc.)
3. Choose your **level** and **output format**
4. Tap **Copy & save prompt** and paste into your AI chat

## Stack

- **Next.js 15** + **Tailwind CSS**
- **NextAuth.js** — email & password (credentials)
- **Prisma** — SQLite locally, PostgreSQL on Vercel

## Local setup

```bash
npm install
cp .env.example .env   # if needed
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → create an account → start building prompts.

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `file:./dev.db` for SQLite (default) |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random string ([generate one](https://generate-secret.vercel.app/32)) |

## Deploy to Vercel (PostgreSQL)

1. Create a [Vercel Postgres](https://vercel.com/storage/postgres) (or Neon) database.
2. Copy `prisma/schema.postgresql.prisma` → `prisma/schema.prisma` (change `provider` to `postgresql`).
3. Set env vars in Vercel:
   - `DATABASE_URL` — Postgres connection string
   - `NEXTAUTH_URL` — `https://your-app.vercel.app`
   - `NEXTAUTH_SECRET` — production secret
4. Deploy — `vercel.json` runs `prisma db push` on build.

## Features

- Guided fields: topic, task, level, output format
- **Copy & save** — prompts stored per user
- **Sidebar history** — revisit, reload, or delete past prompts
- Responsive layout with mobile history drawer

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:studio` | Open Prisma Studio |

## Tips for students

- Be specific with your topic
- Ask for one thing at a time
- Double-check facts for assignments — AI can make mistakes

## Legacy static version

The original single-file app is at `index.html` (no auth or database).
