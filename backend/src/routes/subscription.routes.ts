import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyPlanDetails, getAllAvailablePlans} from '../controllers/subscription.controller.js';

const router = Router();

router.get('/plans', requireAuth, getAllAvailablePlans); 
router.get('/my-plan', requireAuth, getMyPlanDetails); 


export default router;