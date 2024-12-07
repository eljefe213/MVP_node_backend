import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', 
  registerLimiter,
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email address'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('skills').optional().trim(),
    body('availability').optional().trim(),
    body('role').optional().isIn(['volunteer', 'admin', 'superadmin']).withMessage('Invalid role')
  ], 
  authController.register
);

router.post('/login',
  authLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email address'),
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
  ],
  authController.login
);

export default router;