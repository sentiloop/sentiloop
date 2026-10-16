# Sentiloop database setup

The authentication backend now uses PostgreSQL instead of the in-memory demo store.

## Required environment variables

Add these to the Vercel project for the environments you deploy:

- `DATABASE_URL` — PostgreSQL connection string from Vercel Postgres, Neon, or another PostgreSQL provider.
- `AUTH_SECRET` — a long random value used by Auth.js/NextAuth for signed sessions.

Optional:

- `DATABASE_SSL=disable` only for a local PostgreSQL instance without TLS. Leave it unset or set it to `require` in Vercel.

## Initialize the schema

From the repository root, after `DATABASE_URL` is available:

```bash
npm ci
npm run db:migrate
```

The application also runs the same additive, idempotent schema initialization on its first database request, so a cold start can recover if the migration command was not run separately.

## What is persisted

The `users` table stores credentials, profile details, roles, email verification state, password-reset tokens, OTP state, and OAuth provider identity. Passwords remain bcrypt-hashed; the database connection is server-only.

Email delivery for verification, reset links, and OTPs is not configured by this change. The generated tokens are currently logged by the server until an email provider is connected.
