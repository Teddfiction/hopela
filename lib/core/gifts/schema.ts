import { z } from "zod";

const priceRegex = /^\d{1,8}([.,]\d{1,2})?$/;

export const giftSchema = z.object({
  url: z
    .string()
    .trim()
    .url()
    .startsWith("http")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  title: z.string().trim().min(1).max(200),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : null)),
  // Money stays a string end-to-end — numeric(10,2) in Postgres, never a float.
  price: z
    .string()
    .trim()
    .regex(priceRegex)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.replace(",", ".") : null)),
  currency: z
    .string()
    .trim()
    .length(3)
    .toUpperCase()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  image_url: z
    .string()
    .trim()
    .url()
    .startsWith("http")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  is_top_priority: z
    .union([z.literal("on"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "on" || v === "true"),
});

export type GiftInput = z.infer<typeof giftSchema>;
