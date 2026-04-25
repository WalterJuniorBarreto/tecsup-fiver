import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyPlanDetails, getAllAvailablePlans, generatePaymentLink, mercadoPagoWebhook } from '../controllers/subscription.controller.js';

const router = Router();

router.get('/plans', requireAuth, getAllAvailablePlans); 
router.get('/my-plan', requireAuth, getMyPlanDetails); 
router.post('/create-preference', requireAuth, generatePaymentLink);
router.post('/webhook', mercadoPagoWebhook);

export default router;