# dialog

2026-07-07 · swap propre (fichier stock) · ✅ typecheck

## Changed
- `components/ui/dialog.tsx` : Radix Dialog → `@base-ui/react/dialog` (Overlay→Backdrop, Content→Popup) ; bouton close en `render={<Button/>}`.
- Triggers migrés : reserve-dialog, confirm-dialog (prop `trigger` typée `ReactElement`, `render={trigger}`), list-settings-dialog, add-gift-dialog, gift-row.

## Left alone
- `components/hopela/dialog-fullscreen.ts` (classes plein écran mobile) : inchangé, s'applique via className.

## Behavior changes
- `onOpenChange` reçoit `(open, eventDetails)` — handlers existants `(open) => …` toujours valides.
- Dismiss : Base UI ferme sur pointerdown extérieur (Radix : pointerup).

## Verify by hand
- add-gift (plein écran mobile), settings (zone dangereuse), édition gift-row, confirm de suppression. Esc + clic backdrop.
