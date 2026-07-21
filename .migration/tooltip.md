# tooltip

2026-07-07 · swap propre · ✅ typecheck

## Changed
- `components/ui/tooltip.tsx` : Radix Tooltip → `@base-ui/react/tooltip` ; `delayDuration` → `delay` (défaut 0 conservé) ; Arrow avec positionnement par side.

## Left alone
- `TooltipProvider` dans `dashboard/layout.tsx` : aucun prop passé, rien à changer.

## Behavior changes
- Gestion du délai de groupe légèrement différente (Provider Base UI) — imperceptible avec delay 0.

## Verify by hand
- Tooltips sidebar en mode icône (collapsed), côté droit.
