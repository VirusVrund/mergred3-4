import { Request, Response, NextFunction } from "express";
import { account } from "../config/appwrite";
import { ID } from "node-appwrite";

import {
   registerSchema,
  loginSchema,
  updatePasswordSchema,
  passwordRecoverySchema,
  passwordResetSchema,
  verifyEmailSchema,
  oauthSchema
} from "../validators/auth.schema";

import { BadRequestError } from "../errors/errors";
import { mapAppwriteError } from "../errors/appwriteErrorMapper";


/**
 * Create Account
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid registration data"));
  }

  try {
    const result = await account.create(
      ID.unique(),
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Email Session
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid login data"));
  }

  try {
    const result = await account.createEmailPasswordSession(
      parsed.data.email,
      parsed.data.password
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Current Account
 */
export const getMe = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await account.get();
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Current Session
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await account.deleteSession("current");
    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete All Sessions
 */
export const logoutAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await account.deleteSessions();
    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Password
 */
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid password data"));
  }

  try {
    const result = await account.updatePassword(
      parsed.data.password,
      parsed.data.oldPassword
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Password Recovery
 */
export const createRecovery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = passwordRecoverySchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid recovery data"));
  }

  try {
    const result = await account.createRecovery(
      parsed.data.email,
      parsed.data.url
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Complete Password Recovery
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = passwordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid reset data"));
  }

  try {
    const result = await account.updateRecovery(
      parsed.data.userId,
      parsed.data.secret,
      parsed.data.password
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Email Verification
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid verification data"));
  }

  try {
    const result = await account.createVerification(parsed.data.url);
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};
