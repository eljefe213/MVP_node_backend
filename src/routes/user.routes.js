import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', authenticate, userController.getCurrentUser);
router.put('/me', authenticate, userController.updateUser);
router.delete('/me', authenticate, userController.deleteUser);

export default router;