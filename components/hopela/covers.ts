import type { CoverImage } from "@/lib/db/types";

/**
 * Predefined cover gallery (no uploads in V1). Gradients are composed from
 * theme tokens only — restyling the app never touches this file.
 */
export const coverStyles: Record<CoverImage, string> = {
  confetti: "bg-gradient-to-br from-primary/60 via-chart-1/40 to-chart-2/50",
  balloons: "bg-gradient-to-br from-chart-2/50 to-primary/40",
  gift: "bg-gradient-to-br from-primary/70 to-chart-4/40",
  stars: "bg-gradient-to-br from-chart-3/50 to-primary/50",
  hearts: "bg-gradient-to-br from-destructive/30 to-primary/40",
  flowers: "bg-gradient-to-br from-chart-1/50 to-chart-5/40",
};

export const coverEmojis: Record<CoverImage, string> = {
  confetti: "🎉",
  balloons: "🎈",
  gift: "🎁",
  stars: "⭐",
  hearts: "❤️",
  flowers: "🌸",
};
