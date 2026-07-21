# label

2026-07-07 · simplification · ✅ typecheck

## Changed
- `components/ui/label.tsx` : `LabelPrimitive.Root` (Radix) → `<label>` natif (pattern base-luma — la primitive n'apportait que la prévention du double-clic-sélection).

## Behavior changes
- Double-clic sur un label peut sélectionner le texte (comportement natif). Sans impact fonctionnel.

## Verify by hand
- Labels des forms (liste, cadeau, réservation) : clic → focus de l'input associé (htmlFor).
