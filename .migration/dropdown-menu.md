# dropdown-menu

2026-07-07 · swap propre (fichier stock) · ✅ typecheck

## Changed
- `components/ui/dropdown-menu.tsx` : Radix DropdownMenu → `Menu` Base UI (Positioner + Popup ; `side`/`align` exposés sur Content ; Sub → SubmenuRoot/SubmenuTrigger).
- `dashboard-sidebar.tsx` : trigger en `render={<SidebarMenuButton/>}` ; `w-(--radix-dropdown-menu-trigger-width)` → `w-(--anchor-width)` ; `onSelect` (sign out) → `onClick`.
- `locale-switcher.tsx` : trigger en `render={<Button/>}`.

## Left alone
- `DropdownMenuRadioGroup onValueChange` : même API.
- `side={isMobile ? "top" : "right"}` : conservé.

## Behavior changes
- Items activés via `onClick` (plus d'`onSelect`).
- Sous-menu langue porté par SubmenuRoot — ouverture hover/flèche quasi identique.

## Verify by hand
- Menu utilisateur : position top (mobile) / right (desktop), largeur = trigger, sous-menu FR/EN, sign out. Switcher langue public.
