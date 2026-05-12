import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyProfile, updateMyProfile, getUploadSignature , profileController} from '../controllers/profile.controller.js';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);
router.get('/upload-signature', requireAuth, getUploadSignature);
router.get('/freelancer/:id', profileController.getPublicFreelancer);

router.use(requireAuth);

router.get('/client', profileController.getProfile);
router.put('/client', profileController.updateProfile);
router.put('/client/password', profileController.changePassword);
router.post('/become-freelancer', requireAuth, profileController.becomeFreelancer);
export default router;