import { Router } from 'express';
import { login, register, verifyEmail, getMyProfile, googleLogin } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/google', googleLogin);

router.get('/me', requireAuth, getMyProfile);

export default router;
