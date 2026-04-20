import { Router } from 'express';
import { login, register, verifyEmail, getMyProfile, googleLogin, forgotPassword, resetPassword, verifyResetCode, githubLogin} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);  
router.post('/verify-reset-code', verifyResetCode)
router.post('/github', githubLogin);
router.get('/me', requireAuth, getMyProfile);

export default router;
