import { Router } from "express";
import { authorizePermissions } from "../middlewares/authorize";
import { Permissions } from "../constants/permissions";

import {
   createTeam,
   getTeam,
   listTeams,
   updateTeam,
   deleteTeam,

   createMembership,
   getMembership,
   listMemberships,
   updateMembership,
   deleteMembership
} from "../controllers/teams.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Teams and memberships management
 */

/* ===============================
   TEAMS
================================ */

/**
 * @swagger
 * /teams:
 *   post:
 *     tags: [Teams]
 *     summary: Create a new team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *       description: Team created successfully
 */
router.post("/", authorizePermissions([Permissions.USERS_MANAGE]), createTeam);

/**
 * @swagger
 * /teams:
 *   get:
 *     tags: [Teams]
 *     summary: List teams
 *     parameters:
 *       - in: query
 *         name: queries
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get("/", authorizePermissions([Permissions.USERS_MANAGE]), listTeams);

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     tags: [Teams]
 *     summary: Get team by ID
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team details
 */
router.get("/:teamId", authorizePermissions([Permissions.USERS_MANAGE]), getTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   put:
 *     tags: [Teams]
 *     summary: Update team name
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 */
router.put("/:teamId", authorizePermissions([Permissions.USERS_MANAGE]), updateTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     tags: [Teams]
 *     summary: Delete team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Team deleted
 */
router.delete("/:teamId", authorizePermissions([Permissions.USERS_MANAGE]), deleteTeam);

/* ===============================
   MEMBERSHIPS
================================ */

/**
 * @swagger
 * /teams/{teamId}/memberships:
 *   post:
 *     tags: [Teams]
 *     summary: Invite a member to the team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roles]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               url:
 *                 type: string
 *                 format: uri
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membership invitation created
 */
router.post("/:teamId/memberships", authorizePermissions([Permissions.USERS_MANAGE]), createMembership);

/**
 * @swagger
 * /teams/{teamId}/memberships:
 *   get:
 *     tags: [Teams]
 *     summary: List team memberships
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: queries
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: List of memberships
 */
router.get("/:teamId/memberships", authorizePermissions([Permissions.USERS_MANAGE]), listMemberships);

/**
 * @swagger
 * /teams/{teamId}/memberships/{membershipId}:
 *   get:
 *     tags: [Teams]
 *     summary: Get membership details
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership details
 */
router.get("/:teamId/memberships/:membershipId", authorizePermissions([Permissions.USERS_MANAGE]), getMembership);

/**
 * @swagger
 * /teams/{teamId}/memberships/{membershipId}:
 *   patch:
 *     tags: [Teams]
 *     summary: Update membership roles
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *       - in: path
 *         name: membershipId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roles]
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Membership updated
 */
router.patch("/:teamId/memberships/:membershipId", authorizePermissions([Permissions.USERS_MANAGE]), updateMembership);

/**
 * @swagger
 * /teams/{teamId}/memberships/{membershipId}:
 *   delete:
 *     tags: [Teams]
 *     summary: Remove member from team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *       - in: path
 *         name: membershipId
 *         required: true
 *     responses:
 *       204:
 *         description: Membership deleted
 */
router.delete("/:teamId/memberships/:membershipId", authorizePermissions([Permissions.USERS_MANAGE]), deleteMembership);

export default router;
