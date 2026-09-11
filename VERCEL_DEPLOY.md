# GameZone — نشر الموقع على Vercel

## 1) ارفع المشروع إلى GitHub
- أنشئ مستودعاً جديداً باسم `gamezone`.
- ارفع **محتويات هذا المجلد** إلى المستودع (وليس مجلد `gamezone_phase11` كطبقة إضافية إذا أردت أن يكون `package.json` في الجذر).

## 2) اربط GitHub مع Vercel
1. افتح Vercel وسجّل الدخول بحساب GitHub.
2. اختر **Add New → Project**.
3. اختر مستودع `gamezone`.
4. اترك Framework على **Next.js** والإعدادات الافتراضية.
5. اضغط **Deploy**.

Vercel يتعرف تلقائياً على Next.js ويستخدم إعدادات البناء المناسبة. لا تحتاج `vercel.json` لهذا المشروع.

## 3) أضف متغيرات Supabase
بعد إنشاء المشروع:
**Vercel → Project → Settings → Environment Variables**

أضف:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ضع نفس القيم الموجودة في مشروع Supabase الخاص بك، ثم اختر Production وPreview وDevelopment عند الحاجة.

## 4) قاعدة البيانات
داخل Supabase SQL Editor شغّل ملفات migrations بالترتيب:

1. `0002_phase1_hardening.sql`
2. `0003_phase2_games_rooms_chat.sql`
3. `0004_phase4_tournaments.sql`
4. `0005_phase5_brackets_rankings.sql`
5. `0006_phase6_social_notifications.sql`
6. `0007_phase10_hardening.sql`

لا تضع `SUPABASE_SERVICE_ROLE_KEY` في متغيرات `NEXT_PUBLIC_*` أو في كود المتصفح.

## 5) بعد النشر
بعد نجاح Build، Vercel يعطيك رابطاً من نوع:
`https://اسم-المشروع.vercel.app`

افتح الرابط من التلفون أو الكمبيوتر مباشرة.

## ملاحظة
النسخة دي Web Only: لا تحتاج Android Studio ولا Capacitor ولا إعداد تطبيق هاتف.
