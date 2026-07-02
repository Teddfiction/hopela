# SPEC — Hopélà!

> Single source for **what** Hopélà! is and **how** it's built.
> Schema + RLS: `DATA_MODEL.md` · Dev rules: `CLAUDE.md` · Tokens: `DESIGN_SYSTEM.md`.

---

## 1. Product

**Hopélà!** is an open, standalone web app for gift lists — birth, wedding, birthday, anything. Anyone creates a list, adds gifts by pasting product links, and shares a public URL. Friends and family reserve gifts anonymously: no duplicate purchases, no spoiled surprises.

- **Problem:** coordinating gifts is chaotic — duplicates, spoilers, no shared source of truth.
- **Positioning:** retailer-agnostic (any merchant URL works), own brand and infra, no partner dependency.

### Users

| Role | Access | Can |
|---|---|---|
| **Organizer** | magic-link account (email, passwordless) | create/edit lists & gifts, share, toggle anti-spoil |
| **Contributor** | none — name + email at reservation time | view a public list, reserve, cancel own reservation |
| **Admin (internal)** | Supabase dashboard / SQL | monitor usage — no custom UI |

---

## 2. Features (V1)

### Lists
An organizer owns 0..N lists. Fields: **title** (required), emoji, description (markdown), event_date (informational only — no deadline logic), cover_image (predefined gallery, no upload), public_slug (unique, auto-generated), **anti_spoil** (default ON). Lists never expire; the owner can edit anytime, even after sharing.

### Gifts
A list holds 0..N gifts. **URL-first:** paste a product link → Open Graph unfurl pre-fills title, description, price, image. Partial or failed unfurl → notice + manual entry. Everything is overridable. Fields: url, **title** (required), description, price (`numeric(10,2)`), currency, image_url, is_top_priority, **status** (`available` | `reserved`, synced by DB trigger), position.

### Sharing
Public URL `/list/[slug]` — no login to view or reserve.

### Reservation (anonymous)
Reserve an available gift → modal: **name** (free text, unverified) + **email** (required) → gift becomes `reserved` → confirmation email with a **cancel link** (never expires). Cancel link → confirm → reservation deleted, gift back to `available`.

### Anti-spoil (per-list toggle, default ON)
- **ON:** organizer sees "Reserved" without the name; reserved gifts hidden from other contributors.
- **OFF:** everyone sees "Reserved by [name]".
- `reserver_email` is never exposed client-side, in any mode.

### i18n
next-intl, locales `fr` + `en`. All copy in message catalogues; locale drives date and currency formatting.

---

## 3. Business rules

```json
{
  "auth": "magic link only — Supabase is the session authority",
  "account_to_reserve": false,
  "reservations_per_gift": 1,
  "anti_spoil_default": true,
  "cancel_link_expiry": "never",
  "list_expiry": "never",
  "edit_after_share": true,
  "name_verification": false,
  "duplicate_email_check": false,
  "deadline_logic": false,
  "locales": ["fr", "en"]
}
```

---

## 4. Key flows

1. **Create:** magic-link login → new list → details → add gifts (URL unfurl) → share link.
2. **Reserve:** open link → pick gift → name + email → confirmation email.
3. **Cancel:** cancel link in email → confirm → gift available again.

---

## 5. Architecture

### Principles
1. **Autonomous** — no retailer, partner, or external identity dependency. Everything works end-to-end on its own stack.
2. **Secure by default** — sensitive data server-only, mutations behind server boundaries, RLS on every table.
3. **Simple & reversible** — lightest structure that works; vendor concerns stay at the edges (`lib/db/`, `lib/email/`) so a swap never touches domain logic in `lib/core/`.

### Trust rules

| Concern | Rule |
|---|---|
| Rendering | Server Components by default; `'use client'` only for interactivity |
| Public reads | server-side; anti-spoil filtering applied **before** data leaves the server |
| Mutations from own UI | **Server Actions** (typed end-to-end) |
| Inbound external calls | **API Routes** (email cancel links, Resend webhooks) |
| `reserver_email` | never client-bound |
| `reserver_name` | client-bound only when `anti_spoil = false` |
| RLS | every table; `reservation` fully locked to client keys |
| Validation | Zod on every external input |

Anti-spoil is enforced at **two layers**: RLS (reservation table locked) **and** server serialization. A client can never request another contributor's reservation data.

### Stack & bootstrap
Stack table: see `CLAUDE.md §3`. Bootstrap (app + theme preset, one command):

```bash
npx shadcn@latest init --preset b5dx8apGM --template next
```

UI is built **strictly from Shadcn/ui components**, themed by the preset's design tokens (CSS variables). Folder structure: see `CLAUDE.md §7`.

---

## 6. Success metrics (Supabase SQL)

Activation (% users with a list holding ≥1 gift) · Engagement (avg gifts/list) · Adoption (% lists with ≥1 reservation) · Retention (% users with >1 list).

---

## 7. Out of scope (V1)

```json
[
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
```

---

## 8. Deferred

- **RGPD** — contributor PII (emails) on Supabase/Vercel: retention, consent, data residency. Study post-V1 — blocks wide distribution, not prototyping.
- **Design charter** — produced in Figma, then folded into the theme preset tokens (`DESIGN_SYSTEM.md`).
