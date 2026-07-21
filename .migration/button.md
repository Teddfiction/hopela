# button

2026-07-07 · swap propre (fichier stock) · ✅ typecheck

## Changed
- `components/ui/button.tsx` : `Slot` (radix-ui) → `ButtonPrimitive` de `@base-ui/react/button` ; `asChild` supprimé au profit de la prop `render`.
- 10 usages `<Button asChild><Link/></Button>` → `<Button render={<Link … />}>label</Button>` : site-header, gift-card, (marketing)/page ×3, dashboard/page ×3, lists/[id]/page, cancel ×2, not-found.

## Left alone
- `buttonVariants` (cva) : classes identiques au registry, aucune custom détectée.

## Behavior changes
- ButtonPrimitive rend les boutons désactivés focusables avec `aria-disabled` (a11y améliorée vs `disabled` natif).

## Verify by hand
- CTA hero (2 boutons), « Gérer » des cards dashboard, lien externe gift-card (target _blank).

## Correctif post-test (2026-07-08)

Warning console au premier `npm run dev` : `nativeButton expected a native <button>`.
La doc officielle est explicite : **ne pas utiliser `<Button render={<a/>}>` pour les liens** — le Button Base UI force `role="button"`, ce qui écrase la sémantique du lien.
Fix : les 12 liens-boutons utilisent désormais le pattern officiel `<Link className={buttonVariants({ variant, size })}>`. Le `render` prop reste le bon outil pour les triggers (DialogTrigger, DropdownMenuTrigger…) qui rendent de vrais boutons, et pour SidebarMenuButton (useRender, pas de role forcé).
Re-vérifié : tsc ✅ eslint ✅.
