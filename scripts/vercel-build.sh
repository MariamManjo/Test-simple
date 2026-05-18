#!/bin/sh
set -e

# Production: PostgreSQL schema (local dev keeps sqlite in prisma/schema.prisma)
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Prisma integration may use STORAGE_URL instead of DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  DATABASE_URL="${STORAGE_URL:-${POSTGRES_URL:-${PRISMA_DATABASE_URL}}}"
  export DATABASE_URL
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: Set DATABASE_URL in Vercel (or connect Prisma Postgres to this project)."
  exit 1
fi

npx prisma generate
npx prisma db push
next build
