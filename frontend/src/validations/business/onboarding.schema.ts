import { z } from 'zod';

// Shared Validation Schema for Business Onboarding (7 Steps)
// Written for Zod v4 — uses `error` instead of `required_error`/`invalid_type_error`

export const step1Schema = z.object({
  name: z.string({ error: "Business name is required" }).min(2, "Business name must be at least 2 characters"),
  tagline: z.string().optional(),
  primaryCategory: z.string({ error: "Please select a primary category" }).min(1, "Primary category is required"),
  subCategories: z.array(z.string()).optional(),
  description: z.string().min(10, "Please provide a detailed description (min 10 characters)").optional().or(z.literal('')),
  establishedYear: z.coerce
    .number()
    .int()
    .min(1800, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
});

export const step2Schema = z.object({
  phone: z.string({ error: "Primary phone is required" }).regex(/^\+\d{1,4}\d{10}$/, "Primary phone must be a valid 10-digit number with country code"),
  whatsappNumber: z.string().regex(/^\+\d{1,4}\d{10}$/, "WhatsApp number must be a valid 10-digit number with country code").optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  contactPerson: z.string().min(2, "Contact person name is too short").optional().or(z.literal('')),
  socialLinks: z.record(z.string(), z.string()).optional(),
});

export const step3Schema = z.object({
  address: z.string({ error: "Address is required" }).min(5, "Address must be at least 5 characters"),
  country: z.string({ error: "Country is required" }).min(2, "Country is required"),
  landmark: z.string().optional(),
  pincode: z.string().min(4, "Invalid pincode").optional().or(z.literal('')),
  city: z.string({ error: "City is required" }).min(2, "City is required"),
  state: z.string({ error: "State is required" }).min(2, "State is required"),
  latitude: z.coerce.number({ error: "Please pin your location on the map" }),
  longitude: z.coerce.number({ error: "Please pin your location on the map" }),
});

export const step4Schema = z.object({
  timings: z.record(z.string(), z.any()).optional(),
});

export const step5Schema = z.object({
  amenities: z.array(z.string()).optional(),
  parking: z.object({
    available: z.boolean(),
    slots: z.number().optional(),
    valet: z.boolean().optional(),
  }).optional(),
  petPolicy: z.string().optional(),
  seating: z.array(z.string()).optional(),
  paymentModes: z.array(z.string()).optional(),
});

export const step6Schema = z.object({
  services: z.array(z.record(z.string(), z.any())).optional(),
  products: z.array(z.record(z.string(), z.any())).optional(),
  menus: z.array(z.string()).optional(),
});

export const step7Schema = z.object({
  logo: z.string().optional(),
  coverPhoto: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  gstNumber: z.string().optional(),
  businessRegistrationProof: z.string().optional(),
  ownerIdProof: z.string().optional(),
});

export const BusinessOnboardingSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
  ...step6Schema.shape,
  ...step7Schema.shape,
  email: z.string({ error: "Email is required" }).email("Valid email is required"),
  password: z.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
});

export type BusinessOnboardingData = z.infer<typeof BusinessOnboardingSchema>;
