import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyProfile, updateMyProfile, getUploadSignature } from '../controllers/profile.controller.js';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);
router.get('/upload-signature', requireAuth, getUploadSignature);

export default router;