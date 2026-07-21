# switch

2026-07-07 · swap propre · ✅ typecheck

## Changed
- `components/ui/switch.tsx` : Radix Switch → `@base-ui/react/switch`. Classes identiques (déjà en `data-checked`/`data-unchecked`, compatibles Base UI).

## Left alone
- Usage unique (anti-spoil) avec `onCheckedChange` : même API côté Base UI.

## Behavior changes
- Aucun attendu.

## Verify by hand
- Toggle anti-spoil dans le form de liste (état visuel + soumission).
