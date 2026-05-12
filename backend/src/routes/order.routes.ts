import { Router } from 'express';
import { orderController } from '../controllers/order.controler.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // 🛡️ Guarda de seguridad

const router = Router();

router.use(requireAuth);

router.get('/my-orders', orderController.getClientOrders);     // Para el cliente
router.get('/my-sales', orderController.getSellerOrders);      // Para el freelancer
router.patch('/:id/progress', orderController.updateProgress);

export default router;