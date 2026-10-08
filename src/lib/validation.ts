import { z } from "zod";
import { delivery } from "./config";

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export function normalizePhone(v: string) {
  return v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")),
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("Enter a valid email").optional()),
  addressLine1: z.string().trim().min(5, "Please enter house / street details").max(200),
  addressLine2: optionalText(200),
  landmark: optionalText(100),
  city: z.string().trim().min(2, "Please enter your city").max(60),
  state: z.enum(INDIAN_STATES, "Please choose your state"),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  customerNote: optionalText(300),
  upiTxnId: optionalText(40),
  productSlug: z.string().trim().min(1),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Choose at least 1 packet")
    .max(delivery.maxQtyPerOrder, `For more than ${delivery.maxQtyPerOrder} packets, please message us on WhatsApp`),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
