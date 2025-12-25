import { Router } from "express";

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
router.post("/", createTeam);

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
router.get("/", listTeams);

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
router.get("/:teamId", getTeam);

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
router.put("/:teamId", updateTeam);

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
router.delete("/:teamId", deleteTeam);

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
router.post("/:teamId/memberships", createMembership);

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
router.get("/:teamId/memberships", listMemberships);

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
router.get("/:teamId/memberships/:membershipId", getMembership);

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
router.patch("/:teamId/memberships/:membershipId", updateMembership);

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
router.delete("/:teamId/memberships/:membershipId", deleteMembership);

export default router;
