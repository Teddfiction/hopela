/**
 * Shared DialogContent overrides: fullscreen on mobile, centered card
 * capped at 85dvh on ≥sm. Keeps the list-editor dialogs (add gift,
 * settings) on the exact same pattern.
 */
export const dialogFullscreen =
  "top-0 left-0 h-dvh max-w-full translate-x-0 translate-y-0 grid-rows-[auto_1fr] content-start overflow-y-auto rounded-none sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:grid-rows-none sm:content-normal sm:rounded-4xl";
