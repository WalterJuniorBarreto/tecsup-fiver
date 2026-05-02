import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // Tu middleware de JWT

const router = Router();

router.get('/service/:serviceId', reviewController.getByService);

router.post('/', requireAuth, reviewController.create);

export default router;