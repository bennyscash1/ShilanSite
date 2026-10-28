import { isValidSlug, type BlogPost } from "@shilan/core";
import { z } from "zod";

/** An uploaded image: https (Vercel Blob) or, in local development, a /dev-uploads/ path. */
const imageUrl = z
  .string()
  .refine((v) => /^https:\/\/\S+$/.test(v) || /^\/dev-uploads\/[\w.-]+$/.test(v), "כתובת תמונה לא תקינה");

const imageSchema = z.object({ url: imageUrl, alt: z.string().max(200) });

/** Shape of a stored post document. Used to validate what is read back from Blob storage. */
export const storedPostSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/),
  slug: z.string().refine(isValidSlug),
  title: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  coverImage: imageSchema.optional(),
  status: z.enum(["draft", "published"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
}) satisfies z.ZodType<BlogPost>;

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => v || undefined);

/** The admin editor form. Messages are shown to the site owner in Hebrew. */
export const postFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "יש להזין כותרת").max(150, "הכותרת ארוכה מדי (עד 150 תווים)"),
  slug: z
    .string()
    .trim()
    .refine(isValidSlug, "כתובת לא תקינה: אותיות עבריות/אנגליות, ספרות ומקפים בלבד"),
  excerpt: z.string().trim().max(300, "התקציר ארוך מדי (עד 300 תווים)"),
  content: z.string().trim().min(1, "יש להזין תוכן"),
  coverUrl: z.union([z.literal(""), imageUrl]),
  coverAlt: z.string().trim().max(200),
  status: z.enum(["draft", "published"]),
  seoTitle: optionalText(70, "כותרת לגוגל ארוכה מדי (עד 70 תווים)"),
  seoDescription: optionalText(170, "תיאור לגוגל ארוך מדי (עד 170 תווים)"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
