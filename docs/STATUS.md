# STATUS — Hopélà!

> Current state + changelog. **Read this first every session, update it before ending one.**
> Newest entries on top. Keep entries short: what changed, why, what's next.

---

## Current state

**V1 feature-complete, not yet deployed.** Code on GitHub (`teddfiction/hopela`, branch `main`). Supabase project `hopela` live (eu-west-3) with schema + RLS migrations applied.

### Remaining before launch

- [ ] Test manuel post-migration Base UI (checklists dans `.migration/*.md`) (Tedd)
- [ ] Paste `service_role` key into `.env.local` (Tedd)
- [ ] Configure Supabase Auth redirect URLs
- [ ] Resend API key + domain
- [ ] Commit/push migration 003 if not done
- [ ] Deploy to Vercel (`NEXT_PUBLIC_SITE_URL`, env vars)
- [ ] RGPD pass (see SPEC §8 — post-V1)

### Working agreements

- Sessions may alternate between **Cowork** (product/design/docs) and **Claude Code** (implementation). This file is the handoff between them — conversation history does not transfer.
- Commands better run on Tedd's machine (`npx shadcn add`, `npm run build`, git): propose the command and let Tedd run it.

---

## Decisions log

| Date | Decision |
|---|---|
| 2026-07-07 | **Migration Radix UI → Base UI** (shadcn a fait de Base UI le défaut, changelog juillet 2026). Style registry `radix-luma` → `base-luma`, dep `radix-ui` → `@base-ui/react`. Migration full-project en une passe (pré-prod = moment le moins cher). Rapports par composant dans `.migration/`. |
| 2026-07-02 | List editor actions use **Dialog** (add gift, settings — fullscreen on mobile via `components/hopela/dialog-fullscreen.ts`) and **Popover** for share. AlertDialog rejected: reserved for blocking confirmations. |
| 2026-07-02 | Dashboard navigation = **single-column sidebar** (`collapsible="icon"`), replaces the top header. User menu in the sidebar footer (email, FR/EN submenu, sign out). ~~sidebar-09 dual-rail~~ rejected after trial: its `flex-row` nesting breaks in the mobile Sheet (className dropped) and the icon rail added no value for a single nav section. |
| 2026-07-02 | **Product images are 3:4** everywhere (gift row, form preview, public card). |
| 2026-07-02 | **Card radius lowered to `rounded-2xl`** (adapted in `components/ui/card.tsx`). |
| 2026-07-02 | OG unfurl resolves relative `og:image` against the final response URL (http/https only). |

---

## Changelog

### 2026-07-21 — Vérification migration Base UI + validation locale (Mac)

- Skills officiels shadcn installés (`npx skills add shadcn/ui`) : `shadcn` + `migrate-radix-to-base` dans `.agents/skills/`, verrouillés par `skills-lock.json`.
- Audit de conformité des 11 wrappers migrés contre le registre officiel `base-luma` (`https://ui.shadcn.com/r/styles/base-luma/<c>.json`) : **aucune divergence structurelle**. Seules différences : résolution normale des `IconPlaceholder` → Hugeicons, alias d'imports, et les `data-variant`/`data-size` ajoutés sur `button` (customisation conservée).
- Balayage restes Radix (`radix-ui`, `@radix-ui`, `--radix-*`, `asChild`, `onSelect`) sur `app/`, `components/`, `lib/`, `hooks/` : propre. Consommateurs tous sur `render={<El/>}`.
- Réparé `node_modules/next` corrompu (Next 15.5.20 installé sans ses `.d.ts` — cause des TS7016) : réinstallation → 1446 `.d.ts`. Supprimé `.next` pollué de doublons macOS (`* 2.*`) qui cassaient `tsc`.
- Validé sur le Mac : `tsc --noEmit` ✅ · `eslint .` ✅ · `npm run build` (Turbopack) ✅ (15 pages). Reste : test manuel + commit.

### 2026-07-07 — Migration Base UI (Radix → Base)

- 11 composants ui/ réécrits depuis le registry `base-luma` : button, badge, dialog, sheet, dropdown-menu, popover, tooltip, switch, label, separator, sidebar. Aucun n'avait de custom locale (card, non-Radix, garde son rounded-2xl).
- Code app : `asChild` → `render={<El/>}` (16 fichiers), `onSelect` → `onClick` (sign out), `--radix-*` → `--anchor-width`/`--transform-origin`.
- Config : `components.json` style `base-luma` ; `package.json` `@base-ui/react@^1.6.0` (remplace `radix-ui`).
- Vérifié en sandbox : `tsc --noEmit` ✅, `eslint .` ✅. Build + test manuel à faire sur le Mac (checklists `.migration/*.md`).

### 2026-07-02 — Sidebar simplified + submenu fix + gift order

- Sidebar nav reduced to two static entries: "Nouvelle liste" (first) then "Mes listes" → `/dashboard`. Lists are no longer enumerated in the sidebar (redundant with the "Mes listes" page); `DashboardSidebar` no longer takes a `lists` prop and the dashboard layout no longer calls `getMyLists`.
- `DropdownMenuSubContent` now renders inside a Radix `Portal` — the language submenu was clipped by the parent dropdown's `overflow-hidden`.
- Gifts are ordered newest-first (`created_at desc`) in `getOwnedList` and `getPublicList` (`position` still wins when set; it is currently never written).
- Desktop `SidebarTrigger` added top-left of the main area (`SidebarInset`) to collapse the sidebar to icon mode; mobile keeps its header trigger.

### 2026-07-02 — Sidebar refactor (mobile fix)

- Dual-rail (sidebar-09) composition broke on mobile: panels stacked vertically in the Sheet, user dropdown opened off-screen. Root cause: the `Sidebar` primitive drops the outer `className` (`flex-row`) in its mobile Sheet branch — limitation of the block pattern itself.
- Rebuilt `dashboard-sidebar.tsx` as a **single-column sidebar**, `collapsible="icon"` on desktop: header brand, group "Mes listes" (lists + gift-count badges + "Nouvelle liste"), footer user dropdown (`side="top"` on mobile, `"right"` on desktop), `SidebarRail`.
- Layout: removed the 20rem width override (default 16rem).

### 2026-07-02 — Dashboard navigation: sidebar

- Installed `sidebar`, `sheet`, `tooltip` primitives + `hooks/use-mobile` (radix-luma registry).
- `components/hopela/dashboard-sidebar.tsx`: icon rail (brand, "Mes listes") + lists panel (emoji, title, gift count, active state, `+` → `/dashboard/new`).
- Footer user dropdown: email label · language submenu (FR/EN radio) · destructive sign-out. Replaces `user-menu.tsx` (deleted).
- Dashboard layout: `TooltipProvider > SidebarProvider > DashboardSidebar + SidebarInset`; mobile header with `SidebarTrigger` (SidebarLeftIcon). Mobile sheet shows both panels and closes on navigation.

### 2026-07-02 — List editor rework

- `/dashboard/lists/[id]` simplified to one column: title → actions row (Add gift · Share · View public · Settings) → gifts.
- Add gift + settings became **Dialogs** (shared fullscreen-mobile classes); share became a **Popover** with `CopyButton`; "View public" is an outline button with EyeIcon. Dedicated pages `/settings` and `/gifts/new` removed.
- `ListFormState` gained an `updated` status → success toast + dialog close (`listForm.updated` i18n key).
- Gift rows: edit/delete are icon buttons (Edit02/Delete02), wrap cleanly on small screens.
- Product images 3:4; card radius 2xl; unfurl `og:image` fix (relative → absolute).

### 2026-07-02 — V1 baseline

- Full V1 pushed to GitHub (7 commits): lists, gifts (OG unfurl), public share + anonymous reservation, anti-spoil, magic-link auth, cancel-by-email, i18n fr/en, React Email + Resend wiring.
- Supabase: 3 migrations applied (schema, RLS, hardening). `.env.local` created with URL + anon key.
