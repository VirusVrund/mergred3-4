import { z } from "zod";

/* ===============================
   COMMON PARAM SCHEMAS
================================ */

export const databaseParamsSchema = z.object({
  databaseId: z.string().min(1)
});

export const collectionParamsSchema = z.object({
  databaseId: z.string().min(1),
  collectionId: z.string().min(1)
});

export const documentParamsSchema = z.object({
  databaseId: z.string().min(1),
  collectionId: z.string().min(1),
  documentId: z.string().min(1)
});

export const documentAttributeParamsSchema = z.object({
  databaseId: z.string().min(1),
  collectionId: z.string().min(1),
  documentId: z.string().min(1),
  attribute: z.string().min(1)
});

export const transactionParamsSchema = z.object({
  transactionId: z.string().min(1)
});

/* ===============================
   DATABASE
================================ */

export const createDatabaseSchema = z.object({
  databaseId: z.string().min(1),
  name: z.string().min(1)
});

export const updateDatabaseSchema = z.object({
  name: z.string().min(1)
});

/* ===============================
   COLLECTION
================================ */

export const createCollectionSchema = z.object({
  collectionId: z.string().min(1),
  name: z.string().min(1),
  permissions: z.array(z.string()).optional()
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).optional()
});

/* ===============================
   DOCUMENT
================================ */

export const createDocumentSchema = z.object({
  documentId: z.string().optional(),
  data: z.record(z.string(), z.any()),
  permissions: z.array(z.string()).optional(),
  transactionId: z.string().optional()
});

export const updateDocumentSchema = z.object({
  data: z.record(z.string(), z.any()).optional(),
  permissions: z.array(z.string()).optional(),
  transactionId: z.string().optional()
});

export const upsertDocumentSchema = z.object({
  data: z.record(z.string(), z.any()),
  permissions: z.array(z.string()).optional(),
  transactionId: z.string().optional()
});

/* ===============================
   INCREMENT / DECREMENT
================================ */

export const incrementAttributeSchema = z.object({
  value: z.number().optional(),
  max: z.number().optional(),
  transactionId: z.string().optional()
});

export const decrementAttributeSchema = z.object({
  value: z.number().optional(),
  min: z.number().optional(),
  transactionId: z.string().optional()
});

/* ===============================
   TRANSACTIONS
================================ */

export const createTransactionSchema = z.object({
  ttl: z.number().optional()
});

export const updateTransactionSchema = z.object({
  commit: z.boolean().optional(),
  rollback: z.boolean().optional()
});

export const createOperationsSchema = z.object({
  operations: z.array(z.record(z.string(), z.any()))
});

/* ===============================
   Storage
================================ */
export const bucketParamsSchema = z.object({
  bucketId: z.string().min(1)
});

export const fileParamsSchema = z.object({
  bucketId: z.string().min(1),
  fileId: z.string().min(1)
});