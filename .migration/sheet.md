# sheet

2026-07-07 · swap propre (fichier stock) · ✅ typecheck

## Changed
- `components/ui/sheet.tsx` : Dialog Radix → Dialog Base UI. Animations : `animate-in/out` → transitions `data-starting-style`/`data-ending-style` (pattern base-luma).

## Left alone
- Aucun usage direct hors branche mobile de `ui/sidebar.tsx`.

## Behavior changes
- Entrée/sortie en transition CSS (translate 2.5rem + fade, 200ms) au lieu du slide keyframe — rendu très proche.

## Verify by hand
- Sidebar mobile : ouverture via trigger header, fermeture à la navigation et clic backdrop.
