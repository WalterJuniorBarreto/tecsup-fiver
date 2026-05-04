import { Router } from 'express';
import express from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/create-intent', express.json(), paymentController.createIntent);

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);
router.get('/check-access/:serviceId', requireAuth, paymentController.checkAccess);
export default router;