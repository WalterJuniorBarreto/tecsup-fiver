import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();


router.post('/webhook', paymentController.webhook);
router.post('/create-preference', requireAuth, paymentController.generateCheckout);
router.get('/check-access/:serviceId', requireAuth, paymentController.verifyServiceAccess);
router.post('/sync', requireAuth, paymentController.syncPayment);
router.post('/process', requireAuth, paymentController.processCustomPayment);
router.get('/my-orders', requireAuth, paymentController.getMyOrders);
router.get('/received-orders', requireAuth, paymentController.getReceivedOrders);
router.post('/update-progress', requireAuth, paymentController.updateOrderProgress)
router.post('/webhook', (req, res) => {
  res.status(200).send('OK');
});

export default router;