import { Router } from 'express';
import { moderationController } from '../controllers/moderation.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/report', requireAuth, moderationController.submitReport);

export default router;