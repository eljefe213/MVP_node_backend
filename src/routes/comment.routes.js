import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/:missionId', [
  authenticate,
  body('content').notEmpty().trim()
], commentController.createComment);

router.get('/mission/:missionId', authenticate, commentController.getMissionComments);
router.put('/:id', [
  authenticate,
  body('content').notEmpty().trim()
], commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);

export default router;