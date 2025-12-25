import { z } from "zod";

/* ===============================
   AUTH
================================ */

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8),
  oldPassword: z.string().optional()
});

export const passwordRecoverySchema = z.object({
  email: z.string().email(),
  url: z.string().url()
});

export const passwordResetSchema = z.object({
  userId: z.string(),
  secret: z.string(),
  password: z.string().min(8)
});

export const verifyEmailSchema = z.object({
  url: z.string().url()
});

export const oauthSchema = z.object({
  provider: z.string().min(1)
});
