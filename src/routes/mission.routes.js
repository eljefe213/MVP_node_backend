import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import * as missionController from '../controllers/mission.controller.js';

const router = express.Router();

// Mission routes
router.post('/', [
  authenticate,
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('location').notEmpty(),
  body('start_date').isISO8601(),
  body('end_date').isISO8601()
], missionController.createMission);

router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);

router.put('/:id', [
  authenticate,
  body('status').isIn(['draft', 'published', 'inProgress', 'completed', 'cancelled', 'archived'])
], missionController.updateMissionStatus);

router.delete('/:id', authenticate, missionController.deleteMission);

export default router;