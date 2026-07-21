# sidebar

2026-07-07 · swap structurel (fichier stock, usages customs) · ✅ typecheck

## Changed
- `components/ui/sidebar.tsx` : `Slot`/`asChild` → `useRender` + `mergeProps` sur SidebarGroupLabel/GroupAction/MenuButton/MenuAction/MenuSubButton ; tooltip intégré via `TooltipTrigger render={…}`.
- `dashboard-sidebar.tsx` : 3× `SidebarMenuButton asChild + <Link>` → `render={<Link/>}` (brand, Nouvelle liste, Mes listes) ; trigger dropdown en render.

## Left alone
- Pattern mono-colonne `collapsible="icon"` (décision 2026-07-02) : structurellement identique, la branche Sheet mobile garde son comportement (limitation className connue, toujours contournée au niveau usage).
- `hooks/use-mobile`, cookie state, raccourci ⌘B : inchangés.

## Behavior changes
- `data-active`/`data-size` émis via le state useRender : présents seulement quand actifs (Radix émettait `data-active="false"`). Les classes `data-active:` ciblent la présence — rendu identique.

## Verify by hand
- Desktop : collapse icône (trigger + ⌘B), tooltips en mode icône, état actif « Mes listes ».
- Mobile : ouverture Sheet, navigation ferme le Sheet, dropdown user side="top".
