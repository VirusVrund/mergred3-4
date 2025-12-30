import { Router } from "express";
import { authorizePermissions } from "../middlewares/authorize";
import { Permissions } from "../constants/permissions";

import {
  createFile,
  getFile,
  downloadFile,
  viewFile,
  getFilePreview,
  listFiles,
  updateFile,
  deleteFile
} from "../controllers/storage.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: File storage & preview APIs
 */

/* ===============================
   FILES
================================ */

/**
 * @swagger
 * /storage/buckets/{bucketId}/files:
 *   post:
 *     tags: [Storage]
 *     summary: Upload a file to a bucket
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post("/buckets/:bucketId/files", authorizePermissions([Permissions.PAYMENTS_CREATE]), createFile);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files:
 *   get:
 *     tags: [Storage]
 *     summary: List files in a bucket
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: queries
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: total
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of files
 */
router.get("/buckets/:bucketId/files", authorizePermissions([Permissions.PAYMENTS_READ]), listFiles);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}:
 *   get:
 *     tags: [Storage]
 *     summary: Get file metadata
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *     responses:
 *       200:
 *         description: File metadata
 */
router.get("/buckets/:bucketId/files/:fileId", authorizePermissions([Permissions.PAYMENTS_READ]), getFile);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}/download:
 *   get:
 *     tags: [Storage]
 *     summary: Download file
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File download stream
 */
router.get(
  "/buckets/:bucketId/files/:fileId/download",
  authorizePermissions([Permissions.PAYMENTS_READ]),
  downloadFile
);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}/view:
 *   get:
 *     tags: [Storage]
 *     summary: View file in browser
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File view stream
 */
router.get(
  "/buckets/:bucketId/files/:fileId/view",
  authorizePermissions([Permissions.PAYMENTS_READ]),
  viewFile
);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}/preview:
 *   get:
 *     tags: [Storage]
 *     summary: Get file preview image
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *       - in: query
 *         name: quality
 *         schema:
 *           type: integer
 *       - in: query
 *         name: output
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Preview image stream
 */
router.get(
  "/buckets/:bucketId/files/:fileId/preview",
  authorizePermissions([Permissions.PAYMENTS_READ]),
  getFilePreview
);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}:
 *   put:
 *     tags: [Storage]
 *     summary: Update file metadata
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: File updated
 */
router.put(
  "/buckets/:bucketId/files/:fileId",
  authorizePermissions([Permissions.PAYMENTS_UPDATE]),
  updateFile
);

/**
 * @swagger
 * /storage/buckets/{bucketId}/files/{fileId}:
 *   delete:
 *     tags: [Storage]
 *     summary: Delete file
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         required: true
 *       - in: path
 *         name: fileId
 *         required: true
 *     responses:
 *       204:
 *         description: File deleted
 */
router.delete(
  "/buckets/:bucketId/files/:fileId",
  authorizePermissions([Permissions.PAYMENTS_DELETE]),
  deleteFile
);

export default router;
