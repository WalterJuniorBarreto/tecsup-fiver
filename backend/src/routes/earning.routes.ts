import { Router } from 'express';
import { earningController } from '../controllers/earning.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/summary', requireAuth, earningController.getSummary);
router.get('/transactions', requireAuth, earningController.getTransactions);
router.post('/withdraw', requireAuth, earningController.requestWithdrawal);

export default router;