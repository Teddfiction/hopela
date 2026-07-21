# badge

2026-07-07 · swap propre · ✅ typecheck

## Changed
- `components/ui/badge.tsx` : `Slot`/`asChild` → `useRender` + `mergeProps` (`@base-ui/react/use-render`), prop `render`.

## Left alone
- `badgeVariants` inchangé ; usage unique (compteur cadeaux, sans asChild).

## Behavior changes
- `data-slot`/`data-variant` désormais émis via le state useRender — mêmes attributs DOM.

## Verify by hand
- Badge compteur sur les cards de listes.
