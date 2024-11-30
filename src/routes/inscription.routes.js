import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as inscriptionController from '../controllers/inscription.controller.js';

const router = express.Router();

router.post('/:missionId', authenticate, inscriptionController.createInscription);
router.get('/mission/:missionId', authenticate, inscriptionController.getMissionInscriptions);
router.get('/user', authenticate, inscriptionController.getUserInscriptions);
router.put('/:id', authenticate, inscriptionController.updateInscriptionStatus);
router.delete('/:id', authenticate, inscriptionController.cancelInscription);

export default router;