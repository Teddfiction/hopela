# separator

2026-07-07 · swap propre · ✅ typecheck

## Changed
- `components/ui/separator.tsx` : Radix Separator → `@base-ui/react/separator`. Prop `decorative` supprimée (Base UI rend role="separator" ou none selon contexte).

## Behavior changes
- Aucun attendu (classes `data-horizontal`/`data-vertical` identiques).

## Verify by hand
- Séparateurs visuels (si utilisés hors sidebar) — rendu 1px inchangé.
