import { z } from "zod";

/* ===============================
   TEAM
================================ */

export const teamParamsSchema = z.object({
  teamId: z.string().min(1)
});

export const createTeamSchema = z.object({
  name: z.string().min(1),
  roles: z.array(z.string()).optional()
});

export const updateTeamSchema = z.object({
  name: z.string().min(1)
});

/* ===============================
   MEMBERSHIP
================================ */

export const membershipParamsSchema = z.object({
  teamId: z.string().min(1),
  membershipId: z.string().min(1)
});

export const createMembershipSchema = z.object({
  email: z.string().email(),
  roles: z.array(z.string()),
  url: z.string().url(),
  name: z.string().optional()
});

export const updateMembershipSchema = z.object({
  roles: z.array(z.string())
});

