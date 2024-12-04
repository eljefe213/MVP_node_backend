import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import * as missionController from '../controllers/mission.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mission:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [draft, published, inProgress, completed, cancelled, archived]
 *         userId:
 *           type: integer
 */

/**
 * @swagger
 * /api/missions:
 *   post:
 *     summary: Create a new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input data
 *   get:
 *     summary: Get all missions
 *     tags: [Missions]
 *     responses:
 *       200:
 *         description: List of missions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 */
router.post('/', [
  authenticate,
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('location').notEmpty(),
  body('start_date').isISO8601(),
  body('end_date').isISO8601()
], missionController.createMission);

router.get('/', missionController.getAllMissions);

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     summary: Get mission by ID
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found
 *   put:
 *     summary: Update mission status
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, published, inProgress, completed, cancelled, archived]
 *     responses:
 *       200:
 *         description: Mission status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mission not found
 *   delete:
 *     summary: Delete mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Mission deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mission not found
 */
router.get('/:id', missionController.getMissionById);
router.put('/:id', [
  authenticate,
  body('status').isIn(['draft', 'published', 'inProgress', 'completed', 'cancelled', 'archived'])
], missionController.updateMissionStatus);
router.delete('/:id', authenticate, missionController.deleteMission);

export default router;