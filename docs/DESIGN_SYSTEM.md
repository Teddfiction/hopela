# DESIGN SYSTEM — Hopélà!

> Status: **seed**. The full design charter is being produced in Figma; this doc tracks how it lands in code.

---

## 1. Source of truth

Design tokens are **CSS variables** in `globals.css`, installed by the theme preset at bootstrap:

```bash
npx shadcn@latest init --preset b5dx8apGM --template next
```

---

## 2. Rules

1. Never hardcode colors, typography, spacing, or radii in components.
2. Consume tokens exclusively through Tailwind semantic classes (`bg-primary`, `text-muted-foreground`, `rounded-lg`, …).
3. All UI = Shadcn/ui components themed by these variables. **Restyling the app = editing tokens, never components.**

---

## 3. Figma → code workflow

1. Design or update the charter in Figma (palette, type scale, spacing, radii, shadows).
2. Map each decision to the corresponding Shadcn CSS variable.
3. Update `globals.css` (or regenerate the preset) — every component picks up the change automatically.
4. Document the token in §4.

---

## 4. Tokens

_To be completed after the Figma pass. Until then, the preset values in `globals.css` are authoritative._

| CSS variable | Role | Value |
|---|---|---|
| `--primary` / `--primary-foreground` | brand, main actions | from preset |
| `--background` / `--foreground` | surfaces, body text | from preset |
| `--muted` / `--muted-foreground` | secondary surfaces/text | from preset |
| `--destructive` | errors, deletions | from preset |
| `--radius` | corner radius scale | from preset |
| `--sidebar-*` | dashboard sidebar surfaces | from preset |

---

## 5. UI patterns (decided 2026-07-02)

Component-level conventions that go beyond tokens. Documented adaptations of Shadcn primitives are allowed ("adapt, don't fork"); anything else follows the golden rules.

| Pattern | Rule |
|---|---|
| **Cards** | `rounded-2xl` — adapted directly in `components/ui/card.tsx` so it propagates everywhere. |
| **Product images** | Always **3:4** (`aspect-[3/4]` + `object-cover`): gift rows, form previews, public gift cards. |
| **Owner forms in context** | **Dialog**, fullscreen on mobile via the shared classes in `components/hopela/dialog-fullscreen.ts` (add gift, list settings, edit gift). |
| **Light contextual actions** | **Popover** (e.g. share = URL + copy). AlertDialog is reserved for blocking confirmations. |
| **Row actions** | Icon buttons (`size="icon-sm"`) with Hugeicons + `sr-only` label (edit = Edit02, delete = Delete02 destructive). |
| **Dashboard navigation** | Single-column Sidebar, `collapsible="icon"` on desktop: brand header, "Mes listes" group (lists + badges + new-list item), user menu in the footer. Mobile: `SidebarTrigger` (SidebarLeftIcon) opens the Sheet; navigation closes it. No nested/dual sidebars — that pattern breaks in the mobile Sheet. |
| **Icons** | `@hugeicons/core-free-icons` via `HugeiconsIcon`, `data-icon="inline-start"` when leading a button label. |
