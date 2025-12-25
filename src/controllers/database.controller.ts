import { Request, Response, NextFunction } from "express";
import { databases } from "../config/appwrite";
import { ID } from "node-appwrite";
import { z } from "zod";

import { BadRequestError } from "../errors/errors";
import { mapAppwriteError } from "../errors/appwriteErrorMapper";

import {
  databaseParamsSchema,
  collectionParamsSchema,
  documentParamsSchema,
  
} from "../validators/project.schema";


/**
 * Create Database
 */
export const createDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({
    databaseId: z.string().min(1),
    name: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next(new BadRequestError("databaseId and name are required"));
  }

  try {
    const result = await databases.create(
      parsed.data.databaseId,
      parsed.data.name
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Database
 */
export const getDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = databaseParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId"));
  }

  try {
    const result = await databases.get(parsed.data.databaseId);
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};


/**
 * List Databases
 */
export const listDatabases = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await databases.list();
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Database
 */
export const updateDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = databaseParamsSchema.safeParse(req.params);
  const body = z.object({ name: z.string().min(1) }).safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid databaseId or name"));
  }

  try {
    const result = await databases.update(
      params.data.databaseId,
      body.data.name
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Database
 */
export const deleteDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = databaseParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId"));
  }

  try {
    await databases.delete(parsed.data.databaseId);
    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Collection
 */
export const createCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bodySchema = z.object({
    collectionId: z.string().min(1),
    name: z.string().min(1),
    permissions: z.array(z.string()).optional()
  });

  const params = databaseParamsSchema.safeParse(req.params);
  const body = bodySchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid request data"));
  }

  try {
    const result = await databases.createCollection(
      params.data.databaseId,
      body.data.collectionId,
      body.data.name,
      body.data.permissions
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Collection
 */
export const getCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = collectionParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId or collectionId"));
  }

  try {
    const result = await databases.getCollection(
      parsed.data.databaseId,
      parsed.data.collectionId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Collections
 */
export const listCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = databaseParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId"));
  }

  try {
    const result = await databases.listCollections(parsed.data.databaseId);
    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Collection
 */
export const updateCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = collectionParamsSchema.safeParse(req.params);
  const body = z.object({
    name: z.string().min(1),
    permissions: z.array(z.string()).optional()
  }).safeParse(req.body);

  if (!params.success || !body.success) {
    return next(new BadRequestError("Invalid request data"));
  }

  try {
    const result = await databases.updateCollection(
      params.data.databaseId,
      params.data.collectionId,
      body.data.name,
      body.data.permissions
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Collection
 */
export const deleteCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = collectionParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId or collectionId"));
  }

  try {
    await databases.deleteCollection(
      parsed.data.databaseId,
      parsed.data.collectionId
    );

    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Document
 */
export const createDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = collectionParamsSchema.safeParse(req.params);
  if (!params.success) {
    return next(new BadRequestError("Invalid databaseId or collectionId"));
  }

  try {
    const result = await databases.createDocument(
      params.data.databaseId,
      params.data.collectionId,
      ID.unique(),
      req.body.data,
      req.body.permissions
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Document
 */
export const getDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = documentParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid document path"));
  }

  try {
    const result = await databases.getDocument(
      parsed.data.databaseId,
      parsed.data.collectionId,
      parsed.data.documentId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Documents
 */
export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = collectionParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid databaseId or collectionId"));
  }

  try {
    const result = await databases.listDocuments(
      parsed.data.databaseId,
      parsed.data.collectionId,
      req.query.queries as string[] | undefined,
      req.query.search as string | undefined
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Document
 */
export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = documentParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid document path"));
  }

  try {
    const result = await databases.updateDocument(
      parsed.data.databaseId,
      parsed.data.collectionId,
      parsed.data.documentId,
      req.body.data,
      req.body.permissions
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Document
 */
export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = documentParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid document path"));
  }

  try {
    await databases.deleteDocument(
      parsed.data.databaseId,
      parsed.data.collectionId,
      parsed.data.documentId
    );

    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Upsert Document
 */
export const upsertDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = documentParamsSchema.safeParse(req.params);
  if (!params.success) {
    return next(new BadRequestError("Invalid document path"));
  }

  try {
    const result = await databases.upsertDocument(
      params.data.databaseId,
      params.data.collectionId,
      params.data.documentId,
      req.body.data,
      req.body.permissions,
      req.body.transactionId
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Increment Document Attribute
 */
export const incrementDocumentAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    documentId: z.string(),
    attribute: z.string()
  });

  const parsed = schema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid path parameters"));
  }

  try {
    const result = await databases.incrementDocumentAttribute(
      parsed.data.databaseId,
      parsed.data.collectionId,
      parsed.data.documentId,
      parsed.data.attribute,
      req.body.value,
      req.body.max,
      req.body.transactionId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Decrement Document Attribute
 */
export const decrementDocumentAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    documentId: z.string(),
    attribute: z.string()
  });

  const parsed = schema.safeParse(req.params);
  if (!parsed.success) {
    return next(new BadRequestError("Invalid path parameters"));
  }

  try {
    const result = await databases.decrementDocumentAttribute(
      parsed.data.databaseId,
      parsed.data.collectionId,
      parsed.data.documentId,
      parsed.data.attribute,
      req.body.value,
      req.body.min,
      req.body.transactionId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};


/**
 * Create Transaction
 */
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await databases.createTransaction(
      req.body.ttl
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Get Transaction
 */
export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({ transactionId: z.string() });
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    return next(new BadRequestError("Invalid transactionId"));
  }

  try {
    const result = await databases.getTransaction(
      parsed.data.transactionId
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * List Transactions
 */
export const listTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await databases.listTransactions(
      req.query.queries as string[] | undefined
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Update Transaction
 */
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({ transactionId: z.string() });
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    return next(new BadRequestError("Invalid transactionId"));
  }

  try {
    const result = await databases.updateTransaction(
      parsed.data.transactionId,
      req.body.commit,
      req.body.rollback
    );

    return res.json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Delete Transaction
 */
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({ transactionId: z.string() });
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    return next(new BadRequestError("Invalid transactionId"));
  }

  try {
    await databases.deleteTransaction(parsed.data.transactionId);
    return res.status(204).send();
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

/**
 * Create Operations
 */
export const createOperations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({ transactionId: z.string() });
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    return next(new BadRequestError("Invalid transactionId"));
  }

  try {
    const result = await databases.createOperations(
      parsed.data.transactionId,
      req.body.operations
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(mapAppwriteError(error));
  }
};

