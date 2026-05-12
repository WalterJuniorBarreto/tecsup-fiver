import { Router } from 'express';
import { favoriteController } from '../controllers/favorite.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/toggle', favoriteController.toggle);
router.get('/', favoriteController.getMyFavorites);

export default router;