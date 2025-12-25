import { Request, Response, NextFunction } from "express";
import { teams } from "../config/appwrite";
import { ID } from "node-appwrite";

import {
  teamParamsSchema,
  createTeamSchema,
  updateTeamSchema,
  createMembershipSchema,
  membershipParamsSchema,
  updateMembershipSchema,
} from "../validators/teams.schema";

import { BadRequestError } from "../errors/errors";
import { mapAppwriteError } from "../errors/appwriteErrorMapper";
/**
 * Create Team
 */
export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = createTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid team data"));
  }

  try {
    const result = await teams.create(
      ID.unique(),
      parsed.data.name,
      parsed.data.roles
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Team
 */
export const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = teamParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid teamId"));
  }

  try {
    const result = await teams.get(parsed.data.teamId);
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Teams
 */
export const listTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await teams.list(req.query.queries as string[] | undefined);

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Team
 */
export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = teamParamsSchema.safeParse(req.params);
  const body = updateTeamSchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid team update data"));
  }

  try {
    const result = await teams.updateName(params.data.teamId, body.data.name);

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Team
 */
export const deleteTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = teamParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid teamId"));
  }

  try {
    await teams.delete(parsed.data.teamId);
    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};
/**
 * Create Membership
 */
export const createMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = teamParamsSchema.safeParse(req.params);
  const body = createMembershipSchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid membership data"));
  }

  try {
    const result = await teams.createMembership(
      params.data.teamId,
      body.data.roles,
      body.data.email,

      body.data.url,
      body.data.name
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Membership
 */
export const getMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = membershipParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid membership path"));
  }

  try {
    const result = await teams.getMembership(
      parsed.data.teamId,
      parsed.data.membershipId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Memberships
 */
export const listMemberships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = teamParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid teamId"));
  }

  try {
    const result = await teams.listMemberships(
      parsed.data.teamId,
      req.query.queries as string[] | undefined
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};/**
 * Update Membership (roles only)
 */
export const updateMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = membershipParamsSchema.safeParse(req.params);
  const body = updateMembershipSchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid membership update"));
  }

  try {
    if (!body.data.roles) {
      return next(new BadRequestError("Roles are required"));
    }

    const result = await teams.updateMembership(
      params.data.teamId,
      params.data.membershipId,
      body.data.roles
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Membership
 */
export const deleteMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = membershipParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid membership path"));
  }

  try {
    await teams.deleteMembership(parsed.data.teamId, parsed.data.membershipId);

    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};
