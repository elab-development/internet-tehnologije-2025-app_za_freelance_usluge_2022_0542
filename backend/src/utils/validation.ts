import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["FREELANCER", "CLIENT"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
});

export const createBidSchema = z.object({
  price: z.number().int().min(1),
  deadlineDays: z.number().int().min(1),
  coverLetter: z.string().optional(),
});

export const updateProfileSchema = z.object({
  title: z.string().optional(),
  bio: z.string().optional(),
  githubUrl: z.string().url().optional(),
});
