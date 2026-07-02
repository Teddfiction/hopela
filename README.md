# Hopélà! 🎁

An open web app to create and share gift lists — birth, wedding, birthday, anything. Paste product links, share a public URL, and let friends and family reserve gifts anonymously. Anti-spoil by default: no duplicate purchases, no spoiled surprises.

**Standalone product** — no retailer or partner dependency.

## Stack

Next.js 15 (App Router, RSC) · TypeScript strict · Shadcn/ui + Tailwind 4 · Supabase (Postgres + RLS + magic-link auth) · React Email + Resend · next-intl (fr, en) · Vercel.

Project rules and architecture live in [`CLAUDE.md`](./CLAUDE.md), [`docs/SPEC.md`](./docs/SPEC.md), [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) and [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md).

## Getting started

### 1. Install

```bash
npm install
```

### 2. Supabase

1. Create a project at [database.new](https://database.new).
2. Apply the migrations (Supabase CLI):

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

3. In **Authentication → URL Configuration**, set the Site URL and add
   `http://localhost:3000/api/auth/callback` to the redirect allow list.

### 3. Resend

Create an API key at [resend.com](https://resend.com). While testing you can send from `onboarding@resend.dev`; verify your own domain for production.

### 4. Environment

```bash
cp .env.example .env.local
```

Fill in the Supabase URL/keys, the Resend key and `NEXT_PUBLIC_SITE_URL`.

### 5. Run

```bash
npm run dev
```

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Security model (summary)

RLS is enabled on every table; the `reservation` table has **zero** client policies — reservation reads/writes only happen server-side with the service role. `reserver_email` is never serialized to any client, and `reserver_name` only when the list owner disabled anti-spoil. See `docs/DATA_MODEL.md §4`.
