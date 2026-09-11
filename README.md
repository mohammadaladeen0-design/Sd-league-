# Gaming Platform — Phase 1

Community & tournaments platform for mobile gamers (FC Mobile, eFootball, COD Mobile, PUBG Mobile, and more via the admin panel later).

**Phase 1 scope (this delivery):** project architecture, Next.js + TypeScript + Tailwind setup, Supabase integration, database schema, authentication (register, login, email verification, unique username), and profile page.

Not included yet (later phases): games catalog, rooms, room chat, tournaments, matches, notifications, admin panel UI.

---

## 1. Install

Requires Node.js 18.18+ and a Supabase account (free tier is fine).

```bash
cd gaming-platform
npm install
```

## 2. Create the Supabase project

1. Go to https://supabase.com/dashboard → **New project**.
2. Once it's provisioned, open **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this one secret — server-side only, never in the browser)
3. Open **Authentication → Providers → Email** and make sure **Confirm email** is turned ON (this is what makes email verification mandatory before login).
4. Open **Authentication → URL Configuration** and set:
   - **Site URL**: `http://localhost:3000` (change to your real domain when you deploy)
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` (and your production equivalent later)

## 3. Run the database schema

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` and run it.
3. This creates:
   - the `user_role` enum (`user`, `moderator`, `admin`)
   - the `profiles` table (case-insensitive unique `username`, `role`, `is_email_verified`, timestamps)
   - a trigger that auto-creates a `profiles` row whenever someone signs up
   - a trigger that flips `is_email_verified` to `true` once the user clicks the verification link
   - Row Level Security policies so:
     - anyone can **read** profiles (needed for public player pages later)
     - a user can only **update their own** profile, and can't change their own `role`
     - profile rows can only be **created** by the trigger, never directly by a client
     - only admins can **delete** a profile
   - a `username_availability` view used by the register page to give a fast "username taken" check before submitting

## 4. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is not used by any client-side code in Phase 1 — it's reserved for future server-only admin actions (e.g. banning a user). It is never imported into anything under `"use client"`.

## 5. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

Flow to test:
1. `/register` → create an account with a username, email, password.
2. Supabase sends a verification email to that address.
3. Click the link → it hits `/auth/callback`, exchanges the code for a session, and redirects to `/profile`.
4. If you try `/login` before verifying, you're told to verify first and sent to `/verify-email`, where you can resend the email.
5. `/profile` shows your username, email, role, verification status, and join date — pulled from the `profiles` table under RLS.

## 6. Project structure

```
gaming-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── auth/callback/route.ts     # exchanges email-link code for a session
│   │   ├── profile/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # landing page
│   │   └── globals.css
│   ├── lib/supabase/
│   │   ├── client.ts                  # browser client (anon key)
│   │   ├── server.ts                  # server client (Server Components/Actions)
│   │   └── middleware.ts              # session refresh + route protection
│   ├── middleware.ts
│   └── types/database.types.ts
├── supabase/schema.sql
├── tailwind.config.ts
├── next.config.mjs
└── .env.local.example
```

Routes like `/games`, `/rooms`, `/tournaments`, `/players`, `/notifications`, and `/admin` are reserved in the architecture but intentionally not built yet — they're gated by `src/lib/supabase/middleware.ts` so unauthenticated users are already redirected to `/login` if they try to visit `/rooms`, `/tournaments`, etc. once those pages exist.

## 7. Security notes for Phase 1

- Passwords are never touched by application code — Supabase Auth handles hashing and storage entirely.
- The `service_role` key stays in `.env.local` (gitignored) and is not referenced by any browser-bundled code.
- Username uniqueness is enforced at the database level (case-insensitive unique index), not just in the UI — the client-side check in `/register` is only a fast-feedback convenience.
- RLS is enabled on `profiles` from the first migration, not added later.
- A user cannot escalate their own `role` — the update policy checks that `role` is unchanged.

---

**Stopping point:** this is the end of Phase 1. Test the register → verify → login → profile flow end-to-end before moving on to Phase 2 (games catalog, rooms, room chat).
