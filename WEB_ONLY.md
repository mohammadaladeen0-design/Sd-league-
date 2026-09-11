# GameZone — Web Only

GameZone is a responsive web platform for gaming communities and tournaments.

## Scope
- Web browser only: desktop, tablet, and mobile browsers.
- No Android/iOS native build configuration is included.
- Supabase provides authentication, PostgreSQL, RLS, and realtime features.

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Apply Supabase migrations in filename order: `0002` → `0007`.
5. `npm run dev`
6. Production: `npm run build && npm start`.

## Deployment
The site can be deployed to a standard Next.js host such as Vercel. Keep the Supabase service-role key out of browser environment variables and out of source control.
