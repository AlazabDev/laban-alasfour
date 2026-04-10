# Laban Al Asfour Storefront

واجهة متجر مبنية بـ `React + Vite + TypeScript` مع تكامل `Supabase` لإدارة المنتجات والفئات والملفات.

## المتطلبات

- `Node.js 20+`
- `npm 10+`

## التشغيل المحلي

1. أنشئ ملف البيئة المحلي:

```bash
cp .env.example .env
```

2. حدّث القيم المطلوبة داخل `.env`.

3. ثبّت الحزم وشغّل المشروع:

```bash
npm install
npm run dev
```

## أوامر العمل اليومية

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run check
```

`npm run check` هو أمر التحقق القياسي قبل أي دمج أو نشر.

## متغيرات البيئة

القيم الأساسية:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SITE_URL`
- `VITE_ASSET_BASE_URL`
- `VITE_APP_ENV`
- `VITE_ENABLE_ADMIN`

ملاحظات:

- مسار `/admin` معطّل افتراضياً. فعّله فقط عند الحاجة التشغيلية.
- تفعيل لوحة الإدارة لا يساوي وجود حماية فعلية. إذا كان المطلوب فتحها في الإنتاج، يجب إضافة مصادقة وصلاحيات قبل ذلك.
- لا تحفظ `.env` داخل Git. استخدم `.env.example` كمرجع فقط.
- الأصول ثلاثية الأبعاد وصور الكتالوج يجب أن تُخزن في bucket/CDN خارجي واحد، لا داخل GitHub.

## بنية المشروع

- `src/pages`: صفحات المتجر ولوحة الإدارة
- `src/components`: مكونات الواجهة
- `src/integrations/supabase`: العميل والأنواع المولدة
- `supabase/migrations`: ترحيلات قاعدة البيانات
- `docs/production-readiness.md`: قائمة التحقق قبل النشر الأولي

## سير العمل المقترح

1. أنشئ فرعاً لكل مهمة.
2. نفّذ `npm run check`.
3. راجع متغيرات البيئة وخطة النشر.
4. افتح Pull Request مع وصف مختصر للتغيير والأثر.

## النشر الأولي

راجع الملف التالي قبل أول إطلاق:

[`docs/production-readiness.md`](./docs/production-readiness.md)
