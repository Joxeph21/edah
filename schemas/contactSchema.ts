import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "Keep it under 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Keep it under 50 characters"),
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  subject: z.string().trim().min(1, "Subject is required").max(100, "Keep it under 100 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;