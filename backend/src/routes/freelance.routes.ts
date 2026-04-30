import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createService, getMyServices, getServiceStats, getExploreServices, updateService, deleteService, getServiceById} from '../controllers/freelance.controller.js';

const router = Router();

router.get('/explore', getExploreServices);

router.get('/stats', requireAuth, getServiceStats);
router.get('/my-services', requireAuth, getMyServices);
router.post('/create', requireAuth, createService);

router.put('/update/:id', requireAuth, updateService);
router.delete('/delete/:id', requireAuth, deleteService);
router.get('/explore/:id', getServiceById);

export default router;