import { Router } from "express";
import { authorizePermissions } from "../middlewares/authorize";
import { Permissions } from "../constants/permissions";

import {
  register,
  login,
  getMe,
  logout,
  logoutAll,
  updatePassword,
  createRecovery,
  resetPassword,
  verifyEmail
} from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & account management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, session created
 *       400:
 *         description: Invalid login credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     responses:
 *       200:
 *         description: Current user account details
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authorizePermissions([Permissions.USERS_MANAGE]), getMe);

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     tags: [Auth]
 *     summary: Logout current session
 *     responses:
 *       204:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/logout", authorizePermissions([Permissions.USERS_MANAGE]), logout);

/**
 * @swagger
 * /auth/logout-all:
 *   delete:
 *     tags: [Auth]
 *     summary: Logout from all sessions
 *     responses:
 *       204:
 *         description: All sessions deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/logout-all", authorizePermissions([Permissions.USERS_MANAGE]), logoutAll);

/**
 * @swagger
 * /auth/password:
 *   patch:
 *     tags: [Auth]
 *     summary: Update account password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, oldPassword]
 *             properties:
 *               password:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password data
 *       401:
 *         description: Unauthorized
 */
router.patch("/password", authorizePermissions([Permissions.USERS_MANAGE]), updatePassword);

/**
 * @swagger
 * /auth/recovery:
 *   post:
 *     tags: [Auth]
 *     summary: Send password recovery email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, url]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Recovery email sent
 *       400:
 *         description: Invalid recovery data
 */
router.post("/recovery", createRecovery);

/**
 * @swagger
 * /auth/recovery:
 *   put:
 *     tags: [Auth]
 *     summary: Complete password recovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, secret, password]
 *             properties:
 *               userId:
 *                 type: string
 *               secret:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid reset data
 */
router.put("/recovery", resetPassword);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Send email verification link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Invalid verification data
 */
router.post("/verify", verifyEmail);

export default router;
