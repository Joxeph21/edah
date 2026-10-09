import { z } from "zod";

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx", ".txt"];

export const FILE_ACCEPT = [...ACCEPTED_MIME, ...ACCEPTED_EXT].join(",");

export const isAcceptedFile = (f: File) =>
  ACCEPTED_MIME.includes(f.type) || ACCEPTED_EXT.some((ext) => f.name.toLowerCase().endsWith(ext));

export const commissionSchema = z.object({
  type: z.enum(["mask", "mural", "sculpture", "cover-art", "other"], {
    message: "Choose what you'd like made",
  }),
  name: z.string().trim().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  about: z
    .string()
    .trim()
    .min(20, "Tell me a little more (at least 20 characters)")
    .max(3000, "That's a bit long, try to keep it under 3000 characters"),
  inspiration: z
    .array(z.instanceof(File))
    .max(MAX_FILES, `Add up to ${MAX_FILES} files`)
    .refine((files) => files.every(isAcceptedFile), "Only images, PDF, Word or text files are allowed")
    .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE), "Each file must be under 5MB"),
  details: z.string().trim().max(200, "Keep it under 200 characters"),
});

export type CommissionFormData = z.infer<typeof commissionSchema>;