import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "@/data/countries.json";

const countryCodes = new Set(countries.map((c) => c.code));

export const toE164 = (value: string) => {
  const phone = parsePhoneNumberFromString(value.trim());
  return phone?.isValid() ? phone.number : null;
};

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Enter your phone number")
    .refine((v) => !v || v.startsWith("+"), "Include your country code")
    .refine(
      (v) => !v.startsWith("+") || toE164(v) !== null,
      "Enter a valid phone number",
    ),
  line1: z.string().trim().min(3, "Enter your address").max(200),
  line2: z.string().trim().max(200),
  country: z.string().refine((v) => countryCodes.has(v), "Select a country"),
  city: z.string().trim().min(2, "Enter your city").max(100),
  state: z.string().trim().min(2, "Enter your state or region").max(100),
  postalCode: z.string().trim().max(20),
  notes: z.string().trim().max(500),
});
