import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { paypalController } from '../controllers/paypal.controller.js';

const router = Router();

router.post('/subscriptions/create-order', requireAuth, paypalController.createSubscriptionOrder);
router.post('/subscriptions/capture-order', requireAuth, paypalController.captureSubscriptionOrder);

export default router;
