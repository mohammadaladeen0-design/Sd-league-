# GameZone — Final Setup

## 1) Install
```bash
npm install
cp .env.example .env.local
```
ضع `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY` من مشروع Supabase.

## 2) Database
في Supabase SQL Editor شغّل الملفات بالترتيب:
1. `supabase/schema.sql`
2. `supabase/migrations/0002_phase1_hardening.sql`
3. `supabase/migrations/0003_phase2_games_rooms_chat.sql`
4. `supabase/migrations/0004_phase4_tournaments.sql`
5. `supabase/migrations/0005_phase5_brackets_rankings.sql`
6. `supabase/migrations/0006_phase6_social_notifications.sql`
7. `supabase/migrations/0007_phase10_hardening.sql`

## 3) Run
```bash
npm run dev
```
وللإنتاج:
```bash
npm run build
npm start
```

## 4) Mobile
المشروع Mobile-first وفيه Web App Manifest. يمكن تثبيته كتطبيق من المتصفح.

## 5) Admin
بعد إنشاء حسابك، غيّر `profiles.role` إلى `admin` من Supabase SQL Editor فقط. لا تضع Service Role Key في الواجهة أو `.env` الذي يصل للمتصفح.

## ملاحظة الاختبار
الاعتماديات غير مثبتة داخل بيئة الإنشاء الحالية، لذلك لم يتم ادعاء أن `npm run build` أو `npm run typecheck` نجحا هنا. تم عمل مراجعة ثابتة وإصلاح أخطاء واضحة في المسارات، RLS usage، والغرفة والموبايل.
