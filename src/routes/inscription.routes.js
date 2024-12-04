import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as inscriptionController from '../controllers/inscription.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscription:
 *       type: object
 *       required:
 *         - hours
 *       properties:
 *         id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         hours:
 *           type: integer
 *           minimum: 1
 *         userId:
 *           type: integer
 *         missionId:
 *           type: integer
 */

/**
 * @swagger
 * /api/inscriptions/{missionId}:
 *   post:
 *     summary: Create a new inscription for a mission
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: missionId
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
 *               - hours
 *             properties:
 *               hours:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Inscription created successfully
 *       400:
 *         description: Invalid input or already inscribed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mission not found
 */
router.post('/:missionId', authenticate, inscriptionController.createInscription);

/**
 * @swagger
 * /api/inscriptions/mission/{missionId}:
 *   get:
 *     summary: Get all inscriptions for a mission
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of inscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscription'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/mission/:missionId', authenticate, inscriptionController.getMissionInscriptions);

/**
 * @swagger
 * /api/inscriptions/user:
 *   get:
 *     summary: Get all inscriptions for current user
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's inscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscription'
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticate, inscriptionController.getUserInscriptions);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   put:
 *     summary: Update inscription status
 *     tags: [Inscriptions]
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
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Inscription status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inscription not found
 *   delete:
 *     summary: Cancel inscription
 *     tags: [Inscriptions]
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
 *         description: Inscription cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inscription not found
 */
router.put('/:id', authenticate, inscriptionController.updateInscriptionStatus);
router.delete('/:id', authenticate, inscriptionController.cancelInscription);

export default router;