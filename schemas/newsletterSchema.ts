import { z } from "zod";

export const newsletterSchema = z.object({
  email: z

    .email("Enter a valid email address")
    .min(1, "Email is required")
    .max(254, "That email is too long"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
