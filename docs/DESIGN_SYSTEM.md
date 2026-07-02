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
