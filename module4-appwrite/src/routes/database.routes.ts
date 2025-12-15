import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById
} from "../controllers/database.controller";

const router = Router();

/**
 * @swagger
 * /api/database/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Database]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post("/projects", createProject);

/**
 * @swagger
 * /api/database/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/projects", getAllProjects);

/**
 * @swagger
 * /api/database/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Database]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 */
router.get("/projects/:id", getProjectById);

export default router;
