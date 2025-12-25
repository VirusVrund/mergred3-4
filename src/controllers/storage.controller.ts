import { Request, Response, NextFunction } from "express";
import { storage } from "../config/appwrite";
import { ID } from "node-appwrite";
import { z } from "zod";

import { BadRequestError } from "../errors/errors";
import { mapAppwriteError } from "../errors/appwriteErrorMapper";

import {bucketParamsSchema,fileParamsSchema} from "../validators/project.schema";

/**
 * Create File
 */
export const createFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsParsed = bucketParamsSchema.safeParse(req.params);

  if (!paramsParsed.success || !req.file) {
    return next(new BadRequestError("bucketId and file are required"));
  }

  try {
    // Node 18+ Web File API (docs-compatible)
    const file = new File(
      [new Uint8Array(req.file.buffer)],
      req.file.originalname,
      { type: req.file.mimetype }
    );

    const result = await storage.createFile(
      paramsParsed.data.bucketId,
      ID.unique(),
      file,
      req.body.permissions
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get File
 */
export const getFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    const result = await storage.getFile(
      parsed.data.bucketId,
      parsed.data.fileId
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Download File
 */
export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    const file = await storage.getFileDownload(
      parsed.data.bucketId,
      parsed.data.fileId,
      req.query.token as string | undefined
    );

    return res.send(file);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * View File
 */
export const viewFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    const file = await storage.getFileView(
      parsed.data.bucketId,
      parsed.data.fileId,
      req.query.token as string | undefined
    );

    return res.send(file);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get File Preview
 */
export const getFilePreview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    const preview = await storage.getFilePreview(
      parsed.data.bucketId,
      parsed.data.fileId,
      req.query.width ? Number(req.query.width) : undefined,
      req.query.height ? Number(req.query.height) : undefined,
      req.query.gravity as any,
      req.query.quality ? Number(req.query.quality) : undefined,
      req.query.borderWidth ? Number(req.query.borderWidth) : undefined,
      req.query.borderColor as string | undefined,
      req.query.borderRadius ? Number(req.query.borderRadius) : undefined,
      req.query.opacity ? Number(req.query.opacity) : undefined,
      req.query.rotation ? Number(req.query.rotation) : undefined,
      req.query.background as string | undefined,
      req.query.output as any,
      req.query.token as string | undefined
    );

    return res.send(preview);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Files
 */
export const listFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = bucketParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId"));
  }

  try {
    const result = await storage.listFiles(
      parsed.data.bucketId,
      req.query.queries as string[] | undefined,
      req.query.search as string | undefined,
      req.query.total === "false" ? false : undefined
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update File
 */
export const updateFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    const result = await storage.updateFile(
      parsed.data.bucketId,
      parsed.data.fileId,
      req.body.name,
      req.body.permissions
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete File
 */
export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = fileParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid bucketId or fileId"));
  }

  try {
    await storage.deleteFile(
      parsed.data.bucketId,
      parsed.data.fileId
    );

    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

