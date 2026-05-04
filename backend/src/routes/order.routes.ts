import { Router } from 'express';
import { orderController } from '../controllers/order.controler.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // 🛡️ Guarda de seguridad

const router = Router();

// 🚀 Todas las rutas de órdenes DEBEN estar protegidas
router.use(requireAuth);

// Rutas para el Dashboard
router.get('/my-orders', orderController.getClientOrders);     // Para el cliente
router.get('/my-sales', orderController.getSellerOrders);      // Para el freelancer
router.patch('/:id/progress', orderController.updateProgress);

export default router;