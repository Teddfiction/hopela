import { z } from "zod";

export const coverImages = [
  "confetti",
  "balloons",
  "gift",
  "stars",
  "hearts",
  "flowers",
] as const;

export const listSchema = z.object({
  title: z.string().trim().min(1).max(120),
  emoji: z
    .string()
    .trim()
    .max(8)
    .optional()
    .transform((v) => (v ? v : null)),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : null)),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  cover_image: z
    .enum(coverImages)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  anti_spoil: z
    .union([z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
});

export type ListInput = z.infer<typeof listSchema>;
