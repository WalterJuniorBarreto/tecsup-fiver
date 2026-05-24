import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
<<<<<<< Updated upstream
import { getMyPlanDetails, getAllAvailablePlans, createSubscriptionPayment } from '../controllers/subscription.controller.js';
=======
import { getMyPlanDetails, getAllAvailablePlans, createSubscriptionPayment} from '../controllers/subscription.controller.js';
>>>>>>> Stashed changes

const router = Router();

router.get('/plans', requireAuth, getAllAvailablePlans); 
router.get('/my-plan', requireAuth, getMyPlanDetails); 
router.post('/create-intent', requireAuth, createSubscriptionPayment);


export default router;
