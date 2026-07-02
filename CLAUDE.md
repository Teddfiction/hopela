# CLAUDE.md — Hopélà!

Operating contract for AI-assisted development on this repo. Read this first, every session.
Companions: `docs/SPEC.md` (product + architecture) · `docs/DATA_MODEL.md` (schema + RLS) · `docs/DESIGN_SYSTEM.md` (design tokens — updated from Figma).

---

## 1. What this is

**Hopélà!** — an open web app to create and share gift lists. An organizer creates a list, adds gifts by pasting product links (URL → auto-unfurl), and shares a public link. Anyone can reserve a gift anonymously — anti-spoil by default. Standalone product: **no retailer or partner dependency**.

---

## 2. Bootstrap — canonical, single command

```bash
npx shadcn@latest init --preset b5dx8apGM --template next
```

Scaffolds the Next.js app **and** installs the Hopélà! theme preset (design tokens as CSS variables in `globals.css`). Never bootstrap via `create-next-app` + manual setup — the preset is the source of truth for theming.

---

## 3. Stack

```json
{
  "framework": "Next.js 15 (App Router, React Server Components)",
  "language": "TypeScript strict",
  "ui": "Shadcn/ui + Tailwind — strict, see golden rule 4",
  "data_auth": "Supabase (Postgres + RLS + Auth magic link)",
  "email": "React Email + Resend",
  "i18n": "next-intl (fr, en)",
  "hosting": "Vercel"
}
```

---

## 4. Golden rules (non-negotiable)

1. **Sensitive data is server-only.** `reserver_email` is never serialized to any client. `reserver_name` reaches the client only when the list's `anti_spoil = false`. Gift "reserved" state comes from `gift.status`, never the reservation row.
2. **RLS on every table.** `reservation` is fully locked to client keys (no anon/authenticated policies). The service-role key is server-only — never bundled, never in a client component.
3. **Validate everything.** Zod on every external input: form data, Server Action args, API route bodies.
4. **Shadcn/ui strictly.** Every UI element is a Shadcn/ui component — added via `npx shadcn@latest add <component>` — or a composition of them. **Never build a UI primitive from scratch with raw Tailwind.** Check the Shadcn registry before writing any component.
5. **Design tokens only.** Never hardcode colors/typography/spacing/radii. Consume the preset CSS variables through Tailwind semantic classes (`bg-primary`, `text-muted-foreground`, …). Tokens are updated from Figma via `globals.css` — see DESIGN_SYSTEM.md.

---

## 5. Server boundary — who calls?

- **Own UI → Server Action** (`lib/core/**/actions.ts`, `'use server'`): create/edit list, add gift, reserve.
- **External actor → API Route** (`app/api/`): email cancel links (a click in an email is a GET), Resend webhooks.

Both are equally strict server boundaries once Zod + RLS hold. Never write client→DB directly for reservations.

---

## 6. Conventions

- **TypeScript strict; `any` forbidden** — precise types, `unknown` + narrowing, or generics. No `@ts-ignore` without a one-line justification.
- **Server Components by default.** `'use client'` only where interactivity requires it; keep client components small and leaf-ward.
- **Data access:** Supabase clients split server/browser (`lib/db/`). Client components never query sensitive tables.
- **Components:** `components/ui/` = Shadcn primitives (CLI-installed, themed by the preset — adapt, don't fork). `components/hopela/` = domain components **composed exclusively of Shadcn primitives**. No domain logic in `ui/`.
- **i18n:** all user-facing copy through next-intl catalogues (`messages/`). No hardcoded strings. Locale drives date + currency formatting.
- **Migrations:** Supabase CLI, one per change, checked in. Never edit schema via the dashboard. Keep DATA_MODEL.md in sync.
- **Money:** `numeric(10,2)` + explicit `currency`. Never floats.
- **Naming:** files/folders kebab-case · components & types PascalCase · DB snake_case · functions/vars camelCase.

---

## 7. Folder structure

```
app/
  [locale]/(marketing)/        public landing
  [locale]/dashboard/          owner area (auth required)
  [locale]/list/[slug]/        public list view + reserve (no login)
  api/                         external/inbound surfaces (API routes)
lib/
  core/                        domain: lists, gifts, reservations (+ actions.ts)
  db/                          Supabase clients (server/browser), queries
  email/                       React Email templates + Resend sender
  i18n/                        next-intl config
components/ui/                 Shadcn primitives (themed)
components/hopela/             domain components
messages/                      translation JSON per locale
docs/                          SPEC, DATA_MODEL, DESIGN_SYSTEM
supabase/migrations/           SQL migrations
```

---

## 8. Scope guard

```json
{
  "v1_in": [
    "gift lists (create, edit, share)",
    "gifts via product URL + Open Graph unfurl",
    "public share link (no login to view/reserve)",
    "anonymous reservation (name + email)",
    "self-cancel via email link (never expires)",
    "anti-spoil toggle (default ON)",
    "magic-link auth for organizers",
    "i18n fr + en"
  ],
  "v1_out": [
    "third-party cancellation",
    "occasion types / per-occasion logic",
    "social login / passkeys",
    "private lists",
    "group gifting",
    "notifications",
    "image uploads",
    "categories / tags / comments",
    "wishlist import",
    "deadline logic",
    "custom admin UI",
    "retailer / partner integrations of any kind"
  ]
}
```

When in doubt about scope or a cross-cutting decision, **ask before building**.
