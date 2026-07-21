# popover

2026-07-07 · swap propre · ✅ typecheck

## Changed
- `components/ui/popover.tsx` : Radix Popover → `@base-ui/react/popover` (Positioner + Popup, Title/Description primitives).
- `share-list-popover.tsx` : trigger en `render={<Button variant="outline"/>}`.

## Left alone
- `PopoverContent align="start" className="w-80"` : props conservées.

## Behavior changes
- `PopoverAnchor` n'existe plus (non utilisé dans le projet).
- `PopoverTitle` rend un vrai heading accessible (Radix custom rendait un div).

## Verify by hand
- Popover partage : ouverture, copie du lien, fermeture clic extérieur.
