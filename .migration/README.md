# Migration Radix UI → Base UI (2026-07-07)

Stratégie : **full project en une passe** (11 composants, style registry `radix-luma` → `base-luma`).
Vérifié : `tsc --noEmit` ✅ · `eslint .` ✅ (sandbox Linux, node_modules propres).
Reste à faire sur le Mac : ~~`npm install`~~ ✅ · ~~`npm run build`~~ ✅ · test manuel (checklists ci-dessous) · commit.

**Vérification du 2026-07-21 (Mac)** : audit de conformité contre le registre officiel `base-luma` — les 11 wrappers sont structurellement identiques aux variantes officielles (seules différences : icônes Hugeicons résolues, alias d'imports, `data-variant`/`data-size` sur button). Balayage Radix propre. `tsc` ✅ · `eslint` ✅ · `npm run build` (Turbopack, 15 pages) ✅ après réparation de `node_modules/next` (installé sans `.d.ts`) et purge de `.next` (doublons macOS `* 2.*`).

## Périmètre

| Composant | Primitive | Rapport |
|---|---|---|
| button | `@base-ui/react/button` | [button.md](button.md) |
| badge | `useRender` | [badge.md](badge.md) |
| dialog | `@base-ui/react/dialog` | [dialog.md](dialog.md) |
| sheet | `@base-ui/react/dialog` | [sheet.md](sheet.md) |
| dropdown-menu | `@base-ui/react/menu` | [dropdown-menu.md](dropdown-menu.md) |
| popover | `@base-ui/react/popover` | [popover.md](popover.md) |
| tooltip | `@base-ui/react/tooltip` | [tooltip.md](tooltip.md) |
| switch | `@base-ui/react/switch` | [switch.md](switch.md) |
| label | `<label>` natif | [label.md](label.md) |
| separator | `@base-ui/react/separator` | [separator.md](separator.md) |
| sidebar | `useRender` + composés | [sidebar.md](sidebar.md) |

Non concernés (aucune primitive) : alert, card (custom rounded-2xl conservé), input, skeleton, sonner, textarea.

## Changements mécaniques globaux

- `asChild` → `render={<Element />}` partout (16 fichiers app/components).
- Variables CSS `--radix-*` → équivalents Base UI (`--transform-origin`, `--anchor-width`, `--available-height`).
- `onSelect` (Menu.Item Radix) → `onClick` (Base UI).
- `components.json` : style `base-luma` · `package.json` : `@base-ui/react@^1.6.0` remplace `radix-ui`.

## Post-migration : erreur webpack `!` (2026-07-08)

`next dev`/`next build` (webpack) rejettent tout chemin contenant `!` — or le dossier parent s'appelle `Hopélà!`. Révélé par le bump Next 15.3→15.5 du npm install (validation stricte du schema). Sans lien avec Base UI.

**Fix appliqué :** `--turbopack` sur les scripts `dev` et `build` (Turbopack n'a pas cette restriction — build de prod vérifié complet en sandbox dans un chemin avec `!`).
**Fix racine (optionnel, recommandé à terme) :** renommer le dossier parent sans `!` — ce caractère restera une mine pour l'outillage JS. Vercel n'est pas concerné (chemin de build propre).
