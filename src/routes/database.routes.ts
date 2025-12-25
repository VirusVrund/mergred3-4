import { Router } from "express";
import { authorize, authorizePermissions } from "../middlewares/authorize";
import { Roles } from "../constants/roles";
import { Permissions } from "../constants/permissions";

import {
  createDatabase,
  getDatabase,
  listDatabases,
  updateDatabase,
  deleteDatabase,

  createCollection,
  getCollection,
  listCollections,
  updateCollection,
  deleteCollection,

  createDocument,
  getDocument,
  listDocuments,
  updateDocument,
  deleteDocument,
  upsertDocument,
  incrementDocumentAttribute,
  decrementDocumentAttribute,

  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  createOperations
} from "../controllers/database.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Databases
 *   description: Databases, collections, documents & transactions
 */

/* ===============================
   DATABASES
================================ */

/**
 * @swagger
 * /databases:
 *   post:
 *     tags: [Databases]
 *     summary: Create a database
 */
router.post("/", authorize([Roles.ADMIN]), createDatabase);

/**
 * @swagger
 * /databases:
 *   get:
 *     tags: [Databases]
 *     summary: List all databases
 */
router.get("/", authorize([Roles.ADMIN, Roles.PAYMENTS]), listDatabases);

/**
 * @swagger
 * /databases/{databaseId}:
 *   get:
 *     tags: [Databases]
 *     summary: Get database by ID
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 */
router.get("/:databaseId", authorize([Roles.ADMIN, Roles.PAYMENTS]), getDatabase);

/**
 * @swagger
 * /databases/{databaseId}:
 *   put:
 *     tags: [Databases]
 *     summary: Update database name
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 */
router.put("/:databaseId", authorize([Roles.ADMIN]), updateDatabase);

/**
 * @swagger
 * /databases/{databaseId}:
 *   delete:
 *     tags: [Databases]
 *     summary: Delete database
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 */
router.delete("/:databaseId", authorize([Roles.ADMIN]), deleteDatabase);

/* ===============================
   COLLECTIONS
================================ */

/**
 * @swagger
 * /databases/{databaseId}/collections:
 *   post:
 *     tags: [Databases]
 *     summary: Create a collection
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 */
router.post("/:databaseId/collections", authorize([Roles.ADMIN]), createCollection);

/**
 * @swagger
 * /databases/{databaseId}/collections:
 *   get:
 *     tags: [Databases]
 *     summary: List collections
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 */
router.get("/:databaseId/collections", authorize([Roles.ADMIN, Roles.PAYMENTS]), listCollections);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}:
 *   get:
 *     tags: [Databases]
 *     summary: Get collection
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema: { type: string }
 */
router.get("/:databaseId/collections/:collectionId", authorize([Roles.ADMIN, Roles.PAYMENTS]), getCollection);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}:
 *   put:
 *     tags: [Databases]
 *     summary: Update collection
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *       - in: path
 *         name: collectionId
 *         required: true
 */
router.put("/:databaseId/collections/:collectionId", authorize([Roles.ADMIN]), updateCollection);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}:
 *   delete:
 *     tags: [Databases]
 *     summary: Delete collection
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *       - in: path
 *         name: collectionId
 *         required: true
 */
router.delete("/:databaseId/collections/:collectionId", authorize([Roles.ADMIN]), deleteCollection);

/* ===============================
   DOCUMENTS
================================ */

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents:
 *   post:
 *     tags: [Databases]
 *     summary: Create document
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *       - in: path
 *         name: collectionId
 *         required: true
 */
router.post(
  "/:databaseId/collections/:collectionId/documents",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  createDocument
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents:
 *   get:
 *     tags: [Databases]
 *     summary: List documents
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 */
router.get(
  "/:databaseId/collections/:collectionId/documents",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  listDocuments
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}:
 *   get:
 *     tags: [Databases]
 *     summary: Get document
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 */
router.get(
  "/:databaseId/collections/:collectionId/documents/:documentId",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  getDocument
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}:
 *   patch:
 *     tags: [Databases]
 *     summary: Update document
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 */
router.patch(
  "/:databaseId/collections/:collectionId/documents/:documentId",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  updateDocument
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}:
 *   put:
 *     tags: [Databases]
 *     summary: Upsert document
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 */
router.put(
  "/:databaseId/collections/:collectionId/documents/:documentId",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  upsertDocument
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}:
 *   delete:
 *     tags: [Databases]
 *     summary: Delete document
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 */
router.delete(
  "/:databaseId/collections/:collectionId/documents/:documentId",
  authorize([Roles.ADMIN]),
  deleteDocument
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/increment:
 *   patch:
 *     tags: [Databases]
 *     summary: Increment document attribute
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 *       - in: path
 *         name: attribute
 */
router.patch(
  "/:databaseId/collections/:collectionId/documents/:documentId/:attribute/increment",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  incrementDocumentAttribute
);

/**
 * @swagger
 * /databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/decrement:
 *   patch:
 *     tags: [Databases]
 *     summary: Decrement document attribute
 *     parameters:
 *       - in: path
 *         name: databaseId
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: documentId
 *       - in: path
 *         name: attribute
 */
router.patch(
  "/:databaseId/collections/:collectionId/documents/:documentId/:attribute/decrement",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  decrementDocumentAttribute
);

/* ===============================
   TRANSACTIONS
================================ */

/**
 * @swagger
 * /databases/transactions:
 *   post:
 *     tags: [Databases]
 *     summary: Create transaction
 */
router.post("/transactions", authorize([Roles.ADMIN, Roles.PAYMENTS]), createTransaction);

/**
 * @swagger
 * /databases/transactions:
 *   get:
 *     tags: [Databases]
 *     summary: List transactions
 */
router.get("/transactions", authorize([Roles.ADMIN, Roles.PAYMENTS]), listTransactions);

/**
 * @swagger
 * /databases/transactions/{transactionId}:
 *   get:
 *     tags: [Databases]
 *     summary: Get transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
 */
router.get("/transactions/:transactionId", authorize([Roles.ADMIN, Roles.PAYMENTS]), getTransaction);

/**
 * @swagger
 * /databases/transactions/{transactionId}:
 *   patch:
 *     tags: [Databases]
 *     summary: Update transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
 */
router.patch("/transactions/:transactionId", authorize([Roles.ADMIN]), updateTransaction);

/**
 * @swagger
 * /databases/transactions/{transactionId}:
 *   delete:
 *     tags: [Databases]
 *     summary: Delete transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
 */
router.delete("/transactions/:transactionId", authorize([Roles.ADMIN]), deleteTransaction);

/**
 * @swagger
 * /databases/transactions/{transactionId}/operations:
 *   post:
 *     tags: [Databases]
 *     summary: Create operations
 *     parameters:
 *       - in: path
 *         name: transactionId
 */
router.post(
  "/transactions/:transactionId/operations",
  authorize([Roles.ADMIN, Roles.PAYMENTS]),
  createOperations
);

export default router;
