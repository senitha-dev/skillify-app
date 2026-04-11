import { Router } from 'express';
import { getStats, getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, getStats);
router.get('/profile', authenticateToken, getProfile);

export default router;
