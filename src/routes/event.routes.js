import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import * as eventController from '../controllers/event.controller.js';

const router = express.Router();

router.post('/:missionId', [
  authenticate,
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('start_date').isISO8601(),
  body('end_date').isISO8601()
], eventController.createEvent);

router.get('/mission/:missionId', authenticate, eventController.getMissionEvents);
router.put('/:id', [
  authenticate,
  body('title').optional(),
  body('description').optional(),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601()
], eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);

export default router;