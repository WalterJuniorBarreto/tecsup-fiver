import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; 
import { moderationController } from '../controllers/moderation.controller.js';

const router = Router();

router.get('/users', requireAuth, adminController.getUsers);
router.post('/users', requireAuth, adminController.createUser);
router.put('/users/:id', requireAuth, adminController.updateUser);
router.patch('/users/:id/toggle-status', requireAuth, adminController.toggleStatus);
router.get('/services', requireAuth, adminController.getServices);
router.patch('/services/:id/toggle-status', requireAuth, adminController.toggleService);
router.get('/moderation', requireAuth, moderationController.getAdminReports);
router.patch('/moderation/:id', requireAuth, moderationController.resolveReport);
router.get('/finances', requireAuth, adminController.getFinances);

export default router;