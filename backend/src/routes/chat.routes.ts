import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyChats, getChatHistory, deleteChat, searchGlobalUsers, markAsRead, uploadAttachment} from '../controllers/chat.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/users/search', requireAuth, searchGlobalUsers);
router.get('/', requireAuth, getMyChats); 
router.get('/:conversationId', requireAuth, getChatHistory);
router.delete('/:conversationId', requireAuth, deleteChat);
router.post('/:conversationId/read', requireAuth, markAsRead);
router.post('/upload', requireAuth, upload.single('file'), uploadAttachment);

export default router;